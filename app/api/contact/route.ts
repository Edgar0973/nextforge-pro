// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, company, sourcePage } = body;

    // Basic validation
    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        type: "contact",
        name: name || null,
        email,
        company: company || null,
        message,
        source_page: sourcePage || "/contact",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error (contact):", error);
      return NextResponse.json(
        {
          error:
            error.message ||
            "Failed to save your message. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thanks for reaching out — I’ll get back to you shortly.",
        lead: data,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
