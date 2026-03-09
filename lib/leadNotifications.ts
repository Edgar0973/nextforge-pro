import "server-only";
import nodemailer from "nodemailer";

export type LeadType = "contact" | "quote" | "support" | "billing";

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
const SUPPORT_NOTIFY_EMAIL =
  process.env.SUPPORT_NOTIFY_EMAIL ?? "support@nextforgepro.com";
const BILLING_NOTIFY_EMAIL =
  process.env.BILLING_NOTIFY_EMAIL ?? "billing@nextforgepro.com";

const EMAILS_DISABLED = process.env.DISABLE_LEAD_EMAILS === "1";
const RECEIPT_EMAILS_DISABLED =
  process.env.DISABLE_LEAD_RECEIPT_EMAILS === "1";

// SMTP (NextForgePro Namecheap Private Email)
const SMTP_HOST = process.env.NEXTFORGEPRO_EMAIL_SMTP_HOST || "";
const SMTP_PORT = process.env.NEXTFORGEPRO_EMAIL_SMTP_PORT
  ? Number(process.env.NEXTFORGEPRO_EMAIL_SMTP_PORT)
  : 0;
const SMTP_USER =
  process.env.NEXTFORGEPRO_EMAIL_SMTP_USER || "notifications@nextforgepro.com";
const SMTP_PASS = process.env.NEXTFORGEPRO_EMAIL_SMTP_PASS || "";

// Log config once on module load
console.log("[leadNotifications] Module loaded with SMTP config:", {
  EMAILS_DISABLED,
  RECEIPT_EMAILS_DISABLED,
  HAS_SMTP_CONFIG: !!SMTP_HOST && !!SMTP_PORT && !!SMTP_USER && !!SMTP_PASS,
  SMTP_USER,
  CONTACT_NOTIFY_EMAIL,
  QUOTE_NOTIFY_EMAIL,
  SUPPORT_NOTIFY_EMAIL,
  BILLING_NOTIFY_EMAIL,
});

let smtpTransporter: nodemailer.Transporter | null = null;

function getSmtpTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[leadNotifications] SMTP variables missing; will log emails instead of sending."
    );
    return null;
  }

  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = SSL, 587 = STARTTLS (not secure here)
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    console.log("[leadNotifications] SMTP transporter created.");
  }

  return smtpTransporter;
}

async function sendMail(options: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}) {
  const transporter = getSmtpTransporter();

  const fromAddress = SMTP_USER;

  if (!transporter) {
    console.log(
      "[leadNotifications] SMTP not configured; logging email instead of sending."
    );
    console.log("From:", fromAddress);
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    if (options.text) {
      console.log("Text body:\n", options.text);
    }
    if (options.html) {
      console.log("HTML body:\n", options.html);
    }
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text,
      replyTo: options.replyTo,
    });

    console.log("[leadNotifications] Email sent via SMTP:", {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });
  } catch (err) {
    console.error(
      "[leadNotifications] Failed to send email via SMTP; logging fallback:",
      err
    );
    console.log("From:", fromAddress);
    console.log("To:", options.to);
    console.log("Subject:", options.subject);
    if (options.text) {
      console.log("Text body:\n", options.text);
    }
    if (options.html) {
      console.log("HTML body:\n", options.html);
    }
  }
}

function buildSubject(lead: LeadRecord): string {
  const who = lead.name || lead.email;
  const type = (lead.type as LeadType) || "contact";

  switch (type) {
    case "quote":
      return `New QUOTE request from ${who}`;
    case "support":
      return `New SUPPORT request from ${who}`;
    case "billing":
      return `New BILLING request from ${who}`;
    case "contact":
    default:
      return `New CONTACT from ${who}`;
  }
}

function formatCreatedAt(lead: LeadRecord): string {
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
  return created;
}

