import { Section } from "@/components/section";

export default function AboutPage() {
  return (
    <>
      <Section
        eyebrow="About"
        title="Hi, I’m Alex — a freelance product designer focused on the details that matter."
        kicker="I blend UX strategy, interface design, and product thinking to help teams launch faster with more confidence."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          <div className="space-y-4 text-sm text-slate-200 md:text-base">
            <p>
              Over the last 6+ years, I’ve worked with startups and SaaS teams
              to design marketing sites, dashboards, and mobile apps that feel
              simple on the surface but are deeply considered under the hood.
            </p>
            <p>
              My process is collaborative and transparent: I share early,
              gather feedback often, and make sure we’re designing for real
              users and real constraints — not just Dribbble shots.
            </p>
            <p>
              I’m at my best when I’m embedded with a small team, bridging the
              gaps between founders, PMs, and engineering.
            </p>
          </div>
          <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Values & approach
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="font-semibold text-slate-50">
                  UX-first decisions:
                </span>{" "}
                every layout, interaction, and copy choice is anchored in user
                flows.
              </li>
              <li>
                <span className="font-semibold text-slate-50">
                  Cross-platform thinking:
                </span>{" "}
                I design for mobile, tablet, and desktop from day one.
              </li>
              <li>
                <span className="font-semibold text-slate-50">
                  Accessibility aware:
                </span>{" "}
                contrast, keyboard navigation, and clear content structure
                baked in.
              </li>
            </ul>
          </aside>
        </div>
      </Section>

      <Section eyebrow="Why work together" title="What sets my work apart">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Product-minded design
            </h3>
            <p className="mt-2 text-slate-300">
              I think beyond screens — about activation, retention, and
              business goals — so the design work ties directly to metrics.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Developer-friendly handoff
            </h3>
            <p className="mt-2 text-slate-300">
              Component-based systems, clear specs, and async Loom walkthroughs
              keep your engineers unblocked.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
            <h3 className="text-sm font-semibold text-slate-50">
              Calm, reliable communication
            </h3>
            <p className="mt-2 text-slate-300">
              You’ll always know what I’m working on, what’s next, and what I
              need from you to keep moving.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
