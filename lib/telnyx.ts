// lib/telnyx.ts
import "server-only";
import telnyx from "telnyx";

const apiKey = process.env.TELNYX_API_KEY || "";
const fromNumber = process.env.TELNYX_FROM_NUMBER || "";
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID || "";
const smsDisabled = process.env.DISABLE_LEAD_SMS === "1";

let client: any = null;

function getClient(): any {
  if (!apiKey) {
    console.warn("[telnyx] TELNYX_API_KEY not set; SMS will be logged only.");
    return null;
  }

  if (!client) {
    // Cast to any so we can call it without TS complaining
    const telnyxFactory = telnyx as any;
    client = telnyxFactory(apiKey);
    console.log("[telnyx] Client initialized.");
  }

  return client;
}

type SmsReceiptParams = {
  to: string;
  name: string | null;
  formType: "contact" | "quote" | "billing" | "support";
};

export async function sendLeadSmsReceipt({
  to,
  name,
  formType,
}: SmsReceiptParams): Promise<void> {
  if (smsDisabled) {
    console.log("[telnyx] SMS disabled via DISABLE_LEAD_SMS; skipping.", {
      to,
      formType,
    });
    return;
  }

  if (!to) {
    console.warn("[telnyx] No destination phone number provided; skipping SMS.");
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

  console.log("[telnyx] Preparing SMS:", {
    from: sender,
    to,
    formType,
    messagingProfileId,
  });

  if (!telnyxClient || !sender) {
    console.log(
      "[telnyx] Missing client or fromNumber; logging SMS instead of sending.",
      { to, message }
    );
    return;
  }

  const payload = {
    from: sender,
    to,
    text: message,
    // messaging_profile_id is optional but recommended
    messaging_profile_id: messagingProfileId || undefined,
  };

  try {
    const res = await telnyxClient.messages.create(payload);
    console.log("[telnyx] SMS sent:", {
      to,
      formType,
      messageId: res?.data?.id ?? res?.data,
    });
  } catch (err) {
    console.error("[telnyx] Failed to send SMS:", err);
  }
}