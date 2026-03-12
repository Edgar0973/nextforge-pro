// lib/telnyx.ts
import "server-only";
import telnyx from "telnyx";

const apiKey = process.env.TELNYX_API_KEY || "";
const fromNumber = process.env.TELNYX_FROM_NUMBER || "";
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID || "";
const smsDisabled = process.env.DISABLE_LEAD_SMS === "1";

// Hard cap so SMS can't hang forever either
const TELNYX_SEND_HARD_TIMEOUT_MS = 12_000;

let client: any = null;

function getClient(): any {
  if (!apiKey) {
    console.warn("[telnyx] TELNYX_API_KEY not set; SMS will be logged only.");
    return null;
  }

  if (!client) {
    const telnyxFactory = telnyx as any;
    client = telnyxFactory(apiKey);
    console.log("[telnyx] Client initialized.");
  }

  return client;
}

function withTimeout<T>(label: string, ms: number, promise: Promise<T>): Promise<T> {
  let timeout: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

type SmsReceiptParams = {
  to: string;
  name: string | null;
  formType: "contact" | "quote" | "billing" | "support";
  requestId?: string;
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

  const telnyxClient = getClient();
  const sender = fromNumber;

  const displayName = name || "there";

  const message = (() => {
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

  console.log(`${pfx} Preparing SMS:`, {
    from: sender,
    to,
    formType,
    messagingProfileId: messagingProfileId ? "(set)" : "(missing)",
  });

  if (!telnyxClient || !sender) {
    console.log(
      `${pfx} Missing client or fromNumber; logging SMS instead of sending.`,
      { to, message }
    );
    return;
  }

  const payload = {
    from: sender,
    to,
    text: message,
    messaging_profile_id: messagingProfileId || undefined,
  };

  try {
    console.log(`${pfx} telnyxClient.messages.create START`);
    const res = await withTimeout(
      "Telnyx messages.create",
      TELNYX_SEND_HARD_TIMEOUT_MS,
      telnyxClient.messages.create(payload)
    );

    console.log(`${pfx} SMS sent:`, {
      to,
      formType,
      messageId: (res as any)?.data?.id ?? (res as any)?.data,
    });
  } catch (err) {
    console.error(`${pfx} Failed to send SMS:`, err);
  }
}