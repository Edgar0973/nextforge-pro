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
