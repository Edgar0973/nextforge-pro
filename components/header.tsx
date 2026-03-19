"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" },
  { href: "/billing", label: "Billing" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/NFP_DRAMATIC.png"
            alt="Next Forge Pro logo"
            width={140}
            height={56}
            priority
            className="h-auto w-[90px] md:w-[110px]"
          />

          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold tracking-wide text-slate-50">
              Next Forge Pro
            </p>
            <p className="text-xs text-slate-400">
              Edgardo Lopez · Web &amp; App Design
            </p>
          </div>
        </Link>

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

          <Link href="/quote" className="btn-pill hover:text-slate-950">
            Get a quote
          </Link>
        </nav>

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