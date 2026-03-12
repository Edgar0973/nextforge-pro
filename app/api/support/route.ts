// app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendLeadNotification,
  sendLeadReceipt,
  LeadRecord,
} from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

export const runtime = "nodejs";

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
  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();

    const { name, email, phone, company, subject, message, sourcePage } =
      body as {
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
        subject?: string;
        message?: string;
        sourcePage?: string;
      };

    const phoneE164 = normalizeUsPhone(phone);

    const baseInsert = {
      type: "support" as const,
      name: name ?? null,
      email: email ?? null,
      company: company ?? null,
      subject: subject ?? null,
      message: message ?? null,
      source_page: sourcePage ?? "/support",
      status: "open" as const,
      status_changed_at: new Date().toISOString(),
      status_changed_by: null,
      user_agent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
    };

    let data: any = null;
    let insertError: any = null;

    const attempt1 = await supabase
      .from("support_requests")
      .insert([{ ...baseInsert, ...(phoneE164 ? { phone: phoneE164 } : {}) }])
      .select()
      .single();

    data = attempt1.data;
    insertError = attempt1.error;

    if (insertError && phoneE164) {
      console.warn(
        "[api/support] Insert with phone failed; retrying without phone:",
        insertError
      );
      const attempt2 = await supabase
        .from("support_requests")
        .insert([baseInsert])
        .select()
        .single();

      data = attempt2.data;
      insertError = attempt2.error;
    }

    if (insertError || !data) {
      console.error("[api/support] Supabase insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to submit support request" },
        { status: 500 }
      );
    }

    const lead: LeadRecord = {
      id: data.id,
      type: data.type,
      name: data.name,
      email: data.email,
      company: data.company,
      project_type: null,
      budget: null,
      timeline: null,
      message: data.message,
      source_page: data.source_page,
      created_at: data.created_at ?? new Date().toISOString(),
    };

    void (async () => {
      try {
        await sendLeadNotification(lead);
      } catch (e) {
        console.error("[api/support] sendLeadNotification error:", e);
      }

      try {
        await sendLeadReceipt(lead);
      } catch (e) {
        console.error("[api/support] sendLeadReceipt error:", e);
      }

      if (phoneE164) {
        try {
          await sendLeadSmsReceipt({
            to: phoneE164,
            name: lead.name,
            formType: "support",
          });
        } catch (e) {
          console.error("[api/support] sendLeadSmsReceipt error:", e);
        }
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/support] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}