export async function POST(req: Request) {
  const raw = await req.text();

  // Log raw (useful when debugging signature & event types later)
  console.log("[telnyx:webhook] raw:", raw);

  // Also try parsing JSON for nicer logs
  try {
    const json = JSON.parse(raw);
    const eventType = json?.data?.event_type ?? json?.event_type ?? "unknown";
    const id = json?.data?.payload?.id ?? json?.data?.id ?? "unknown";
    console.log("[telnyx:webhook] event:", { eventType, id });
  } catch {
    // ignore parse errors; raw is already logged
  }

  return new Response("ok", { status: 200 });
}