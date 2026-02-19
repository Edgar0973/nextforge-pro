"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim() || undefined;
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim() || undefined;
    const projectType =
      String(formData.get("projectType") || "").trim() || undefined;
    const budget = String(formData.get("budget") || "").trim() || undefined;
    const timeline =
      String(formData.get("timeline") || "").trim() || undefined;
    const details = String(formData.get("details") || "").trim();

    if (!email || !details) {
      setStatus("error");
      setError("Please provide at least your email and project details.");
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          projectType,
          budget,
          timeline,
          details,
          sourcePage: "/quote",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(json?.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Quote form submit error:", err);
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-6 shadow-[0_0_24px_rgba(15,23,42,0.9)]"
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
          autoComplete="organization"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="projectType"
            className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
          >
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            defaultValue=""
          >
            <option value="" disabled>
              Select a project type
            </option>
            <option value="website">Marketing website</option>
            <option value="web-app">Web application</option>
            <option value="mobile-app">Mobile app</option>
            <option value="brand-and-site">Brand + website</option>
            <option value="other">Other / not sure yet</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="budget"
            className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
          >
            Budget range
          </label>
          <select
            id="budget"
            name="budget"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            defaultValue=""
          >
            <option value="" disabled>
              Select a range
            </option>
            <option value="<2k">Under $2k</option>
            <option value="2k-5k">$2k – $5k</option>
            <option value="5k-10k">$5k – $10k</option>
            <option value="10k+">$10k+</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="timeline"
            className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
          >
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            defaultValue=""
          >
            <option value="" disabled>
              Select timeline
            </option>
            <option value="asap">ASAP</option>
            <option value="1-3-months">1–3 months</option>
            <option value="3-6-months">3–6 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="details"
          className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
        >
          Project details<span className="text-cyan-400">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          required
          rows={6}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          placeholder="Describe what you’re building, key features, deadlines, and any links or references…"
        />
      </div>

      {status === "success" && (
        <p className="text-sm text-emerald-400">
          Thanks for the details — I&apos;ll review and follow up with a tailored
          quote.
        </p>
      )}

      {status === "error" && error && (
        <p className="text-sm text-rose-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/80 px-5 py-2 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.5)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Request quote"}
      </button>
    </form>
  );
}
