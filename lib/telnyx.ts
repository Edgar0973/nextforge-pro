// lib/telnyx.ts
import Telnyx from 'telnyx';

const telnyxApiKey = process.env.TELNYX_API_KEY;
const telnyxFromNumber = process.env.TELNYX_FROM_NUMBER;
const telnyxMessagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;

const DISABLE_LEAD_SMS =
  process.env.DISABLE_LEAD_SMS === '1' ||
  process.env.DISABLE_LEAD_SMS === 'true';

if (!telnyxApiKey) {
  console.warn('[Telnyx] TELNYX_API_KEY is not set. SMS will be disabled.');
}

const telnyxClient = telnyxApiKey
  ? new Telnyx({ apiKey: telnyxApiKey })
  : null;

export type LeadFormType = 'contact' | 'quote' | 'support' | 'billing';

interface SendLeadSmsReceiptOptions {
  to: string;
  name?: string | null;
  formType: LeadFormType;
}

export async function sendLeadSmsReceipt(
  options: SendLeadSmsReceiptOptions,
): Promise<void> {
  const { to, name, formType } = options;

  if (DISABLE_LEAD_SMS) {
    console.log('[Telnyx] DISABLE_LEAD_SMS is set. Skipping SMS.');
    return;
  }

  if (!telnyxClient) {
    console.warn('[Telnyx] Client not initialized. Skipping SMS.');
    return;
  }

  if (!to) {
    console.warn('[Telnyx] No destination phone number provided. Skipping SMS.');
    return;
  }

  if (!telnyxFromNumber && !telnyxMessagingProfileId) {
    console.warn(
      '[Telnyx] Neither TELNYX_FROM_NUMBER nor TELNYX_MESSAGING_PROFILE_ID set. Skipping SMS.',
    );
    return;
  }

  const text = buildSmsBody({
    name: name?.trim() || 'there',
    formType,
  });

  const payload: Record<string, unknown> = {
    to,
    text,
    type: 'SMS',
  };

  if (telnyxFromNumber) {
    payload.from = telnyxFromNumber;
  }
  if (telnyxMessagingProfileId) {
    payload.messaging_profile_id = telnyxMessagingProfileId;
  }

  try {
    const res = await telnyxClient.messages.send(payload);
    console.log('[Telnyx] SMS sent:', res?.data?.data?.id ?? res?.data);
  } catch (error) {
    console.error('[Telnyx] Failed to send SMS receipt', error);
  }
}

function buildSmsBody(args: { name: string; formType: LeadFormType }): string {
  const { name, formType } = args;

  switch (formType) {
    case 'quote':
      return `Hi ${name}, we’ve received your quote request and will follow up shortly. - NextForge (no reply)`;
    case 'contact':
      return `Hi ${name}, thanks for contacting us. We’ve received your message and will get back to you soon. - NextForge (no reply)`;
    case 'support':
      return `Hi ${name}, your support request has been received. We’ll reach out with an update soon. - NextForge (no reply)`;
    case 'billing':
      return `Hi ${name}, we’ve received your billing inquiry and will review it shortly. - NextForge (no reply)`;
    default:
      return `Hi ${name}, we’ve received your request and will be in touch soon. - NextForge (no reply)`;
  }
}