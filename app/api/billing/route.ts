// app/api/billing/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendLeadNotification } from "@/lib/leadNotifications";

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

    // Fire-and-forget notification
    try {
      await sendLeadNotification(data);
    } catch (err) {
      console.error("[api/billing] Error sending notification:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/billing] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}