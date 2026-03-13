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

function normalizePhone(input: string): string {
  const value = input.trim();

  if (!value) return value;
  if (value.startsWith("+")) return value;

  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return `+${digits}`;
}

type SmsReceiptParams = {
  to: string;
  name: string | null;
  formType: "contact" | "quote" | "billing" | "support";
  requestId?: string;
};

type TelnyxSendMessageResponse = {
  data?: {
    id?: string;
    record_type?: string;
    direction?: string;
    type?: string;
  };
};

export async function sendLeadSmsReceipt({
  to,
  name,
  formType,
  requestId,
}: SmsReceiptParams): Promise<void> {
  const reqId = requestId ?? "no-reqid";
  const pfx = `[telnyx:${reqId}]`;

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
  });

  try {
    const res = await withTimeout(
      "Telnyx POST /v2/messages",
      TELNYX_SEND_HARD_TIMEOUT_MS,
      async (signal) => {
        const response = await fetch("https://api.telnyx.com/v2/messages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...(reqId ? { "Idempotency-Key": reqId } : {}),
          },
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

    console.log(`${pfx} SMS sent OK`, {
      to: normalizedTo,
      formType,
      messageId: res?.data?.id ?? "(missing)",
      recordType: res?.data?.record_type ?? "(missing)",
      direction: res?.data?.direction ?? "(missing)",
      type: res?.data?.type ?? "(missing)",
    });
  } catch (err) {
    console.error(`${pfx} Failed to send SMS:`, err);
    throw err;
  }
}