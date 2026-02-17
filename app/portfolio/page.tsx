import { Section } from "@/components/section";

const projects = [
  {
    name: "Finch – Mobile Banking App",
    industry: "Fintech · Mobile",
    background:
      "Finch needed a mobile app that made budgeting and saving feel friendly instead of intimidating.",
    role: "Product design, UX research, interaction design, UI design",
    approach: [
      "Interviewed 6 target users to understand mental models around budgeting.",
      "Mapped onboarding and core flows to reduce choices at each step.",
      "Designed a component-based UI system for charts, cards, and notifications.",
    ],
    outcome:
      "Onboarded 30k+ users in the first 90 days with a 62% completion rate on onboarding.",
  },
  {
    name: "Northwind – SaaS Analytics Dashboard",
    industry: "B2B SaaS · Web app",
    background:
      "Northwind’s dashboard had grown organically, making it difficult for customers to find critical insights.",
    role: "UX audit, information architecture, UI redesign",
    approach: [
      "Audited existing flows and identified key friction points.",
      "Redesigned navigation and information hierarchy around user jobs-to-be-done.",
      "Created a design system for tables, filters, and states.",
    ],
    outcome:
      "Trial-to-paid conversion increased by 18% and support tickets about the dashboard dropped by 35%.",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Section
        eyebrow="Portfolio"
        title="Case studies from recent projects"
        kicker="A closer look at how I collaborate with teams to ship meaningful product improvements."
      >
        <div className="space-y-8">
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200"
            >
              <header className="mb-4">
                <h2 className="text-base font-semibold text-slate-50">
                  {project.name}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {project.industry}
                </p>
              </header>

              <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                      Background
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {project.background}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                      Role & scope
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {project.role}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                      Approach
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-300">
                      {project.approach.map((step) => (
                        <li key={step}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                      Outcome
                    </h3>
                    <p className="mt-2 text-sm text-slate-200">
                      {project.outcome}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-40 rounded-xl border border-slate-800 bg-slate-950/80" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-lg border border-slate-800 bg-slate-950/80" />
                    <div className="h-24 rounded-lg border border-slate-800 bg-slate-950/80" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Swap these placeholders with real mockups or before/after
                    comparisons from your projects.
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
