// app/support/page.tsx
import type { Metadata } from "next";
import SupportForm from "./supportForm";

export const metadata: Metadata = {
  title: "Support | Next Forge Pro",
  description: "Get help with your existing website or app project.",
};

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-slate-50">Support</h1>
      <p className="mt-2 text-sm text-slate-300">
        Already working with Next Forge Pro and need help with your website or
        app? Send a support request and we&apos;ll follow up as soon as
        possible.
      </p>

      <div className="mt-8">
        <SupportForm />
      </div>
    </main>
  );
}