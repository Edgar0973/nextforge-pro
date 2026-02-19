import QuoteForm from "./QuoteForm";

export const metadata = {
  title: "Request a project quote – Next Forge Pro",
  description:
    "Tell me about your project, budget, and timeline to receive a tailored project quote.",
};

export default function QuotePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
          Quote
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
          Request a project quote
        </h1>
        <p className="mt-3 text-sm text-slate-300 md:text-base">
          Share what you&apos;re building, your budget range, and your timeline.
          I&apos;ll review your details and follow up with a clear recommendation
          and estimated pricing.
        </p>
      </div>

      <QuoteForm />
    </main>
  );
}
