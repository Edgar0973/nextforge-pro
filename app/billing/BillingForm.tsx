// app/billing/BillingForm.tsx
"use client";

import { useState } from "react";

export default function BillingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          invoiceNumber,
          message,
          sourcePage: "/billing",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit billing request.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setCompany("");
      setInvoiceNumber("");
      setMessage("");
    } catch (err: any) {
      console.error("[BillingForm] Submit error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Your billing message has been sent. We&apos;ll get back to you soon.
        </p>
      )}

      {errorMsg && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorMsg}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-200">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
            autoComplete="name"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-200">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-200">
          Company (optional)
        </label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
          autoComplete="organization"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-200">
          Invoice number (optional)
        </label>
        <input
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
          placeholder="e.g. NFP-2026-001"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-medium text-slate-200">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
          placeholder="Tell us what you need help with: invoice questions, payment issues, etc."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Submit billing request"}
      </button>
    </form>
  );
}