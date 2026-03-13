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

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    subject?: string;
    message?: string;
    sourcePage?: string;
  };

  try {
    body = (await req.json()) as any;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  const sourcePage = (body.sourcePage ?? "").trim();
  const phoneE164 = normalizeUsPhone(body.phone);

  // ALL REQUIRED (no exceptions)
  if (
    !name ||
    !email ||
    !company ||
    !subject ||
    !message ||
    !sourcePage ||
    !phoneE164
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Missing required fields. Required: name, email, phone (+1XXXXXXXXXX), company, subject, message, sourcePage.",
      },
      { status: 400 }
    );
  }

  const insertPayload = {
    type: "support" as const,
    name,
    email,
    phone: phoneE164,
    company,
    subject,
    message,
    source_page: sourcePage,
    status: "open" as const,
    status_changed_at: new Date().toISOString(),
    status_changed_by: null,
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };

  const { data, error } = await supabase
    .from("support_requests")
    .insert([insertPayload])
    .select()
    .single();

  if (error || !data) {
    console.error(`${pfx} Supabase insert error:`, error);
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

  try {
    await notifyLead({
      lead,
      phoneE164,
      formType: "support",
      requestId: reqId,
    });
  } catch (e) {
    console.error(`${pfx} notifyLead error:`, e);
  }

  return NextResponse.json({ success: true });
}
