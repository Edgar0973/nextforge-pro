"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function handleFieldChange(_e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    // If the user starts editing after an error/success, go back to idle
    if (status === "error" || status === "success") {
      setStatus("idle");
      setError(null);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const company = String(formData.get("company") || "").trim() || undefined;

    // Basic client-side validation
    if (!email || !message) {
      setStatus("error");
      setError("Please provide at least your email and a short message.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          company,
          sourcePage: "/contact",
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // In case response body isn't JSON
        json = null;
      }

      if (!res.ok) {
        const apiError =
          (json && typeof json.error === "string" && json.error) ||
          "Something went wrong. Please try again.";
        setStatus("error");
        setError(apiError);
        return;
      }

      // Success
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Contact form submit error:", err);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_0_24px_rgba(15,23,42,0.9)]"
      aria-busy={isSubmitting}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
          >
            Email<span className="text-cyan-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="company"
          className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
        >
          Company or brand (optional)
        </label>
        <input
          id="company"
          name="company"
          type="text"
          onChange={handleFieldChange}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
        >
          Project summary<span className="text-cyan-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          onChange={handleFieldChange}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder="Tell me about your project, timeline, and goals…"
        />
      </div>

      {/* Status message */}
      <div aria-live="polite" className="min-h-[1.25rem]">
        {status === "success" && (
          <p className="text-sm text-emerald-400">
            Thanks for reaching out — I&apos;ll get back to you shortly.
          </p>
        )}

        {status === "error" && error && (
          <p className="text-sm text-rose-400">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/80 px-5 py-2 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
  
}
