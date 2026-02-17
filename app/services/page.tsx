import { Section } from "@/components/section";

const detailedServices = [
  {
    name: "Website Design",
    subtitle: "Responsive, conversion-focused marketing sites",
    problems: [
      "Your current site looks dated or off-brand.",
      "Visitors don’t understand what you do or why you’re different.",
      "Leads drop off before booking a demo or call.",
    ],
    solutions: [
      "Modern, mobile-first layouts tailored to your brand.",
      "Clear messaging hierarchy and storytelling across pages.",
      "Conversion-focused patterns: social proof, CTAs, pricing, FAQs.",
    ],
  },
  {
    name: "App & Product Design",
    subtitle: "Mobile and web apps that feel effortless to use",
    problems: [
      "Onboarding is confusing and users churn early.",
      "Your UI is inconsistent across platforms and features.",
      "Design debt makes it hard to ship new features quickly.",
    ],
    solutions: [
      "Mapped user journeys and simplified flows.",
      "Reusable components and patterns to keep UI consistent.",
      "Design systems that scale as your product grows.",
    ],
  },
  {
    name: "UX & Design Consulting",
    subtitle: "Strategic support for product teams",
    problems: [
      "You’re not sure what to prioritize next.",
      "Design feedback loops are slow or unclear.",
      "You need a partner to sanity-check big decisions.",
    ],
    solutions: [
      "UX audits and prioritised recommendations.",
      "Design review sessions with action-focused feedback.",
      "Support with roadmapping, scope, and design briefs.",
    ],
  },
];

const packages = [
  {
    name: "Launch Starter",
    price: "From $2,500",
    idealFor: "Early-stage founders validating an idea.",
    includes: [
      "1-page marketing site or basic product landing",
      "Light brand styling (colors, type, components)",
      "Mobile-responsive layout",
      "Basic SEO setup (titles, meta, alt text)",
    ],
  },
  {
    name: "Product Ready",
    price: "From $6,500",
    idealFor: "Teams preparing for a major launch or redesign.",
    includes: [
      "Multi-page marketing site or core product flows",
      "UX mapping and wireframes for key journeys",
      "High-fidelity UI for desktop & mobile",
      "Design system starter kit (buttons, forms, cards, etc.)",
    ],
  },
  {
    name: "Ongoing Partner",
    price: "From $2,000 / month",
    idealFor: "Teams that need ongoing design help.",
    includes: [
      "Dedicated design hours each month",
      "Async collaboration via Slack/Notion",
      "Design reviews & iterations on live product",
      "Priority scheduling for urgent updates",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section
        eyebrow="Services"
        title="Design services built around modern product teams"
        kicker="Every engagement starts with a short call to understand your goals, constraints, and timelines."
      >
        <div className="space-y-8">
          {detailedServices.map((service) => (
            <article
              key={service.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200"
            >
              <h2 className="text-base font-semibold text-slate-50">
                {service.name}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {service.subtitle}
              </p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                    Common problems
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {service.problems.map((p) => (
                      <li key={p} className="text-slate-300">
                        • {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                    How I help
                  </h3>
                  <ul className="mt-2 space-y-2 text-sm">
                    {service.solutions.map((s) => (
                      <li key={s} className="text-slate-300">
                        • {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Packages"
        title="Flexible packages with transparent starting points"
        kicker="Pricing ranges help you budget without locking us into a fixed scope too early."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm"
            >
              <h3 className="text-sm font-semibold text-slate-50">
                {pkg.name}
              </h3>
              <p className="mt-1 text-sky-300">{pkg.price}</p>
              <p className="mt-2 text-xs text-slate-400">{pkg.idealFor}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                {pkg.includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Final pricing depends on scope, complexity, and timelines.
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
