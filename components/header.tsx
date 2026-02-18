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
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-sky-500/20 ring-1 ring-sky-500/40" />
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-sky-300">
              Edgardo Lopez
            </p>
            <p className="text-xs text-slate-400">Web & App Designer</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-sky-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Single pill CTA → /quote */}
          <Link
            href="/quote"
            className="rounded-full border border-sky-500 bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400"
          >
            Get a quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
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
        <nav className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}

            {/* Single CTA on mobile as well */}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400"
            >
              Get a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
