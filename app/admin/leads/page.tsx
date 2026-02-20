import "server-only";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Lead = {
  id: string;
  type: string; // "contact" | "quote" (but keep string to be tolerant)
  name: string | null;
  email: string;
  company: string | null;
  project_type: string | null;
  budget: string | null;
  timeline: string | null;
  message: string | null;
  source_page: string | null;
  created_at: string;
};

export const dynamic = "force-dynamic";

async function fetchLeads(): Promise<Lead[]> {
  if (!supabaseAdmin) {
    // Mirror your existing pattern: fail gracefully if envs are missing
    console.error(
      "[admin/leads] supabaseAdmin is null. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/leads] Error fetching leads:", error);
    return [];
  }

  return (data ?? []) as Lead[];
}

export default async function AdminLeadsPage() {
  const leads = await fetchLeads();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin &mdash; Leads
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Read-only view of contact and quote submissions from{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            public.leads
          </code>
          .
        </p>
        <p className="mt-1 text-xs text-red-500">
          ⚠️ Dev-only for now. This page is not authenticated yet. Do not share
          this URL publicly.
        </p>
      </header>

      {leads.length === 0 ? (
        <p className="text-sm text-gray-500">
          No leads found yet. Once people submit the contact or quote forms,
          they will show up here.
        </p>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{leads.length}</span>{" "}
            {leads.length === 1 ? "lead" : "leads"}, newest first.
          </p>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Timeline</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {leads.map((lead) => {
                  const created = new Date(lead.created_at);

                  return (
                    <tr key={lead.id} className="align-top">
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-gray-500">
                        {created.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-xs font-semibold">
                        <span
                          className={
                            lead.type === "quote"
                              ? "rounded bg-amber-50 px-1.5 py-0.5 text-amber-700"
                              : "rounded bg-blue-50 px-1.5 py-0.5 text-blue-700"
                          }
                        >
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        {lead.name ?? <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-blue-600 underline underline-offset-2"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        {lead.company ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">
                        {lead.project_type ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">
                        {lead.budget ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">
                        {lead.timeline ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {lead.source_page ?? (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="max-w-xs px-3 py-2 text-xs text-gray-800">
                        <div className="line-clamp-4 whitespace-pre-line">
                          {lead.message}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}