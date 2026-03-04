// scripts/debug-email-flow.cjs
// Run with: node scripts/debug-email-flow.cjs

const path = require("path");
const fs = require("fs");

// 1) Load .env.local from project root
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  console.log(`[debug-email-flow] Loading env from: ${envPath}`);
  require("dotenv").config({ path: envPath });
} else {
  console.warn(
    "[debug-email-flow] .env.local not found next to this script. " +
      "Env vars will come from your shell instead."
  );
}

const { Resend } = require("resend");

// 2) Helper to mask sensitive keys
function mask(value) {
  if (!value) return "(not set)";
  const str = String(value);
  if (str.length <= 6) return "***";
  return str.slice(0, 3) + "…" + str.slice(-3);
}

// 3) Read relevant env vars
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Next Forge Pro <notifications@nextforgepro.com>";
const CONTACT_NOTIFY_EMAIL =
  process.env.CONTACT_NOTIFY_EMAIL || "contact@nextforgepro.com";
const QUOTE_NOTIFY_EMAIL =
  process.env.QUOTE_NOTIFY_EMAIL || "quotes@nextforgepro.com";
const DISABLE_LEAD_EMAILS = process.env.DISABLE_LEAD_EMAILS || "0";

// 4) Print configuration summary
console.log("\n[debug-email-flow] Effective configuration:");
console.log("------------------------------------------");
console.log("RESEND_API_KEY:", RESEND_API_KEY ? mask(RESEND_API_KEY) : "(NOT SET)");
console.log("RESEND_FROM_EMAIL:", RESEND_FROM_EMAIL);
console.log("CONTACT_NOTIFY_EMAIL:", CONTACT_NOTIFY_EMAIL);
console.log("QUOTE_NOTIFY_EMAIL:", QUOTE_NOTIFY_EMAIL);
console.log("DISABLE_LEAD_EMAILS:", DISABLE_LEAD_EMAILS);
console.log("------------------------------------------\n");

if (!RESEND_API_KEY) {
  console.error(
    "[debug-email-flow] ERROR: RESEND_API_KEY is not set. " +
      "Set it in .env.local and try again."
  );
  process.exit(1);
}

// 5) Create Resend client
const resend = new Resend(RESEND_API_KEY);

// 6) Helper to send a test email
async function sendTestEmail(to, label) {
  console.log(`\n[debug-email-flow] Sending test email to (${label}): ${to}`);
  try {
    const subject = `[debug-email-flow] Test email to ${label}`;
    const text =
      `This is a test email sent by scripts/debug-email-flow.cjs\n\n` +
      `Label: ${label}\n` +
      `To: ${to}\n` +
      `From: ${RESEND_FROM_EMAIL}\n` +
      `Timestamp: ${new Date().toISOString()}\n`;

    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      text,
    });

    console.log("[debug-email-flow] send() result:", {
      to,
      label,
      resultId: result?.data?.id || "(no id returned)",
      error: result?.error || null,
    });

    if (result?.error) {
      console.error(
        "[debug-email-flow] Resend returned an error for this send."
      );
    } else {
      console.log(
        "[debug-email-flow] SUCCESS: Resend accepted the email for sending."
      );
      console.log(
        "  → You should see this email in the Resend dashboard under Emails."
      );
    }
  } catch (err) {
    console.error(
      "[debug-email-flow] EXCEPTION while sending test email:",
      err
    );
  }
}

// 7) Main flow
(async () => {
  console.log("[debug-email-flow] Starting tests...");

  // Test A: Resend controlled sink (no Outlook involved)
  await sendTestEmail("delivered@resend.dev", "Resend test sink");

  // Test B: Your configured CONTACT_NOTIFY_EMAIL (e.g. Outlook)
  await sendTestEmail(CONTACT_NOTIFY_EMAIL, "CONTACT_NOTIFY_EMAIL target");

  console.log("\n[debug-email-flow] All tests attempted. Now:");
  console.log("  1) Open the Resend dashboard → Emails");
  console.log("  2) Look for the two new messages with subjects starting:");
  console.log('       "[debug-email-flow] Test email to Resend test sink"');
  console.log(
    '       "[debug-email-flow] Test email to CONTACT_NOTIFY_EMAIL target"'
  );
  console.log(
    "  3) Check their Status (delivered / bounced / rejected) and any error message."
  );
  console.log(
    "  4) For the CONTACT_NOTIFY_EMAIL test, also check your Outlook inbox & Junk."
  );

  process.exit(0);
})();