import { Section } from "@/components/section";

const projects = [
  {
    name: "Finch – Mobile Banking App",
    role: "Product design, UX/UI",
    result: "Onboarded 30k+ users in the first 90 days.",
  },
  {
    name: "Northwind SaaS Dashboard",
    role: "Web app design, design system",
    result: "Increased trial-to-paid conversion by 18%.",
  },
  {
    name: "Nimbus Analytics",
    role: "Web app design, data visualization",
    result: "Cut reporting time for ops teams by 40%.",
  },
];

export default function PortfolioPage() {
  return (
    <>
      <Section
        eyebrow="Portfolio"
        title="Selected projects"
        kicker="A snapshot of the kind of work I do with product-focused teams."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-200"
            >
              <h3 className="text-base font-semibold text-slate-50">
                {project.name}
              </h3>
              <p className="mt-1 text-xs text-cyan-300">{project.role}</p>
              <p className="mt-3 text-sm text-slate-300">{project.result}</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Case study
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  Product design
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
