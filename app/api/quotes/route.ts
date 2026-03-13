import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { LeadRecord } from "@/lib/leadNotifications";
import { notifyLead } from "@/lib/notifyLead";

export const runtime = "nodejs";

type QuotePayload = {
  name?: string;
  email?: string;
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

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const projectType = (body.projectType ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const timeline = (body.timeline ?? "").trim();
  const sourcePage = (body.sourcePage ?? "").trim();

  const rawDetails = body.projectDetails ?? body.details ?? body.message ?? "";
  const projectDetails = typeof rawDetails === "string" ? rawDetails.trim() : "";

  const phoneE164 = normalizeUsPhone(body.phone);

  // ALL REQUIRED (no exceptions)
  if (
    !name ||
    !email ||
    !company ||
    !projectType ||
    !budget ||
    !timeline ||
    !projectDetails ||
    !sourcePage ||
    !phoneE164
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required fields. Required: name, email, phone (+1XXXXXXXXXX), company, projectType, budget, timeline, projectDetails, sourcePage.",
      },
      { status: 400 }
    );
  }

  const insertPayload = {
    type: "quote",
    name,
    email,
    phone: phoneE164,
    company,
    project_type: projectType,
    budget,
    timeline,
    message: projectDetails,
    source_page: sourcePage,
    user_agent: req.headers.get("user-agent"),
    ip: req.headers.get("x-forwarded-for"),
  };

  const { data, error } = await supabaseAdmin
    .from("leads")
    .insert(insertPayload)
    .select()
    .maybeSingle();

  if (error) {
    console.error(`${pfx} Supabase insert error:`, error);
    return NextResponse.json(
      { error: "Failed to save quote request. Please try again." },
      { status: 500 }
    );
  }

  if (data) {
    const lead = data as unknown as LeadRecord;

    try {
      await notifyLead({
        lead,
        phoneE164,
        formType: "quote",
        requestId: reqId,
      });
    } catch (e) {
      console.error(`${pfx} notifyLead error:`, e);
    }
  }

  return NextResponse.json({ success: true, lead: data ?? null }, { status: 200 });
}
