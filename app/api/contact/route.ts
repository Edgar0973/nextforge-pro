// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendLeadNotification,
  sendLeadReceipt,
  LeadRecord,
} from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email: string;
  phone?: string;
  message: string;
  company?: string;
  sourcePage?: string;
};

function normalizeUsPhone(input?: string): string | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  if (raw.startsWith("+")) {
    const cleaned = raw.replace(/[^\d+]/g, "");
    return /^\+1\d{10}$/.test(cleaned) ? cleaned : null;
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function POST(req: NextRequest) {
  console.log("[/api/contact] handler START");

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Server configuration error: Supabase credentials are missing. Please try again later.",
      },
      { status: 500 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, message, company, sourcePage } = body;

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  const phoneE164 = normalizeUsPhone(phone);

  const baseInsert = {
    type: "contact",
    name: name ?? null,
    email,
    message,
    source_page: sourcePage ?? "/contact",
    company: company ?? null,
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };

  // Try insert with phone; if DB doesn't have column yet, retry without phone.
  let data: any = null;
  let insertError: any = null;

  const attempt1 = await supabaseAdmin
    .from("leads")
    .insert({ ...baseInsert, ...(phoneE164 ? { phone: phoneE164 } : {}) })
    .select()
    .maybeSingle();

  data = attempt1.data;
  insertError = attempt1.error;

  if (insertError && phoneE164) {
    console.warn(
      "[/api/contact] Insert with phone failed; retrying without phone:",
      insertError
    );
    const attempt2 = await supabaseAdmin
      .from("leads")
      .insert(baseInsert)
      .select()
      .maybeSingle();

    data = attempt2.data;
    insertError = attempt2.error;
  }

  if (insertError) {
    console.error("[/api/contact] Supabase insert error:", insertError);
    return NextResponse.json(
      { error: "Something went wrong while saving your message. Please try again." },
      { status: 500 }
    );
  }

  // Notifications (never block success)
  if (data) {
    const lead = data as unknown as LeadRecord;

    void (async () => {
      try {
        await sendLeadNotification(lead);
      } catch (e) {
        console.error("[/api/contact] sendLeadNotification error:", e);
      }

      try {
        await sendLeadReceipt(lead);
      } catch (e) {
        console.error("[/api/contact] sendLeadReceipt error:", e);
      }

      // Send SMS even if phone wasn't saved yet (DB column missing)
      if (phoneE164) {
        try {
          await sendLeadSmsReceipt({
            to: phoneE164,
            name: lead.name,
            formType: "contact",
          });
        } catch (e) {
          console.error("[/api/contact] sendLeadSmsReceipt error:", e);
        }
      }
    })();
  }

  return NextResponse.json({ success: true, lead: data ?? null }, { status: 200 });
}