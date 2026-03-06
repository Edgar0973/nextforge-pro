// app/billing/page.tsx
import BillingForm from "./BillingForm";

export const metadata = {
  title: "Billing | Next Forge Pro",
  description: "Questions about invoices, payments, or billing details.",
};

export default function BillingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Billing</h1>
      <p className="mt-2 text-sm text-gray-600">
        Questions about invoices, payments, or billing details? Use this form
        and we&apos;ll follow up with you.
      </p>

      <div className="mt-8">
        <BillingForm />
      </div>
    </main>
  );
}