// app/api/quote/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type QuoteRequestBody = {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  details?: string;
  sourcePage?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuoteRequestBody;
    const {
      name,
      email,
      company,
      projectType,
      budget,
      timeline,
      details,
      sourcePage,
    } = body;

    if (!email || !details) {
      return NextResponse.json(
        { error: "Email and project details are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        type: "quote",
        name: name || null,
        email,
        company: company || null,
        project_type: projectType || null,
        budget: budget || null,
        timeline: timeline || null,
        message: details,
        source_page: sourcePage || "/quote",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error (quote):", error);
      return NextResponse.json(
        {
          error:
            error.message ||
            "Failed to save your quote request. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thanks for the details — I’ll review and follow up with a tailored quote.",
        lead: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
