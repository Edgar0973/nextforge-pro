// lib/notifyLead.ts
import "server-only";

import { sendLeadNotification, sendLeadReceipt, type LeadRecord } from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

function requestIdFallback() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

// Extra safety: if something internally hangs anyway, cap each task.
function withTimeout<T>(label: string, ms: number, promise: Promise<T>): Promise<T> {
  let timeout: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

export async function notifyLead(params: {
  lead: LeadRecord;
  phoneE164?: string | null;
  formType: "contact" | "quote" | "billing" | "support";
  requestId?: string;
}) {
  const reqId = params.requestId ?? requestIdFallback();
  const pfx = `[notifyLead:${reqId}]`;

  const tasks: Promise<unknown>[] = [];

  // Internal email + customer receipt in parallel
  tasks.push(
    withTimeout("sendLeadNotification", 25_000, sendLeadNotification(params.lead, { requestId: reqId }))
  );

  tasks.push(
    withTimeout("sendLeadReceipt", 25_000, sendLeadReceipt(params.lead, { requestId: reqId }))
  );

  // SMS in parallel (if phone)
  if (params.phoneE164) {
    tasks.push(
      withTimeout(
        "sendLeadSmsReceipt",
        20_000,
        sendLeadSmsReceipt({
          to: params.phoneE164,
          name: params.lead.name,
          formType: params.formType,
          requestId: reqId,
        })
      )
    );
  }

  const results = await Promise.allSettled(tasks);

  const summary = results.map((r) =>
    r.status === "fulfilled"
      ? { ok: true }
      : { ok: false, error: r.reason?.message ?? String(r.reason) }
  );

  console.log(`${pfx} allSettled summary:`, summary);

  return { requestId: reqId, summary };
}