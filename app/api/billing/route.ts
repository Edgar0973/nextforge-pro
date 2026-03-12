// app/api/billing/route.ts
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

    const {
      name,
      email,
      phone,
      company,
      invoiceNumber,
      message,
      sourcePage,
    } = body as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      invoiceNumber?: string;
      message?: string;
      sourcePage?: string;
    };

    const phoneE164 = normalizeUsPhone(phone);

    const combinedMessage =
      invoiceNumber && message
        ? `Invoice: ${invoiceNumber}\n\n${message}`
        : invoiceNumber
        ? `Invoice: ${invoiceNumber}`
        : message ?? null;

    const baseInsert = {
      type: "billing" as const,
      name: name ?? null,
      email: email ?? null,
      company: company ?? null,
      invoice_number: invoiceNumber ?? null,
      message: combinedMessage,
      source_page: sourcePage ?? "/billing",
      status: "open" as const,
      status_changed_at: new Date().toISOString(),
      status_changed_by: null,
      user_agent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
    };

    let data: any = null;
    let insertError: any = null;

    const attempt1 = await supabase
      .from("billing_requests")
      .insert([{ ...baseInsert, ...(phoneE164 ? { phone: phoneE164 } : {}) }])
      .select()
      .single();

    data = attempt1.data;
    insertError = attempt1.error;

    if (insertError && phoneE164) {
      console.warn(
        "[api/billing] Insert with phone failed; retrying without phone:",
        insertError
      );
      const attempt2 = await supabase
        .from("billing_requests")
        .insert([baseInsert])
        .select()
        .single();

      data = attempt2.data;
      insertError = attempt2.error;
    }

    if (insertError || !data) {
      console.error("[api/billing] Supabase insert error:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to submit billing request" },
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
        console.error("[api/billing] sendLeadNotification error:", e);
      }

      try {
        await sendLeadReceipt(lead);
      } catch (e) {
        console.error("[api/billing] sendLeadReceipt error:", e);
      }

      if (phoneE164) {
        try {
          await sendLeadSmsReceipt({
            to: phoneE164,
            name: lead.name,
            formType: "billing",
          });
        } catch (e) {
          console.error("[api/billing] sendLeadSmsReceipt error:", e);
        }
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/billing] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}