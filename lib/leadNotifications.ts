import "server-only";
import { Resend } from "resend";

export type LeadType = "contact" | "quote";

export type LeadRecord = {
  id: string;
  type: LeadType | string;
  name: string | null;
  email: string;
  company: string | null;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string | null;
  source_page: string | null;
  created_at: string | Date;
};

const CONTACT_NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL ?? "contact@nextforgepro.com";
const QUOTE_NOTIFY_EMAIL =
  process.env.QUOTE_NOTIFY_EMAIL ?? "quotes@nextforgepro.com";

const EMAILS_DISABLED = process.env.DISABLE_LEAD_EMAILS === "1";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ??
  "Next Forge Pro <notifications@nextforgepro.com>";

// Log configuration at module load (shows up once per cold start)
console.log("[leadNotifications] Module loaded with config:", {
  EMAILS_DISABLED,
  HAS_RESEND_API_KEY: !!RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  CONTACT_NOTIFY_EMAIL,
  QUOTE_NOTIFY_EMAIL,
});

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn(
      "[leadNotifications] RESEND_API_KEY not set; will log emails instead of sending."
    );
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
    console.log("[leadNotifications] Resend client created.");
  }

  return resendClient;
}

/**
 * Build a subject line for the lead notification.
 */
function buildSubject(lead: LeadRecord): string {
  const who = lead.name || lead.email;
  if (lead.type === "quote") {
    return `New QUOTE request from ${who}`;
  }
  return `New CONTACT from ${who}`;
}

/**
 * Build a plain-text body for the lead notification.
 */
function buildPlainTextBody(lead: LeadRecord): string {
  let created = "N/A";
  try {
    if (lead.created_at) {
      const date =
        typeof lead.created_at === "string"
          ? new Date(lead.created_at)
          : lead.created_at;
      if (!Number.isNaN(date.getTime())) {
        created = date.toISOString();
      }
    }
  } catch {
    created = "N/A";
  }

  return [
    `Type:      ${lead.type}`,
    `Created:   ${created}`,
    `From:      ${lead.name || "N/A"} <${lead.email}>`,
    `Company:   ${lead.company || "N/A"}`,
    `Source:    ${lead.source_page || "N/A"}`,
    "",
    `Project type: ${lead.project_type || "N/A"}`,
    `Budget:       ${lead.budget || "N/A"}`,
    `Timeline:     ${lead.timeline || "N/A"}`,
    "",
    "Message:",
    lead.message || "(no message provided)",
  ].join("\n");
}

/**
 * Send (or log) a lead notification via Resend.
 *
 * - If DISABLE_LEAD_EMAILS=1  → no-op, just logs that emails are disabled.
 * - If RESEND_API_KEY missing → logs the email contents (dev-safe).
 * - If Resend is configured   → attempts to send via Resend, logs failures.
 *
 * Safe to `await` inside API routes; it never throws out of this function.
 */
export async function sendLeadNotification(lead: LeadRecord) {
  if (EMAILS_DISABLED) {
    console.log(
      "[leadNotifications] Emails disabled via DISABLE_LEAD_EMAILS; skipping send.",
      { leadId: lead.id, type: lead.type }
    );
    return;
  }

  const to =
    lead.type === "quote" ? QUOTE_NOTIFY_EMAIL : CONTACT_NOTIFY_EMAIL;

  console.log("[leadNotifications] Preparing notification:", {
    leadId: lead.id,
    type: lead.type,
    to,
    from: RESEND_FROM_EMAIL,
    HAS_RESEND_API_KEY: !!RESEND_API_KEY,
  });

  if (!to) {
    console.warn(
      "[leadNotifications] No destination email configured (CONTACT_NOTIFY_EMAIL / QUOTE_NOTIFY_EMAIL); logging only."
    );
    console.log(buildPlainTextBody(lead));
    return;
  }

  const subject = buildSubject(lead);
  const text = buildPlainTextBody(lead);

  // Always log what we're about to do (useful even in production)
  console.log("\n[leadNotifications] New lead notification");
  console.log("To:", to);
  console.log("Subject:", subject);

  const resend = getResendClient();

  // If no Resend client (API key not configured), just log the body and exit.
  if (!resend) {
    console.log(
      "[leadNotifications] Resend not configured; logging body instead of sending.\n"
    );
    console.log("Body:\n" + text + "\n");
    return;
  }

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      text,
    });

    console.log("[leadNotifications] Email sent via Resend:", {
      leadId: lead.id,
      to,
      resultId: result?.data?.id ?? "(no id)",
    });
  } catch (err) {
    console.error(
      "[leadNotifications] Failed to send email via Resend; falling back to log-only:",
      err
    );
    console.log("Body:\n" + text + "\n");
  }
}