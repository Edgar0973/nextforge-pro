// app/support/supportForm.tsx
"use client";

import { useState } from "react";

export default function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
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
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone.trim() || undefined,
          company,
          subject,
          message,
          sourcePage: "/support",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit support request.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("[SupportForm] Submit error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <p className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Your support request has been sent. We&apos;ll get back to you soon.
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
          Phone (for SMS confirmation)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
          autoComplete="tel"
          placeholder="(973) 555-1234"
        />
        <span className="mt-1 text-xs text-slate-400">
          Optional — if provided, you’ll receive an SMS confirmation.
        </span>
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
        <label className="text-xs font-medium text-slate-200">Subject</label>
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50"
          placeholder="Describe the issue in a few words"
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
          placeholder="Tell us what’s going on, which site/app, and any relevant details."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center rounded bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Submit support request"}
      </button>
    </form>
  );
}