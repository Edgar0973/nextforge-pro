import { Section } from "@/components/section";

export default function ContactPage() {
  return (
    <>
      <Section
        eyebrow="Contact"
        title="Share a bit about your project"
        kicker="I'll review your project details and reply within one business day with next steps."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
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
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                  placeholder="Alex Founder"
                  required
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
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                  placeholder="you@company.com"
                  required
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
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Looply, B2B SaaS for ops teams"
              />
            </div>

            <div>
              <label
                htmlFor="projectType"
                className="block text-xs font-medium text-slate-200"
              >
                What are you looking for?
              </label>
              <select
                id="projectType"
                name="projectType"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>New website</option>
                <option>App or product UI</option>
                <option>UX audit / consulting</option>
                <option>Ongoing design support</option>
                <option>Something else</option>
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
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>Under $2,500</option>
                <option>$2,500 - $5,000</option>
                <option>$5,000 - $10,000</option>
                <option>$10,000+</option>
              </select>
            </div>

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
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="e.g., Kickoff in 3-4 weeks, launch in 2 months"
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
                rows={5}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="What are you building? What problem are you trying to solve? Any links I should look at?"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Submit inquiry
            </button>

            <p className="mt-2 text-xs text-slate-500">
              No spam, ever. I'll only use your details to respond to this
              inquiry.
            </p>
          </form>

          <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Typical pricing
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                - Launch Starter projects usually fall between $2,500-4,000.
              </li>
              <li>
                - Product Ready projects are typically $6,500-12,000.
              </li>
              <li>
                - Ongoing Partner retainers start at $2,000/month for 1-2 days
                per week.
              </li>
            </ul>

            <div className="h-px w-full bg-slate-800" />

            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Direct contact
            </h3>
            <p className="text-sm text-slate-300">
              Prefer email? Reach me at{" "}
              <a
                href="mailto:contact@nextforgepro.com"
                className="text-sky-300 hover:text-sky-200"
              >
                contact@nextforgepro.com
              </a>
            </p>
            <p className="text-sm text-slate-300">
              Or connect on{" "}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-300 hover:text-sky-200"
              >
                LinkedIn
              </a>{" "}
              to stay in touch.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
