#!/usr/bin/env bash
set -euo pipefail

# Simple safety check: must be run from project root (where package.json is)
if [ ! -f "package.json" ]; then
  echo "❌ This script must be run from your Next.js project root (where package.json is)."
  exit 1
fi

echo "Fixing / creating pages and components in: $(pwd)"

# Ensure folders exist
mkdir -p app/about app/services app/portfolio app/contact components

################################
# app/layout.tsx
################################
cat << 'EOF' > app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Next Forge Pro – Freelance Web & App Designer",
  description:
    "Mobile-first app and responsive website design for startups and growing teams.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
EOF

################################
# components/section.tsx
################################
cat << 'EOF' > components/section.tsx
import { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  kicker?: string;
  children: ReactNode;
}

export function Section({
  id,
  className = "",
  eyebrow,
  title,
  kicker,
  children,
}: SectionProps) {
  return (
    <section id={id} className={`border-b border-slate-900/60 ${className}`}>
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        {(eyebrow || title || kicker) && (
          <header className="mb-8 max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {title}
              </h2>
            )}
            {kicker && (
              <p className="mt-3 text-sm text-slate-300 md:text-base">
                {kicker}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
EOF

################################
# components/header.tsx
################################
cat << 'EOF' > components/header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-sky-500/20 ring-1 ring-sky-500/40" />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-sky-300">
              Alex Parker
            </p>
            <p className="text-xs text-slate-400">Web & App Designer</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-sky-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
EOF

################################
# components/footer.tsx
################################
cat << 'EOF' > components/footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} Alex Parker. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:text-sky-300">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-sky-300">
            Terms
          </Link>
          <span className="hidden h-4 w-px bg-slate-700 md:inline-block" />
          <div className="flex gap-3">
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300"
            >
              Dribbble
            </a>
            <a
              href="https://behance.net"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300"
            >
              Behance
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
EOF

################################
# app/page.tsx (Home)
################################
cat << 'EOF' > app/page.tsx
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
EOF

################################
# app/about/page.tsx
################################
cat << 'EOF' > app/about/page.tsx
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
EOF

################################
# app/services/page.tsx
################################
cat << 'EOF' > app/services/page.tsx
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
EOF

################################
# app/portfolio/page.tsx
################################
cat << 'EOF' > app/portfolio/page.tsx
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
EOF

################################
# app/contact/page.tsx
################################
cat << 'EOF' > app/contact/page.tsx
import { Section } from "@/components/section";

export default function ContactPage() {
  return (
    <>
      <Section
        eyebrow="Contact"
        title="Share a bit about your project"
        kicker="I’ll review your project details and reply within one business day with next steps."
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)]">
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
                htmlFor="company"
                className="block text-xs font-medium text-slate-200"
              >
                Company / product
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="Looply, B2B SaaS for ops teams"
              />
            </div>

            <div>
              <label
                htmlFor="projectType"
                className="block text-xs font-medium text-slate-200"
              >
                What are you looking for?
              </label>
              <select
                id="projectType"
                name="projectType"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>New website</option>
                <option>App or product UI</option>
                <option>UX audit / consulting</option>
                <option>Ongoing design support</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="budget"
                className="block text-xs font-medium text-slate-200"
              >
                Budget range (USD)
              </label>
              <select
                id="budget"
                name="budget"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 focus:ring"
              >
                <option>Under $2,500</option>
                <option>$2,500 – $5,000</option>
                <option>$5,000 – $10,000</option>
                <option>$10,000+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="timeline"
                className="block text-xs font-medium text-slate-200"
              >
                Ideal timeline
              </label>
              <input
                id="timeline"
                name="timeline"
                type="text"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="e.g., Kickoff in 3–4 weeks, launch in 2 months"
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="block text-xs font-medium text-slate-200"
              >
                Project details
              </label>
              <textarea
                id="details"
                name="details"
                rows={5}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none ring-sky-500/60 placeholder:text-slate-500 focus:ring"
                placeholder="What are you building? What problem are you trying to solve? Any links I should look at?"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Submit inquiry
            </button>

            <p className="mt-2 text-xs text-slate-500">
              No spam, ever. I’ll only use your details to respond to this
              inquiry.
            </p>
          </form>

          <aside className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-200">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Typical pricing
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Launch Starter projects usually fall between $2,500–$4,000.</li>
              <li>• Product Ready projects are typically $6,500–$12,000.</li>
              <li>
                • Ongoing Partner retainers start at $2,000/month for 1–2 days
                per week.
              </li>
            </ul>

            <div className="h-px w-full bg-slate-800" />

            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              Direct contact
            </h3>
            <p className="text-sm text-slate-300">
              Prefer email? Reach me at{" "}
              <a
                href="mailto:hello@alexparker.design"
                className="text-sky-300 hover:text-sky-200"
              >
                hello@alexparker.design
              </a>
            </p>
            <p className="text-sm text-slate-300">
              Or connect on{" "}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-sky-300 hover:text-sky-200"
              >
                LinkedIn
              </a>{" "}
              to stay in touch.
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}
EOF

echo "✅ Done. Pages and components have been created/updated."
