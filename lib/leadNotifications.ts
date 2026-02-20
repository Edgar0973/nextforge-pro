import "server-only";
import nodemailer from "nodemailer";

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

const OUTLOOK_SMTP_HOST =
  process.env.OUTLOOK_SMTP_HOST ?? "smtp-mail.outlook.com";
const OUTLOOK_SMTP_PORT = process.env.OUTLOOK_SMTP_PORT
  ? Number(process.env.OUTLOOK_SMTP_PORT)
  : 587;
const OUTLOOK_SMTP_USER = process.env.OUTLOOK_SMTP_USER ?? "";
const OUTLOOK_SMTP_PASS = process.env.OUTLOOK_SMTP_PASS ?? "";

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
 * Create a Nodemailer transporter for Outlook SMTP.
 */
function createTransport() {
  if (!OUTLOOK_SMTP_USER || !OUTLOOK_SMTP_PASS) {
    console.warn(
      "[leadNotifications] OUTLOOK_SMTP_USER or OUTLOOK_SMTP_PASS not set; will log emails instead of sending."
    );
    return null;
  }

  return nodemailer.createTransport({
    host: OUTLOOK_SMTP_HOST,
    port: OUTLOOK_SMTP_PORT,
    secure: OUTLOOK_SMTP_PORT === 465, // false for 587
    auth: {
      user: OUTLOOK_SMTP_USER,
      pass: OUTLOOK_SMTP_PASS,
    },
  });
}

/**
 * Send (or log) a lead notification.
 *
 * - If DISABLE_LEAD_EMAILS=1  → no-op, just logs that emails are disabled.
 * - If SMTP envs are missing → logs the email contents (dev-safe).
 * - If SMTP is configured    → attempts to send via Outlook, logs failures.
 *
 * Safe to `await` inside API routes; it never throws out of this function.
 */
export async function sendLeadNotification(lead: LeadRecord) {
  if (EMAILS_DISABLED) {
    console.log("[leadNotifications] Emails disabled; skipping send.");
    return;
  }

  const to =
    lead.type === "quote" ? QUOTE_NOTIFY_EMAIL : CONTACT_NOTIFY_EMAIL;

  if (!to) {
    console.warn(
      "[leadNotifications] No destination email (CONTACT_NOTIFY_EMAIL / QUOTE_NOTIFY_EMAIL) configured; logging only."
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

  const transporter = createTransport();

  // If no transporter (SMTP not configured), just log the body and exit.
  if (!transporter) {
    console.log(
      "[leadNotifications] SMTP not configured; logging body instead of sending.\n"
    );
    console.log("Body:\n" + text + "\n");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `Next Forge Pro <${OUTLOOK_SMTP_USER || to}>`,
      to,
      subject,
      text,
      replyTo: lead.email || undefined,
    });

    console.log(
      "[leadNotifications] Email sent successfully via Outlook SMTP for lead:",
      lead.id,
      "MessageId:",
      info.messageId
    );
  } catch (err) {
    console.error(
      "[leadNotifications] Failed to send email via Outlook SMTP; falling back to log-only:",
      err
    );
    console.log("Body:\n" + text + "\n");
  }
}