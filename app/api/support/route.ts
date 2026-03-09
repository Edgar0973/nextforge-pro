// app/api/support/route.ts
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
  console.log("[api/support] Handler start");

  const supabase = getSupabaseAdmin();

  try {
    const body = await req.json();

    const {
      name,
      email,
      company,
      subject,
      message,
      sourcePage,
    } = body as {
      name?: string;
      email?: string;
      company?: string;
      subject?: string;
      message?: string;
      sourcePage?: string;
    };

    console.log("[api/support] Parsed body:", body);

    const insertPayload = {
      type: "support" as const,
      name: name ?? null,
      email: email ?? null,
      company: company ?? null,
      subject: subject ?? null,
      message: message ?? null,
      source_page: sourcePage ?? "/support",
      status: "open" as const, // ticket-style status
      status_changed_at: new Date().toISOString(),
      status_changed_by: null,
      user_agent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
    };

    const { data, error } = await supabase
      .from("support_requests")
      .insert([insertPayload])
      .select()
      .single();

    if (error || !data) {
      console.error("[api/support] Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to submit support request" },
        { status: 500 }
      );
    }

    console.log("[api/support] Inserted row:", data);

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

    // Fire-and-forget notifications (don’t break the API if email/SMS fails)
    void (async () => {
      try {
        await sendLeadNotification(lead);
      } catch (err) {
        console.error("[api/support] Error sending internal notification:", err);
      }

      try {
        await sendLeadReceipt(lead);
      } catch (err) {
        console.error("[api/support] Error sending customer receipt:", err);
      }

      if (phone) {
        try {
          await sendLeadSmsReceipt({
            to: phone,
            name: lead.name,
            formType: "support",
          });
        } catch (err) {
          console.error("[api/support] Error sending SMS receipt:", err);
        }
      }
    })();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/support] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}