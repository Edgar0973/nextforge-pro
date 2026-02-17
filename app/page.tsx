import Link from "next/link";
import { Section } from "@/components/section";

const featuredProjects = [
  {
    title: "Finch – Mobile Banking App",
    role: "Product design, UX/UI",
    outcome: "Onboarded 30k+ users in the first 90 days.",
  },
  {
    title: "Northwind SaaS Dashboard",
    role: "Web app design, design system",
    outcome: "Increased trial-to-paid conversion by 18%.",
  },
];

const services = [
  {
    name: "Website Design",
    description:
      "Responsive, fast websites designed to convert visitors into customers.",
  },
  {
    name: "App Design",
    description:
      "iOS, Android, and cross-platform UI that feels native and delightful.",
  },
  {
    name: "UX & Product Strategy",
    description:
      "Research-backed UX that reduces friction and increases engagement.",
  },
];

const testimonials = [
  {
    name: "Sarah Gomez",
    role: "Founder, Looply",
    quote:
      "Alex translated a vague product idea into a polished app experience that our users love.",
  },
  {
    name: "James Wu",
    role: "Head of Growth, Nimbus",
    quote:
      "Our new marketing site cut customer support tickets in half and boosted demo requests.",
  },
];

export default function HomePage() {
  return (
    <>
      <Section
        id="hero"
        className="border-b border-slate-900/80 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950"
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="mb-3 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
              Mobile-first apps & responsive websites for startups
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              I design{" "}
              <span className="text-sky-300">
                product-focused websites & apps
              </span>{" "}
              that turn ideas into revenue.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
              I help early-stage and growing teams design, prototype, and ship
              digital products that feel effortless to use — without sacrificing
              performance or accessibility.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400"
              >
                Get a project quote
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-sky-400 hover:text-sky-300"
              >
                View portfolio
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Available for 1–2 new projects starting next month.
            </p>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto max-w-sm rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span>Product dashboard</span>
                <span>Live preview</span>
              </div>
              <div className="grid gap-3">
                <div className="h-24 rounded-xl border border-slate-800 bg-slate-900" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 rounded-lg border border-slate-800 bg-slate-900" />
                  <div className="h-16 rounded-lg border border-slate-800 bg-slate-900" />
                  <div className="h-16 rounded-lg border border-slate-800 bg-slate-900" />
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                High-fidelity mockups, clickable prototypes, and developer-ready
                handoff.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="services"
        eyebrow="Services"
        title="What I can help you build"
        kicker="From first sketch to final handoff, I design digital products that align with your goals and your users’ needs."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <h3 className="text-sm font-semibold text-slate-50">
                {service.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-slate-300">
          <p>
            I combine UX research, interaction design, and visual polish to
            ship interfaces that feel intuitive from the first tap.
          </p>
        </div>
      </Section>

      <Section
        id="featured-work"
        eyebrow="Portfolio"
        title="Selected client projects"
        kicker="Each project starts with a clear problem, a focused strategy, and measurable outcomes."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="h-32 rounded-xl border border-slate-800 bg-slate-950/80" />
              <h3 className="mt-4 text-sm font-semibold text-slate-50">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">{project.role}</p>
              <p className="mt-3 text-sm text-slate-300">{project.outcome}</p>
              <Link
                href="/portfolio"
                className="mt-4 text-sm font-medium text-sky-300 hover:text-sky-200"
              >
                View full case study →
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="testimonials"
        eyebrow="Social proof"
        title="Clients I’ve partnered with"
        kicker="I work closely with founders, PMs, and engineering teams to ship work that actually moves numbers."
      >
        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>Trusted by teams at</span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            Looply
          </span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            Nimbus
          </span>
          <span className="rounded-full border border-slate-800 px-3 py-1">
            Finch
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <p className="text-sm text-slate-200">“{t.quote}”</p>
              <figcaption className="mt-4 text-xs text-slate-400">
                <span className="font-medium text-slate-200">{t.name}</span>{" "}
                · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        id="resources"
        eyebrow="Resources"
        title="Articles & resources for product teams"
        kicker="Short, practical posts on UX, product launches, and design workflows."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
            <h3 className="font-semibold text-slate-50">
              Designing a mobile onboarding that doesn’t leak users
            </h3>
            <p className="mt-2 text-slate-300">
              A checklist for frictionless first sessions on iOS and Android.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
            <h3 className="font-semibold text-slate-50">
              How to brief a freelance designer (and get better work)
            </h3>
            <p className="mt-2 text-slate-300">
              A simple template founders can use to scope their next project.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
            <h3 className="font-semibold text-slate-50">
              From Figma to production: smooth handoff for dev teams
            </h3>
            <p className="mt-2 text-slate-300">
              My process for design systems, specs, and async collaboration.
            </p>
          </article>
        </div>
      </Section>

      <Section className="border-b-0 bg-slate-950">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-sky-500/10 via-slate-950 to-slate-950 p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Ready to design your next product launch?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-200 md:text-base">
            Tell me a bit about your product, timeline, and goals. I’ll respond
            within one business day with next steps and a rough estimate.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Book a free intro call
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-sky-400 hover:text-sky-300"
            >
              View services & pricing
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
