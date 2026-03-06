import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendLeadNotification, LeadRecord } from "@/lib/leadNotifications";

type QuotePayload = {
  name?: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  projectDetails?: string; // optional – we'll normalize below
  sourcePage?: string;
  // allow for legacy/message-style payloads
  message?: string;
  details?: string; // 🔑 support the current form's `name="details"`
};

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    console.error("[/api/quote] supabaseAdmin is not configured.");
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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const {
    name,
    email: rawEmail,
    company,
    projectType,
    budget,
    timeline,
    sourcePage,
  } = body;

  // Normalize email
  const email = (rawEmail ?? "").trim();

  // 🔑 Accept `projectDetails`, `details`, or `message` from the client
  const rawProjectDetails =
    body.projectDetails ?? body.details ?? body.message ?? "";

  const projectDetails =
    typeof rawProjectDetails === "string" ? rawProjectDetails.trim() : "";

  if (!email || !projectDetails) {
    return NextResponse.json(
      { error: "Email and project details are required." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        type: "quote",
        name: name ?? null,
        email,
        company: company ?? null,
        project_type: projectType ?? null,
        budget: budget ?? null,
        timeline: timeline ?? null,
        message: projectDetails, // always the normalized value
        source_page: sourcePage ?? "/quote",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("[/api/quote] Supabase insert error:", error);
      return NextResponse.json(
        {
          error:
            "Something went wrong while saving your quote request. Please try again.",
        },
        { status: 500 }
      );
    }

    // Best-effort notification – do not fail the request if this throws
    if (data) {
      const lead = data as unknown as LeadRecord;
      try {
        await sendLeadNotification(lead);
      } catch (notifyErr) {
        console.error(
          "[/api/quote] Failed to send lead notification:",
          notifyErr
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        lead: data ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[/api/quote] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error while submitting your quote request." },
      { status: 500 }
    );
  }
}