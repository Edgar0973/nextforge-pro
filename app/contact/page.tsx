import { Section } from "@/components/section";

export default function ContactPage() {
  return (
    <>
      <Section
        eyebrow="Contact"
        title="Say hello"
        kicker="Use this form for quick questions, collaboration ideas, or speaking invitations."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
          {/* Simple contact form */}
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
                htmlFor="subject"
                className="block text-xs font-medium text-slate-200"
              >
                What’s this about?
              </label>
              <select
                id="subject"
                name="subject"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>General question</option>
                <option>Potential collaboration</option>
                <option>Speaking or workshop</option>
                <option>Support / follow-up on a project</option>
                <option>Something else</option>
              </select>
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
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Share a bit of context so I know how best to respond."
                required
              />
            </div>

            <div>
              <label
                htmlFor="howHeard"
                className="block text-xs font-medium text-slate-200"
              >
                How did you hear about Next Forge Pro?
              </label>
              <select
                id="howHeard"
                name="howHeard"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>Referral</option>
                <option>Search</option>
                <option>Social media</option>
                <option>Content / article</option>
                <option>Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Send message
            </button>

            <p className="mt-2 text-xs text-slate-500">
              I typically reply within one business day. I’ll only use your
              details to respond to this message.
            </p>
          </form>

          {/* Sidebar tailored for general contact */}
          <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Best for
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Quick questions before starting a project.</li>
              <li>• Collaboration or speaking invitations.</li>
              <li>• Follow-ups on in-progress or past work.</li>
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
              .
            </p>
            <p className="text-sm text-slate-300">
              I’m based in US Central time and usually respond between 9am–5pm.
            </p>

            <div className="h-px w-full bg-slate-800" />

            <p className="text-xs text-slate-500">
              For project quotes and scoped work, please use the{" "}
              <a
                href="/quote"
                className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
              >
                project quote form
              </a>
              .
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
