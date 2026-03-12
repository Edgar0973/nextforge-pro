// app/api/quotes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { LeadRecord } from "@/lib/leadNotifications";
import { notifyLead } from "@/lib/notifyLead";

export const runtime = "nodejs";

type QuotePayload = {
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  projectDetails?: string;
  sourcePage?: string;
  message?: string;
  details?: string; // your form uses "details"
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

function requestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: NextRequest) {
  const reqId = requestId();
  const pfx = `[/api/quotes:${reqId}]`;

  if (!supabaseAdmin) {
    return NextResponse.json(
      {
        error:
          "Server configuration error: Supabase credentials are missing. Please try again later.",
      },
      { status: 500 }
    );
  }

  let body: QuotePayload;
  try {
    body = (await req.json()) as QuotePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const phoneE164 = normalizeUsPhone(body.phone);

  const rawDetails = body.projectDetails ?? body.details ?? body.message ?? "";
  const projectDetails = typeof rawDetails === "string" ? rawDetails.trim() : "";

  if (!email || !projectDetails) {
    return NextResponse.json(
      { error: "Email and project details are required." },
      { status: 400 }
    );
  }

  const baseInsert = {
    type: "quote",
    name: body.name ?? null,
    email,
    company: body.company ?? null,
    project_type: body.projectType ?? null,
    budget: body.budget ?? null,
    timeline: body.timeline ?? null,
    message: projectDetails,
    source_page: body.sourcePage ?? "/quote",
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };

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
      `${pfx} Insert with phone failed; retrying without phone:`,
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
    console.error(`${pfx} Supabase insert error:`, insertError);
    return NextResponse.json(
      { error: "Something went wrong while saving your quote request. Please try again." },
      { status: 500 }
    );
  }

  if (data) {
    const lead = data as unknown as LeadRecord;

    void notifyLead({
      lead,
      phoneE164,
      formType: "quote",
      requestId: reqId,
    }).catch((e) => console.error(`${pfx} notifyLead error:`, e));
  }

  return NextResponse.json({ success: true, lead: data ?? null }, { status: 200 });
}