function buildPlainTextBody(lead: LeadRecord): string {
  const created = formatCreatedAt(lead);

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

// ---------------------------------------------------------------------------
// INTERNAL NOTIFICATION EMAIL (to you)
// ---------------------------------------------------------------------------

export async function sendLeadNotification(lead: LeadRecord): Promise<void> {
  if (EMAILS_DISABLED) {
    console.log(
      "[leadNotifications] Emails disabled via DISABLE_LEAD_EMAILS; skipping internal notification.",
      { leadId: lead.id, type: lead.type }
    );
    return;
  }

  const type = ((lead.type as LeadType) || "contact") as LeadType;

  const to =
    type === "quote"
      ? QUOTE_NOTIFY_EMAIL
      : type === "support"
      ? SUPPORT_NOTIFY_EMAIL
      : type === "billing"
      ? BILLING_NOTIFY_EMAIL
      : CONTACT_NOTIFY_EMAIL;

  console.log("[leadNotifications] Preparing SMTP notification:", {
    leadId: lead.id,
    type,
    to,
    from: SMTP_USER,
  });

  if (!to) {
    console.warn(
      "[leadNotifications] No destination email configured (CONTACT/QUOTE/SUPPORT/BILLING_NOTIFY_EMAIL); logging only."
    );
    console.log(buildPlainTextBody(lead));
    return;
  }

  const subject = buildSubject(lead);
  const text = buildPlainTextBody(lead);

  console.log("\n[leadNotifications] New lead notification (SMTP)");
  console.log("To:", to);
  console.log("Subject:", subject);

  await sendMail({
    to,
    subject,
    text,
    replyTo: lead.email || undefined,
  });
}

// ---------------------------------------------------------------------------
// CUSTOMER-FACING NO-REPLY RECEIPT EMAIL
// ---------------------------------------------------------------------------

function buildReceiptSubject(lead: LeadRecord): string {
  const type = ((lead.type as LeadType) || "contact") as LeadType;

  switch (type) {
    case "quote":
      return "We’ve received your quote request";
    case "support":
      return "We’ve received your support request";
    case "billing":
      return "We’ve received your billing inquiry";
    case "contact":
    default:
      return "We’ve received your message";
  }
}

function buildReceiptHtml(lead: LeadRecord): string {
  const type = ((lead.type as LeadType) || "contact") as LeadType;
  const name = lead.name || "there";

  const createdIso = formatCreatedAt(lead);
  const createdDisplay =
    createdIso !== "N/A"
      ? new Date(createdIso).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : null;

  const titleMap: Record<LeadType, string> = {
    contact: "We’ve received your message",
    quote: "Your quote request is in our queue",
    support: "Your support request is logged",
    billing: "Your billing inquiry is received",
  };

  const introMap: Record<LeadType, string> = {
    contact:
      "Thanks for reaching out. Our team has your message and will respond as soon as possible.",
    quote:
      "Thanks for requesting a quote. We’re reviewing the details you provided and will follow up with next steps.",
    support:
      "We’ve recorded your support request and will get back to you with an update or resolution.",
    billing:
      "We’ve received your billing inquiry and will review the details shortly.",
  };

  const summaryRows: string[] = [];

  if (lead.project_type) {
    summaryRows.push(`
      <tr>
        <td style="padding: 6px 8px; font-weight: 600; color: #111;">Project type</td>
        <td style="padding: 6px 8px; color: #444;">
          ${lead.project_type}
        </td>
      </tr>
    `);
  }

  if (lead.budget) {
    summaryRows.push(`
      <tr>
        <td style="padding: 6px 8px; font-weight: 600; color: #111;">Budget</td>
        <td style="padding: 6px 8px; color: #444;">
          ${lead.budget}
        </td>
      </tr>
    `);
  }

  if (lead.timeline) {
    summaryRows.push(`
      <tr>
        <td style="padding: 6px 8px; font-weight: 600; color: #111;">Timeline</td>
        <td style="padding: 6px 8px; color: #444;">
          ${lead.timeline}
        </td>
      </tr>
    `);
  }

  if (lead.message) {
    summaryRows.push(`
      <tr>
        <td style="padding: 6px 8px; font-weight: 600; color: #111;">Message</td>
        <td style="padding: 6px 8px; color: #444; white-space: pre-line;">
          ${lead.message}
        </td>
      </tr>
    `);
  }

  const hasSummary = summaryRows.length > 0;

  return `
    <div style="background-color: #f5f5f7; padding: 24px 16px;">
      <div style="
        max-width: 640px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        padding: 24px 20px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <h1 style="font-size: 22px; margin: 0 0 12px 0; color: #111827;">
          ${titleMap[type]}
        </h1>
        <p style="margin: 0 0 12px 0; font-size: 15px; color: #4b5563;">
          Hi ${name},
        </p>
        <p style="margin: 0 0 16px 0; font-size: 15px; color: #4b5563;">
          ${introMap[type]}
        </p>
        ${
          createdDisplay
            ? `<p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">
                 Submitted on <strong>${createdDisplay}</strong>
               </p>`
            : ""
        }
        ${
          hasSummary
            ? `
          <div style="margin-top: 16px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tbody>
                ${summaryRows.join("")}
              </tbody>
            </table>
          </div>`
            : ""
        }
        <p style="margin: 20px 0 0 0; font-size: 13px; color: #9ca3af;">
          This is an automated no-reply email from Next Forge Pro confirming that your
          ${type} form was submitted successfully.
        </p>
      </div>
      <p style="margin: 16px auto 0; max-width: 640px; font-size: 11px; color: #9ca3af; text-align: center;">
        © ${new Date().getFullYear()} Next Forge Pro. All rights reserved.
      </p>
    </div>
  `;
}

export async function sendLeadReceipt(lead: LeadRecord): Promise<void> {
  if (EMAILS_DISABLED) {
    console.log(
      "[leadNotifications] Emails disabled via DISABLE_LEAD_EMAILS; skipping customer receipt.",
      { leadId: lead.id, type: lead.type }
    );
    return;
  }

  if (RECEIPT_EMAILS_DISABLED) {
    console.log(
      "[leadNotifications] Customer receipts disabled via DISABLE_LEAD_RECEIPT_EMAILS; skipping.",
      { leadId: lead.id, type: lead.type }
    );
    return;
  }

  if (!lead.email) {
    console.warn(
      "[leadNotifications] Lead has no email; cannot send customer receipt.",
      { leadId: lead.id, type: lead.type }
    );
    return;
  }

  const subject = buildReceiptSubject(lead);
  const html = buildReceiptHtml(lead);

  console.log("\n[leadNotifications] Customer receipt (SMTP)");
  console.log("To:", lead.email);
  console.log("Subject:", subject);

  await sendMail({
    to: lead.email,
    subject,
    html,
  });
}