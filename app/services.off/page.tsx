import { Section } from "@/components/section";

export default function ServicesPage() {
  return (
    <>
      <Section
        eyebrow="Services"
        title="Design services built around modern product teams"
        kicker="Every engagement starts with a short call to understand your goals, constraints, and timelines."
      >
        <div className="space-y-8">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h2 className="text-base font-semibold text-slate-50">
              Website Design
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Responsive, conversion-focused marketing sites
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  Common problems
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • Your current site looks dated or off-brand.
                  </li>
                  <li className="text-slate-300">
                    • Visitors don’t understand what you do or why you’re
                    different.
                  </li>
                  <li className="text-slate-300">
                    • Leads drop off before booking a demo or call.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  How I help
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • Modern, mobile-first layouts tailored to your brand.
                  </li>
                  <li className="text-slate-300">
                    • Clear messaging hierarchy and storytelling across pages.
                  </li>
                  <li className="text-slate-300">
                    • Conversion-focused patterns: social proof, CTAs, pricing,
                    FAQs.
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h2 className="text-base font-semibold text-slate-50">
              App &amp; Product Design
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Mobile and web apps that feel effortless to use
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  Common problems
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • Onboarding is confusing and users churn early.
                  </li>
                  <li className="text-slate-300">
                    • Your UI is inconsistent across platforms and features.
                  </li>
                  <li className="text-slate-300">
                    • Design debt makes it hard to ship new features quickly.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  How I help
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • Mapped user journeys and simplified flows.
                  </li>
                  <li className="text-slate-300">
                    • Reusable components and patterns to keep UI consistent.
                  </li>
                  <li className="text-slate-300">
                    • Design systems that scale as your product grows.
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h2 className="text-base font-semibold text-slate-50">
              UX &amp; Design Consulting
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Strategic support for product teams
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  Common problems
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • You’re not sure what to prioritize next.
                  </li>
                  <li className="text-slate-300">
                    • Design feedback loops are slow or unclear.
                  </li>
                  <li className="text-slate-300">
                    • You need a partner to sanity-check big decisions.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                  How I help
                </h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="text-slate-300">
                    • UX audits and prioritised recommendations.
                  </li>
                  <li className="text-slate-300">
                    • Design review sessions with action-focused feedback.
                  </li>
                  <li className="text-slate-300">
                    • Support with roadmapping, scope, and design briefs.
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </Section>

      <Section
        eyebrow="Packages"
        title="Flexible packages with transparent starting points"
        kicker="Pricing ranges help you budget without locking us into a fixed scope too early."
      >
        <div className="grid gap-6 md:grid-cols-3">
          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Launch Starter
            </h3>
            <p className="mt-1 text-sky-300">From $2,500</p>
            <p className="mt-2 text-xs text-slate-400">
              Early-stage founders validating an idea.
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
              <li>• 1-page marketing site or basic product landing</li>
              <li>• Light brand styling (colors, type, components)</li>
              <li>• Mobile-responsive layout</li>
              <li>• Basic SEO setup (titles, meta, alt text)</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Final pricing depends on scope, complexity, and timelines.
            </p>
          </article>

          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Product Ready
            </h3>
            <p className="mt-1 text-sky-300">From $6,500</p>
            <p className="mt-2 text-xs text-slate-400">
              Teams preparing for a major launch or redesign.
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
              <li>• Multi-page marketing site or core product flows</li>
              <li>• UX mapping and wireframes for key journeys</li>
              <li>• High-fidelity UI for desktop &amp; mobile</li>
              <li>
                • Design system starter kit (buttons, forms, cards, etc.)
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Final pricing depends on scope, complexity, and timelines.
            </p>
          </article>

          <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Ongoing Partner
            </h3>
            <p className="mt-1 text-sky-300">From $2,000 / month</p>
            <p className="mt-2 text-xs text-slate-400">
              Teams that need ongoing design help.
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
              <li>• Dedicated design hours each month</li>
              <li>• Async collaboration via Slack/Notion</li>
              <li>• Design reviews &amp; iterations on live product</li>
              <li>• Priority scheduling for urgent updates</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Final pricing depends on scope, complexity, and timelines.
            </p>
          </article>
        </div>
      </Section>

      {/* “Keep browsing” CTA band – only on Services */}
      <section className="border-t border-b border-slate-800/80 bg-slate-950/90 mt-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6 md:py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Still exploring?
            </p>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-50 md:text-lg">
              Here’s where most clients go next.
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Compare services, browse recent work, or get a fast project
              estimate in a few clicks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="/services"
              className="inline-flex items-center rounded-full border border-cyan-500/40 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20 hover:text-slate-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.65)]"
            >
              View services
            </a>
            <a
              href="/portfolio"
              className="inline-flex items-center rounded-full border border-cyan-500/40 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/20 hover:text-slate-50 hover:shadow-[0_0_30px_rgba(34,211,238,0.65)]"
            >
              See recent work
            </a>
            <a
              href="/quote"
              className="inline-flex items-center rounded-full border border-cyan-500/60 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500 hover:text-slate-950 hover:shadow-[0_0_36px_rgba(34,211,238,0.9)]"
            >
              Get a fast quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
