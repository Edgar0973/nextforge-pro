// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    let body: any;

    // Safely parse JSON
    try {
      body = await request.json();
    } catch (err) {
      console.error("Error parsing JSON body:", err);
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { name, email, message, sourcePage } = body ?? {};

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
        message,
        source_page: sourcePage || "/contact",
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error (contact):", error);
      return NextResponse.json(
        {
          error: "Failed to save your message. Please try again later.",
          details: error.message, // helpful during dev
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
  } catch (err: any) {
    console.error("Contact API error (outer):", err);
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}


