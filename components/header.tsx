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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Futuristic logo chip */}
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 ring-1 ring-cyan-400/40">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-fuchsia-500/10 to-transparent" />
            <span className="relative h-3 w-3 rounded-sm bg-gradient-to-tr from-cyan-400 to-fuchsia-400 shadow-[0_0_16px_rgba(45,212,191,0.9)]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-slate-50">
              Next Forge Pro
            </p>
            <p className="text-xs text-slate-400">
              Edgardo Lopez · Web & App Design
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-400"
          >
            Get a quote
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 p-2 text-slate-200 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-[3px]">
            <span className="h-[2px] w-4 rounded-full bg-slate-200" />
            <span className="h-[2px] w-4 rounded-full bg-slate-400" />
          </div>
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="border-t border-slate-800 bg-slate-950/95 px-4 pb-4 pt-3 md:hidden">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1.5 text-slate-200 hover:bg-slate-900 hover:text-cyan-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
            >
              Get a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
