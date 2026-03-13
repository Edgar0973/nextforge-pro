// lib/notifyLead.ts
import "server-only";

import {
  sendLeadNotification,
  sendLeadReceipt,
  type LeadRecord,
} from "@/lib/leadNotifications";
import { sendLeadSmsReceipt } from "@/lib/telnyx";

function requestIdFallback() {
  return `${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`;
}

function withTimeout<T>(
  label: string,
  ms: number,
  promiseFactory: () => Promise<T>
): Promise<T> {
  let timeout: NodeJS.Timeout | null = null;

  const timeoutPromise = new Promise<T>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promiseFactory(), timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout);
  });
}

type NotifyLeadParams = {
  lead: LeadRecord;
  phoneE164?: string | null;
  formType: "contact" | "quote" | "billing" | "support";
  requestId?: string;
};

type NamedTaskResult =
  | { task: string; ok: true }
  | { task: string; ok: false; error: string };

export async function notifyLead({
  lead,
  phoneE164,
  formType,
  requestId,
}: NotifyLeadParams) {
  const reqId = requestId ?? requestIdFallback();
  const pfx = `[notifyLead:${reqId}]`;

  console.log(`${pfx} START`, {
    leadId: lead.id,
    formType,
    hasPhone: Boolean(phoneE164),
    email: lead.email,
  });

  const taskEntries: Array<{
    task: "internalEmail" | "customerReceipt" | "smsReceipt";
    promise: Promise<void>;
  }> = [
    {
      task: "internalEmail",
      promise: withTimeout("sendLeadNotification", 25_000, async () => {
        console.log(`${pfx} Internal email START`, {
          leadId: lead.id,
          type: lead.type,
          email: lead.email,
        });

        await sendLeadNotification(lead, { requestId: reqId });

        console.log(`${pfx} Internal email OK`, {
          leadId: lead.id,
          type: lead.type,
        });
      }),
    },
    {
      task: "customerReceipt",
      promise: withTimeout("sendLeadReceipt", 25_000, async () => {
        console.log(`${pfx} Customer receipt START`, {
          leadId: lead.id,
          to: lead.email,
        });

        await sendLeadReceipt(lead, { requestId: reqId });

        console.log(`${pfx} Customer receipt OK`, {
          leadId: lead.id,
          to: lead.email,
        });
      }),
    },
  ];

  if (phoneE164) {
    taskEntries.push({
      task: "smsReceipt",
      promise: withTimeout("sendLeadSmsReceipt", 20_000, async () => {
        console.log(`${pfx} SMS send START`, {
          to: phoneE164,
          formType,
        });

        await sendLeadSmsReceipt({
          to: phoneE164,
          name: lead.name,
          formType,
          requestId: reqId,
        });

        console.log(`${pfx} SMS send OK`, {
          to: phoneE164,
          formType,
        });
      }),
    });
  } else {
    console.log(`${pfx} SMS skipped`, {
      reason: "No phoneE164 provided",
    });
  }

  const results = await Promise.allSettled(
    taskEntries.map(async ({ task, promise }) => {
      await promise;
      return task;
    })
  );

  const summary: NamedTaskResult[] = results.map((result, index) => {
    const task = taskEntries[index]?.task ?? `task-${index}`;

    if (result.status === "fulfilled") {
      return { task, ok: true };
    }

    return {
      task,
      ok: false,
      error: result.reason?.message ?? String(result.reason),
    };
  });

  console.log(`${pfx} allSettled summary:`, summary);

  return { requestId: reqId, summary };
}