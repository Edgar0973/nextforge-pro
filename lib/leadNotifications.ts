import "server-only";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

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
  process.env.CONTACT_NOTIFY_EMAIL ?? "nextforgepro@outlook.com";
const QUOTE_NOTIFY_EMAIL =
  process.env.QUOTE_NOTIFY_EMAIL ?? "nextforgepro@outlook.com";

const EMAILS_DISABLED = process.env.DISABLE_LEAD_EMAILS === "1";

// Outlook SMTP config
const OUTLOOK_SMTP_HOST =
  process.env.OUTLOOK_SMTP_HOST ?? "smtp-mail.outlook.com";
const OUTLOOK_SMTP_PORT = Number(process.env.OUTLOOK_SMTP_PORT ?? "587");
const OUTLOOK_SMTP_USER = process.env.OUTLOOK_SMTP_USER ?? "";
const OUTLOOK_SMTP_PASS = process.env.OUTLOOK_SMTP_PASS ?? "";

// Log config once per cold start
console.log("[leadNotifications] Module loaded with Outlook SMTP config:", {
  EMAILS_DISABLED,
  OUTLOOK_SMTP_HOST,
  OUTLOOK_SMTP_PORT,
  HAS_OUTLOOK_USER: !!OUTLOOK_SMTP_USER,
  HAS_OUTLOOK_PASS: !!OUTLOOK_SMTP_PASS,
  CONTACT_NOTIFY_EMAIL,
  QUOTE_NOTIFY_EMAIL,
});

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!OUTLOOK_SMTP_HOST || !OUTLOOK_SMTP_USER || !OUTLOOK_SMTP_PASS) {
    console.warn(
      "[leadNotifications] Outlook SMTP not fully configured; will log emails instead of sending.",
      {
        OUTLOOK_SMTP_HOST,
        HAS_OUTLOOK_USER: !!OUTLOOK_SMTP_USER,
        HAS_OUTLOOK_PASS: !!OUTLOOK_SMTP_PASS,
      }
    );
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: OUTLOOK_SMTP_HOST,
      port: OUTLOOK_SMTP_PORT,
      secure: OUTLOOK_SMTP_PORT === 465, // false for 587 (STARTTLS)
      auth: {
        user: OUTLOOK_SMTP_USER,
        pass: OUTLOOK_SMTP_PASS,
      },
    });

    console.log(
      "[leadNotifications] Outlook SMTP transporter created for user:",
      OUTLOOK_SMTP_USER
    );
  }

  return transporter;
}

function buildSubject(lead: LeadRecord): string {
  const who = lead.name || lead.email;
  if (lead.type === "quote") {
    return `New QUOTE request from ${who}`;
  }
  return `New CONTACT from ${who}`;
}

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

  console.log("[leadNotifications] Preparing Outlook SMTP notification:", {
    leadId: lead.id,
    type: lead.type,
    to,
    fromUser: OUTLOOK_SMTP_USER,
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

  console.log("\n[leadNotifications] New lead notification (Outlook SMTP)");
  console.log("To:", to);
  console.log("Subject:", subject);

  const smtpTransporter = getTransporter();

  if (!smtpTransporter) {
    console.log(
      "[leadNotifications] Outlook SMTP not configured; logging body instead of sending.\n"
    );
    console.log("Body:\n" + text + "\n");
    return;
  }

  try {
    const info = await smtpTransporter.sendMail({
      from: `Next Forge Pro <${OUTLOOK_SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log("[leadNotifications] Email sent via Outlook SMTP:", {
      leadId: lead.id,
      to,
      messageId: info.messageId,
      response: info.response,
    });
  } catch (err) {
    console.error(
      "[leadNotifications] Failed to send email via Outlook SMTP; falling back to log-only:",
      err
    );
    console.log("Body:\n" + text + "\n");
  }
}