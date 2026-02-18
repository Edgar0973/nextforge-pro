import { Section } from "@/components/section";

export default function QuotePage() {
  return (
    <>
      <Section
        eyebrow="Get a quote"
        title="Share your project details for a fast estimate"
        kicker="I’ll review your project context, goals, and constraints and follow up with a ballpark quote and suggested next steps."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
          {/* Quote / project intake form */}
          <form className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-slate-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                  placeholder="Alex Founder"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-xs font-medium text-slate-200"
              >
                Company / product
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Looply – B2B SaaS for ops teams"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="projectType"
                  className="block text-xs font-medium text-slate-200"
                >
                  What are you planning to build?
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 focus:ring"
                >
                  <option>Marketing website</option>
                  <option>Web app UI / dashboard</option>
                  <option>Mobile app UI</option>
                  <option>UX audit of an existing product</option>
                  <option>Ongoing design support / retainer</option>
                  <option>Multi-scope project (we’ll clarify)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="budget"
                  className="block text-xs font-medium text-slate-200"
                >
                  Budget range (USD)
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 focus:ring"
                >
                  <option>Under $2,500</option>
                  <option>$2,500 – $5,000</option>
                  <option>$5,000 – $10,000</option>
                  <option>$10,000+</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="timeline"
                  className="block text-xs font-medium text-slate-200"
                >
                  Ideal timeline
                </label>
                <input
                  id="timeline"
                  name="timeline"
                  type="text"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                  placeholder="Kickoff in 3–4 weeks, launch in 2–3 months"
                />
              </div>
              <div>
                <label
                  htmlFor="primaryGoal"
                  className="block text-xs font-medium text-slate-200"
                >
                  Primary goal for this project
                </label>
                <select
                  id="primaryGoal"
                  name="primaryGoal"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 focus:ring"
                >
                  <option>Increase sign-ups / demos</option>
                  <option>Improve onboarding or activation</option>
                  <option>Reduce support tickets / confusion</option>
                  <option>Refresh an outdated UI</option>
                  <option>Prepare for a launch / funding round</option>
                  <option>Other (explain below)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="links"
                className="block text-xs font-medium text-slate-200"
              >
                Links I should review (optional)
              </label>
              <input
                id="links"
                name="links"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Product URL, Figma/Notion/GitHub links, Loom videos, etc."
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-xs font-medium text-slate-200"
              >
                Project details
              </label>
              <textarea
                id="details"
                name="details"
                rows={6}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="What are you building? What does success look like? Any hard constraints or must-have features?"
              />
            </div>

            <button
              type="submit"
              className="btn-pill mt-2"
            >
              Request project quote
            </button>

            <p className="mt-2 text-xs text-slate-500">
              I’ll review your details and send over a ballpark estimate and
              next steps. For support or billing questions, please use the{" "}
              <a
                href="/contact"
                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
              >
                contact form
              </a>
              .
            </p>
          </form>

          {/* Quote-specific sidebar: pricing + process */}
          <aside className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Typical pricing
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>- Launch Starter projects: usually $2,500–4,000.</li>
                <li>- Product Ready projects: typically $6,500–12,000.</li>
                <li>
                  - Ongoing Partner retainers: from $2,000/month for dedicated
                  design time.
                </li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Final pricing depends on scope, complexity, and timelines. I’ll
                always share a clear breakdown before we start.
              </p>
            </div>

            <div className="h-px w-full bg-slate-800" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                How the quote process works
              </h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-300">
                <li>1. You share your context, goals, and constraints.</li>
                <li>2. I may follow up with a few clarifying questions.</li>
                <li>
                  3. You receive a ballpark estimate, suggested scope, and
                  timeline.
                </li>
              </ol>
            </div>

            <div className="h-px w-full bg-slate-800" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Prefer email?
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                You can also email project briefs directly to{" "}
                <a
                  href="mailto:quotes@nextforgepro.com"
                  className="text-cyan-300 hover:text-cyan-200"
                >
                  quotes@nextforgepro.com
                </a>
                . Attach any relevant docs or links and I’ll take a look.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
