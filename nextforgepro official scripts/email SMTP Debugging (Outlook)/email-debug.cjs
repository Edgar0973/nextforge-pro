// scripts/email-debug.cjs

// This script:
// 1. Loads env vars (from process.env; optionally from .env.local if you want)
// 2. Builds the same Nodemailer transporter your app uses
// 3. Sends a test email and logs success/error

const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// OPTIONAL: load .env.local for local testing.
const dotenvPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(dotenvPath)) {
  console.log("[email-debug] Loading .env.local from:", dotenvPath);
  require("dotenv").config({ path: dotenvPath });
} else {
  console.log("[email-debug] .env.local not found, using process.env only.");
}

const CONTACT_NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL || "contact@nextforgepro.com";
const QUOTE_NOTIFY_EMAIL =
  process.env.QUOTE_NOTIFY_EMAIL || "quotes@nextforgepro.com";

const DISABLE_LEAD_EMAILS = process.env.DISABLE_LEAD_EMAILS === "1";

const OUTLOOK_SMTP_HOST =
  process.env.OUTLOOK_SMTP_HOST || "smtp-mail.outlook.com";
const OUTLOOK_SMTP_PORT = process.env.OUTLOOK_SMTP_PORT
  ? Number(process.env.OUTLOOK_SMTP_PORT)
  : 587;
const OUTLOOK_SMTP_USER = process.env.OUTLOOK_SMTP_USER || "";
const OUTLOOK_SMTP_PASS = process.env.OUTLOOK_SMTP_PASS || "";

// ---- Helper to print what we see (without leaking secrets) ----

function printEnvSummary() {
  console.log("\n[email-debug] Environment summary (safe view):");
  console.log("  DISABLE_LEAD_EMAILS:", DISABLE_LEAD_EMAILS ? "1" : "0");
  console.log("  CONTACT_NOTIFY_EMAIL:", CONTACT_NOTIFY_EMAIL);
  console.log("  QUOTE_NOTIFY_EMAIL:  ", QUOTE_NOTIFY_EMAIL);
  console.log("  OUTLOOK_SMTP_HOST:   ", OUTLOOK_SMTP_HOST);
  console.log("  OUTLOOK_SMTP_PORT:   ", OUTLOOK_SMTP_PORT);
  console.log(
    "  OUTLOOK_SMTP_USER:   ",
    OUTLOOK_SMTP_USER ? OUTLOOK_SMTP_USER : "(EMPTY)"
  );
  console.log(
    "  OUTLOOK_SMTP_PASS:   ",
    OUTLOOK_SMTP_PASS ? "(SET, HIDDEN)" : "(EMPTY)"
  );
}

// ---- Create the same transporter as your app ----

function createTransport() {
  if (!OUTLOOK_SMTP_USER || !OUTLOOK_SMTP_PASS) {
    console.warn(
      "[email-debug] OUTLOOK_SMTP_USER or OUTLOOK_SMTP_PASS not set; cannot send emails."
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: OUTLOOK_SMTP_HOST,
    port: OUTLOOK_SMTP_PORT,
    secure: OUTLOOK_SMTP_PORT === 465, // false for 587
    auth: {
      user: OUTLOOK_SMTP_USER,
      pass: OUTLOOK_SMTP_PASS,
    },
  });

  return transporter;
}

async function main() {
  printEnvSummary();

  if (DISABLE_LEAD_EMAILS) {
    console.log(
      "\n[email-debug] DISABLE_LEAD_EMAILS is 1 → emails are DISABLED by config."
    );
    console.log(
      "Set DISABLE_LEAD_EMAILS=0 in Vercel env vars for Production to enable sending."
    );
    return;
  }

  const transporter = createTransport();
  if (!transporter) {
    console.log(
      "\n[email-debug] Transporter not created. Fix OUTLOOK_SMTP_USER / PASS."
    );
    return;
  }

  const to = CONTACT_NOTIFY_EMAIL || OUTLOOK_SMTP_USER;
  const subject = "Next Forge Pro SMTP Debug Test";
  const text =
    "This is a test email sent by scripts/email-debug.cjs.\n\n" +
    "If you see this, Outlook SMTP is working with your current credentials.";

  console.log("\n[email-debug] Attempting to send test email...");
  console.log("  From:", OUTLOOK_SMTP_USER);
  console.log("  To:  ", to);
  console.log("  Subj:", subject);

  try {
    const info = await transporter.sendMail({
      from: `Next Forge Pro <${OUTLOOK_SMTP_USER || to}>`,
      to,
      subject,
      text,
    });

    console.log("\n[email-debug] SUCCESS: Email sent.");
    console.log("  MessageId:", info.messageId);
  } catch (err) {
    console.error("\n[email-debug] ERROR sending email via Outlook SMTP:");
    console.error(err);
  }
}

main().catch((err) => {
  console.error("[email-debug] Unexpected error:", err);
});