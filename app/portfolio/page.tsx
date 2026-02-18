// app/portfolio/page.tsx
import { Section } from "@/components/section";

const projects = [
  {
    title: "Finch – Mobile Banking App",
    role: "Product design · UX/UI",
    period: "12-week engagement",
    summary:
      "End-to-end design for a mobile-first banking experience with onboarding, money movement, and card controls.",
    impact: "Onboarded 30k+ users in the first 90 days.",
    tags: ["Fintech", "iOS & Android", "Design system"],
  },
  {
    title: "Northwind SaaS Dashboard",
    role: "Web app UI · Design system",
    period: "Ongoing partner",
    summary:
      "Redesigned a complex B2B dashboard to surface key metrics, streamline workflows, and reduce cognitive load.",
    impact: "Increased trial-to-paid conversion by 18%.",
    tags: ["B2B SaaS", "Dashboard", "Design ops"],
  },
  {
    title: "Looply – Lifecycle Marketing Site",
    role: "Marketing site · UX & content",
    period: "4-week sprint",
    summary:
      "High-converting marketing site for a Series A SaaS startup, focused on clear positioning and demo requests.",
    impact: "Cut support tickets in half and boosted demo requests.",
    tags: ["Marketing site", "Storytelling", "Conversion"],
  },
  {
    title: "Nimbus – Product Onboarding",
    role: "Product UX · Experimentation",
    period: "6-week engagement",
    summary:
      "Experiment-led onboarding flow redesign for a collaboration tool used by remote-first teams.",
    impact: "Improved activation rate by 14% across cohorts.",
    tags: ["Onboarding", "Experimentation", "Remote teams"],
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Section
        eyebrow="Portfolio"
        title="Selected product and interface work"
        kicker="A snapshot of recent projects across SaaS, fintech, and marketing sites."
      >
        {/* Intro blurb */}
        <div className="mb-8 max-w-2xl text-sm text-slate-300 md:text-base">
          <p>
            I work with early-stage startups and growing teams to translate
            complex problems into product-ready interfaces. Here’s a sample of
            projects that show the types of work and outcomes we can create
            together.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/80 p-5 text-sm text-slate-200 shadow-[0_0_32px_rgba(15,23,42,0.9)] transition hover:border-cyan-400/60 hover:shadow-[0_0_48px_rgba(45,212,191,0.45)]"
            >
              {/* subtle gradient edge */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(244,114,182,0.12),_transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col gap-3">
                <header>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-400">
                    {project.role}
                  </p>
                  <h2 className="mt-1 text-base font-semibold text-slate-50">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {project.period}
                  </p>
                </header>

                <p className="text-sm text-slate-300">{project.summary}</p>

                <div className="mt-2 rounded-lg border border-slate-800/80 bg-slate-950/80 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Outcome
                  </p>
                  <p className="mt-1 text-sm text-emerald-400/90">
                    {project.impact}
                  </p>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-700/70 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-300 group-hover:border-cyan-400/60 group-hover:text-cyan-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Closing note */}
        <div className="mt-10 max-w-xl text-xs text-slate-400 md:text-sm">
          <p>
            Want to see work closer to your niche? I can share private case
            studies for fintech, B2B SaaS, and internal tools over email.{" "}
            <a
              href="/quote"
              className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
            >
              Tell me about your project
            </a>{" "}
            and I’ll include relevant examples.
          </p>
        </div>
      </Section>
    </>
  );
}
