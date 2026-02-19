// app/contact/page.tsx
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact – Next Forge Pro",
  description:
    "Start a conversation about your next web or app project with Next Forge Pro.",
};

export default function ContactPage() {
  return (
    <main className="border-b border-slate-900/60 bg-slate-950/90">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 md:py-16">
        <header className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            Contact
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            Let&apos;s talk about your project.
          </h1>
          <p className="text-sm text-slate-300 md:text-base">
            Share a bit about what you&apos;re building, your timeline, and your
            budget range. I&apos;ll follow up with next steps and a clear
            recommendation.
          </p>
        </header>

        <ContactForm />
      </div>
    </main>
  );
}
