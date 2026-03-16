// lib/telnyx.ts
import "server-only";

const apiKey = process.env.TELNYX_API_KEY || "";
const fromNumber =
  process.env.TELNYX_FROM_NUMBER ||
  process.env.TELNYX_PHONE_NUMBER ||
  process.env.SMS_FROM ||
  "";
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID || "";
const smsDisabled = process.env.DISABLE_LEAD_SMS === "1";

// Hard cap so SMS can't hang forever either
const TELNYX_SEND_HARD_TIMEOUT_MS = 12_000;

// Telnyx expects E.164 (+ followed by digits). E.164 max length is 15 digits (excluding '+').
const E164_REGEX = /^\+\d{7,15}$/;

function withTimeout<T>(
  label: string,
  ms: number,
  promiseFactory: (signal: AbortSignal) => Promise<T>
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort(new Error(`${label} timed out after ${ms}ms`));
  }, ms);

  return promiseFactory(controller.signal).finally(() => {
    clearTimeout(timeout);
  });
}

/**
 * Normalizes common US inputs to E.164.
 * - If already starts with "+", returns as-is (after trim).
 * - If 10 digits -> assumes US (+1)
 * - If 11 digits starting with 1 -> +<digits>
 * - Otherwise returns "+<digits>" (best-effort) and validation will decide if it's usable.
 */
function normalizePhone(input: string): string {
  const value = input.trim();

  if (!value) return value;
  if (value.startsWith("+")) return value;

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return `+${digits}`;
}

function isValidE164(value: string): boolean {
  return E164_REGEX.test(value);
}

function generateCorrelationId(): string {
  // Always unique enough for logs, even if crypto.randomUUID isn't available
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) return uuid;
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type SmsReceiptParams = {
  to: string;
  name: string | null;
  formType: "contact" | "quote" | "billing" | "support";
  /**
   * If provided, used as idempotency key + log correlation.
   * If not provided, we generate a unique id for log correlation only.
   */
  requestId?: string;
};

type TelnyxSendMessageResponse = {
  data?: {
    id?: string;
    record_type?: string;
    direction?: string;
    type?: string;
  };
  errors?: unknown;
};

export async function sendLeadSmsReceipt({
  to,
  name,
  formType,
  requestId,
}: SmsReceiptParams): Promise<void> {
  // Always have a unique correlation id for logs (even if caller didn't provide one)
  const correlationId = requestId?.trim() || generateCorrelationId();
  const pfx = `[telnyx:${correlationId}]`;

  if (smsDisabled) {
    console.log(`${pfx} SMS disabled via DISABLE_LEAD_SMS; skipping.`, {
      to,
      formType,
    });
    return;
  }

  if (!to) {
    console.warn(`${pfx} No destination phone number provided; skipping SMS.`);
    return;
  }

  if (!apiKey) {
    console.warn(`${pfx} TELNYX_API_KEY not set; skipping SMS.`);
    return;
  }

  if (!fromNumber) {
    console.warn(
      `${pfx} No Telnyx sender number configured. Set TELNYX_FROM_NUMBER (or TELNYX_PHONE_NUMBER / SMS_FROM).`
    );
    return;
  }

  const normalizedTo = normalizePhone(to);
  const normalizedFrom = normalizePhone(fromNumber);

  // Fail fast on obviously bad numbers to avoid confusing "sent OK" handoff logs
  if (!isValidE164(normalizedTo)) {
    console.warn(
      `${pfx} Invalid destination phone after normalization; skipping SMS.`,
      {
        inputTo: to,
        normalizedTo,
      }
    );
    return;
  }

  if (!isValidE164(normalizedFrom)) {
    console.warn(`${pfx} Invalid sender phone after normalization; skipping SMS.`, {
      inputFrom: fromNumber,
      normalizedFrom,
    });
    return;
  }

  const displayName = name?.trim() || "there";

  const text = (() => {
    switch (formType) {
      case "quote":
        return `Hi ${displayName}, we received your quote request at Next Forge Pro. We'll review it and follow up shortly.`;
      case "support":
        return `Hi ${displayName}, we received your support request at Next Forge Pro and will get back to you soon.`;
      case "billing":
        return `Hi ${displayName}, we received your billing inquiry at Next Forge Pro. We'll review it and follow up shortly.`;
      case "contact":
      default:
        return `Hi ${displayName}, we received your message at Next Forge Pro. We'll be in touch soon.`;
    }
  })();

  const payload: Record<string, unknown> = {
    from: normalizedFrom,
    to: normalizedTo,
    text,
  };

  if (messagingProfileId) {
    payload.messaging_profile_id = messagingProfileId;
  }

  console.log(`${pfx} SMS send START`, {
    from: normalizedFrom,
    to: normalizedTo,
    formType,
    messagingProfileId: messagingProfileId ? "(set)" : "(missing)",
    // Only set idempotency when caller supplied a real requestId
    idempotencyKey: requestId?.trim() ? "(set)" : "(not set)",
  });

  try {
    const res = await withTimeout(
      "Telnyx POST /v2/messages",
      TELNYX_SEND_HARD_TIMEOUT_MS,
      async (signal) => {
        // IMPORTANT:
        // Only set Idempotency-Key when caller supplied a real requestId.
        // Never fall back to a constant default or you'll dedupe unintentionally.
        const headers: Record<string, string> = {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };

        if (requestId?.trim()) {
          headers["Idempotency-Key"] = requestId.trim();
        }

        const response = await fetch("https://api.telnyx.com/v2/messages", {
          method: "POST",
          headers, // <-- single headers object (no duplicate headers key)
          body: JSON.stringify(payload),
          cache: "no-store",
          signal,
        });

        const rawText = await response.text();
        let json: unknown = null;

        try {
          json = rawText ? JSON.parse(rawText) : null;
        } catch {
          json = rawText;
        }

        if (!response.ok) {
          throw new Error(
            `Telnyx API error ${response.status}: ${
              typeof json === "string" ? json : JSON.stringify(json)
            }`
          );
        }

        return json as TelnyxSendMessageResponse;
      }
    );

    const messageId = res?.data?.id ?? "(missing)";

    console.log(`${pfx} SMS sent OK`, {
      to: normalizedTo,
      formType,
      messageId,
      recordType: res?.data?.record_type ?? "(missing)",
      direction: res?.data?.direction ?? "(missing)",
      type: res?.data?.type ?? "(missing)",
    });

    // If Telnyx didn’t return an id, treat as suspicious (helps avoid “sent OK” confusion)
    if (!res?.data?.id) {
      console.warn(`${pfx} Telnyx response missing message id; investigate response.`, {
        response: res,
      });
    }
  } catch (err) {
    console.error(`${pfx} Failed to send SMS:`, err);
    throw err;
  }
}