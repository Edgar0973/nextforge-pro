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
      {/* HERO */}
      <Section
        id="hero"
        className="border-b border-slate-900/80 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950/95"
      >
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {/* Left: pitch */}
          <div className="flex-1">
            <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Mobile-first apps &amp; responsive websites for startups
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              I design{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                product-focused interfaces
              </span>{" "}
              that turn complex ideas into usable products.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
              From first prototype to production-ready UI, I help teams design,
              refine, and ship digital experiences that feel fast, intuitive,
              and trustworthy.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/quote" className="btn-pill hover:text-slate-950">
                Get a project quote
              </Link>
              <Link
                href="/portfolio"
                className="btn-pill btn-pill-sm hover:text-slate-950"
              >
                View portfolio
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Available for 1–2 new projects starting next month.
            </p>
          </div>

          {/* Right: video + metrics card */}
          <div className="flex-1">
            <div className="relative mx-auto max-w-sm">
              <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-900/80 shadow-[0_0_60px_rgba(45,212,191,0.35)]">
                {/* subtle gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-fuchsia-500/20" />

                <div className="relative z-10 p-4">
                  <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                      Live product metrics
                    </span>
                    <span>Next Forge Pro</span>
                  </div>

                  {/* Background video */}
                  <div className="relative mb-4 h-40 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/80">
                    <video
                      src="/cascadingcodenorthtosouthneongreen.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs text-slate-200">
                    <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Launch readiness
                      </p>
                      <p className="mt-1 text-lg font-semibold text-cyan-300">
                        92%
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-400">
                        +18% vs last sprint
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Conversion
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-50">
                        4.2%
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-400">
                        +0.8 pts
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-800/80 bg-slate-950/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        Support tickets
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-50">
                        −35%
                      </p>
                      <p className="mt-1 text-[11px] text-cyan-300">
                        Post-redesign
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra glow accent */}
              <div className="pointer-events-none absolute -left-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/40 blur-3xl" />
            </div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section
        eyebrow="Services"
        title="Design support for product-focused teams"
        kicker="From first launch to iterative product work, I partner with teams to design interfaces that ship."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-200 shadow-[0_0_24px_rgba(15,23,42,0.8)]"
            >
              <h3 className="text-sm font-semibold text-slate-50">
                {service.name}
              </h3>
              <p className="mt-2 text-slate-300">{service.description}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Recent projects */}
      <Section
        eyebrow="Selected work"
        title="Recent projects"
        kicker="A sample of past collaborations and outcomes."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <article
              key={project.title}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-200"
            >
              <h3 className="text-base font-semibold text-slate-50">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-cyan-300">{project.role}</p>
              <p className="mt-3 text-sm text-slate-300">{project.outcome}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section
        eyebrow="Testimonials"
        title="Teams I’ve partnered with"
        kicker="A few words from people I’ve worked with on launches, redesigns, and product iterations."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-200"
            >
              <blockquote className="text-slate-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-3 text-xs text-slate-400">
                <span className="font-medium text-slate-200">{t.name}</span> ·{" "}
                {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </>
  );
}
