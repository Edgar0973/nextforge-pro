// scripts/resend-debug.cjs
require("dotenv").config({ path: ".env.local" });
const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

if (!RESEND_API_KEY) {
  console.error("[resend-debug] RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

(async () => {
  try {
    console.log("[resend-debug] Sending test email via Resend...");

    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: "nextforgepro@outlook.com",
      subject: "Resend Debug Test (Next Forge Pro)",
      html: "<p>If you see this, Resend is working 🎉</p>",
    });

    console.log("[resend-debug] Done. Result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("[resend-debug] Error sending via Resend:", err);
  }
})();