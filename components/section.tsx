import { ReactNode } from "react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  kicker?: string;
  className?: string;
  children: ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  kicker,
  className,
  children,
}: SectionProps) {
  const sectionClass = [
    "border-b border-slate-900/60",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = eyebrow || title || kicker;

  return (
    <section id={id} className={sectionClass}>
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        {hasHeader && (
          <header className="mb-8 max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
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
