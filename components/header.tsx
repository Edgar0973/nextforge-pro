"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo / name */}
        <Link href="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 ring-1 ring-cyan-400/40">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-fuchsia-500/10 to-transparent" />
            <span className="relative h-3 w-3 rounded-sm bg-gradient-to-tr from-cyan-400 to-fuchsia-400 shadow-[0_0_16px_rgba(45,212,191,0.9)]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-slate-50">
              Next Forge Pro
            </p>
            <p className="text-xs text-slate-400">
              Edgardo Lopez · Web &amp; App Design
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-pill btn-pill-sm hover:text-slate-950"
            >
              {link.label}
            </Link>
          ))}

          {/* Single CTA → /quote */}
          <Link
            href="/quote"
            className="btn-pill hover:text-slate-950"
          >
            Get a quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="border-t border-slate-800 bg-slate-950/95 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="btn-pill btn-pill-sm hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA – full-width pill */}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="btn-pill mt-2 w-full justify-center hover:text-slate-950"
            >
              Get a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
