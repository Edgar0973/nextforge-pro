import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendLeadNotification, LeadRecord } from "@/lib/leadNotifications";

type ContactPayload = {
  name?: string;
  email: string;
  message: string;
  company?: string;
  sourcePage?: string;
};

export async function POST(req: NextRequest) {
  // Ensure Supabase admin client exists
  if (!supabaseAdmin) {
    console.error("[/api/contact] supabaseAdmin is not configured.");
    return NextResponse.json(
      {
        error:
          "Server configuration error: Supabase credentials are missing. Please try again later.",
      },
      { status: 500 }
    );
  }

  let body: ContactPayload;

  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, message, company, sourcePage } = body;

  if (!email || !message) {
    return NextResponse.json(
      { error: "Email and message are required." },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert({
        type: "contact",
        name: name ?? null,
        email,
        message,
        source_page: sourcePage ?? "/contact",
        company: company ?? null,
        // user_agent, ip can be added later
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("[/api/contact] Supabase insert error:", error);
      return NextResponse.json(
        {
          error:
            "Something went wrong while saving your message. Please try again.",
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
          "[/api/contact] Failed to send lead notification:",
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
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error while submitting your message." },
      { status: 500 }
    );
  }
}