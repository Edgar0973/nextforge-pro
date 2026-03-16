export async function POST(req: Request) {
  const raw = await req.text();

  console.log("[telnyx:webhook:failover] raw:", raw);

  try {
    const json = JSON.parse(raw);
    const eventType = json?.data?.event_type ?? json?.event_type ?? "unknown";
    const id = json?.data?.payload?.id ?? json?.data?.id ?? "unknown";
    console.log("[telnyx:webhook:failover] event:", { eventType, id });
  } catch {
    // ignore
  }

  return new Response("ok", { status: 200 });
}