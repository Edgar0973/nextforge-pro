import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type QuotePayload = {
  name?: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  projectDetails: string;
  sourcePage?: string;
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
    email,
    company,
    projectType,
    budget,
    timeline,
    projectDetails,
    sourcePage,
  } = body;

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
        message: projectDetails,
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