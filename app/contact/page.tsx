import { Section } from "@/components/section";

export default function ContactPage() {
  return (
    <>
      <Section
        eyebrow="Contact"
        title="Say hello, ask a question, or request support"
        kicker="Use this form for general questions, support issues, or collaboration ideas. For project estimates, head to the quote form instead."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          {/* Contact / support form */}
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
                htmlFor="topic"
                className="block text-xs font-medium text-slate-200"
              >
                What can I help you with?
              </label>
              <select
                id="topic"
                name="topic"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 focus:ring"
              >
                <option>General question</option>
                <option>Support / issue with an existing project</option>
                <option>Billing or invoicing</option>
                <option>Partnership / collaboration</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="projectRef"
                className="block text-xs font-medium text-slate-200"
              >
                If this relates to an existing project, how should I identify it?
              </label>
              <input
                id="projectRef"
                name="projectRef"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Project name, invoice number, or short reference (optional)"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs font-medium text-slate-200"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Share any context, questions, or links that will help me respond."
              />
            </div>

            <div>
              <label
                htmlFor="howHeard"
                className="block text-xs font-medium text-slate-200"
              >
                How did you hear about Next Forge Pro? (optional)
              </label>
              <input
                id="howHeard"
                name="howHeard"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-cyan-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Thumbtack, LinkedIn, Upwork, YouTube, Reddit, referral, etc."
              />
            </div>

            <button
              type="submit"
              className="btn-pill mt-2"
            >
              Send message
            </button>

            <p className="mt-2 text-xs text-slate-500">
              I typically reply within one business day. For project estimates,
              please use the{" "}
              <a
                href="/quote"
                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
              >
                quote form
              </a>
              .
            </p>
          </form>

          {/* Contact / support info sidebar */}
          <aside className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Direct email
              </h3>
              <div className="mt-3 space-y-1 text-sm text-slate-300">
                <p>
                  General:{" "}
                  <a
                    href="mailto:contact@nextforgepro.com"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    contact@nextforgepro.com
                  </a>
                </p>
                <p>
                  Support:{" "}
                  <a
                    href="mailto:support@nextforgepro.com"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    support@nextforgepro.com
                  </a>
                </p>
                <p>
                  Billing:{" "}
                  <a
                    href="mailto:billing@nextforgepro.com"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    billing@nextforgepro.com
                  </a>
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-slate-800" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Response times
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Most messages receive a reply within one business day. Support
                and billing questions are prioritized during business hours.
              </p>
            </div>

            <div className="h-px w-full bg-slate-800" />

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                Other ways to connect
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                <li>
                  LinkedIn –{" "}
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:text-cyan-200"
                  >
                    follow or send a DM
                  </a>
                </li>
                <li>
                  Upwork – your{" "}
                  <span className="text-slate-200">Next Forge Pro</span> profile
                  when you’re ready.
                </li>
                <li>
                  Thumbtack – for local or small-scope engagements.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
