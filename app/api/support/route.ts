// app/api/support/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendLeadNotification } from "@/lib/leadNotifications";

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

    // Fire-and-forget notification (don’t break the API if email fails)
    try {
      await sendLeadNotification(data);
    } catch (err) {
      console.error("[api/support] Error sending notification:", err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/support] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}