// app/api/billing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  sendLeadNotification,
  sendLeadReceipt,
  LeadRecord,
} from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("[api/billing] Handler start");

  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();

    const {
      name,
      email,
      company,
      invoiceNumber,
      message,
      sourcePage,
    } = body as {
      name?: string;
      email?: string;
      company?: string;
      invoiceNumber?: string;
      message?: string;
      sourcePage?: string;
    };

    console.log("[api/billing] Parsed body:", body);

    // Combine invoiceNumber + message into a single message field if present
    const combinedMessage =
      invoiceNumber && message
        ? `Invoice: ${invoiceNumber}\n\n${message}`
        : invoiceNumber
        ? `Invoice: ${invoiceNumber}`
        : message ?? null;

    const insertPayload = {
      type: "billing" as const,
      name: name ?? null,
      email: email ?? null,
      company: company ?? null,
      invoice_number: invoiceNumber ?? null,
      message: combinedMessage,
      source_page: sourcePage ?? "/billing",
      status: "open" as const,
      status_changed_at: new Date().toISOString(),
      status_changed_by: null,
      user_agent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
    };

    const { data, error } = await supabase
      .from("billing_requests")
      .insert([insertPayload])
      .select()
      .single();

    if (error || !data) {
      console.error("[api/billing] Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to submit billing request" },
        { status: 500 }
      );
    }

    console.log("[api/billing] Inserted row:", data);

    // Shape into LeadRecord for email/SMS helpers
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

    const phone = (data as any)?.phone as string | undefined;

    // Fire-and-forget notifications (don’t break the API if these fail)
    void (async () => {
      try {
        await sendLeadNotification(lead);
      } catch (err) {
        console.error("[api/billing] Error sending internal notification:", err);
      }

      try {
        await sendLeadReceipt(lead);
      } catch (err) {
        console.error("[api/billing] Error sending customer receipt:", err);
      }

      if (phone) {
        try {
          await sendLeadSmsReceipt({
            to: phone,
            name: lead.name,
            formType: "billing",
          });
        } catch (err) {
          console.error("[api/billing] Error sending SMS receipt:", err);
        }
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/billing] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}