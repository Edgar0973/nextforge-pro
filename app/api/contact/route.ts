// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendLeadNotification,
  sendLeadReceipt,
  LeadRecord,
} from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email: string;
  message: string;
  company?: string;
  sourcePage?: string;
};

export async function POST(req: NextRequest) {
  console.log("[/api/contact] handler START");

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
    console.log("[/api/contact] parsed request body:", body);
  } catch (err) {
    console.error("[/api/contact] Failed to parse JSON body:", err);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, message, company, sourcePage } = body;

  if (!email || !message) {
    console.warn("[/api/contact] Missing required fields:", { email, message });
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

    console.log("[/api/contact] Supabase insert success:", {
      leadId: data?.id,
      email: data?.email,
    });

    // Best-effort notifications – do not fail the request if these throw
    if (data) {
      const lead = data as unknown as LeadRecord;
      const phone = (data as any)?.phone as string | undefined;

      console.log("[/api/contact] About to call sendLeadNotification with:", {
        leadId: lead.id,
        type: lead.type,
        email: lead.email,
        DISABLE_LEAD_EMAILS: process.env.DISABLE_LEAD_EMAILS,
        HAS_RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
        CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL,
      });

      try {
        await sendLeadNotification(lead);
        console.log("[/api/contact] sendLeadNotification completed for:", {
          leadId: lead.id,
        });
      } catch (notifyErr) {
        console.error(
          "[/api/contact] Failed to send lead notification:",
          notifyErr
        );
      }

      try {
        await sendLeadReceipt(lead);
        console.log("[/api/contact] sendLeadReceipt completed for:", {
          leadId: lead.id,
        });
      } catch (receiptErr) {
        console.error(
          "[/api/contact] Failed to send customer receipt:",
          receiptErr
        );
      }

      if (phone) {
        try {
          await sendLeadSmsReceipt({
            to: phone,
            name: lead.name,
            formType: "contact",
          });
          console.log("[/api/contact] sendLeadSmsReceipt completed for:", {
            leadId: lead.id,
          });
        } catch (smsErr) {
          console.error(
            "[/api/contact] Failed to send SMS receipt:",
            smsErr
          );
        }
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