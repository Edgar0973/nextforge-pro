// app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { LeadRecord } from "@/lib/leadNotifications";
import { notifyLead } from "@/lib/notifyLead";

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

function requestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: NextRequest) {
  const reqId = requestId();
  const pfx = `[/api/support:${reqId}]`;

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
        `${pfx} Insert with phone failed; retrying without phone:`,
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
      console.error(`${pfx} Supabase insert error:`, insertError);
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

    void notifyLead({
      lead,
      phoneE164,
      formType: "support",
      requestId: reqId,
    }).catch((e) => console.error(`${pfx} notifyLead error:`, e));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`${pfx} Unexpected error:`, err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}