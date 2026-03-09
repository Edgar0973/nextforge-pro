// lib/mail.ts
import nodemailer from "nodemailer";

const host = process.env.OUTLOOK_SMTP_HOST;
const port = process.env.OUTLOOK_SMTP_PORT
  ? Number(process.env.OUTLOOK_SMTP_PORT)
  : undefined;
const user = process.env.OUTLOOK_SMTP_USER;
const pass = process.env.OUTLOOK_SMTP_PASS;

if (!host || !port || !user || !pass) {
  console.warn(
    "[mail] SMTP environment variables are missing. Emails will fail until configured."
  );
}

export const mailTransporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // usually 465 = SSL, 587 = STARTTLS
  auth: {
    user,
    pass,
  },
});

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  if (!host || !port || !user || !pass) {
    console.error("[mail] SMTP not configured. Skipping email send.");
    return;
  }

  const fromAddress =
    process.env.OUTLOOK_SMTP_USER || "notifications@nextforgepro.com";

  await mailTransporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    html: html ?? text,
  });
}