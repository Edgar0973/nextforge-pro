import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 text-sm text-slate-400 md:px-6">
        {/* Top: Contact + Social & platforms + Marketplaces */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Contact / phone + multiple emails + Terms/Policy */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
              Contact
            </p>

            <div className="space-y-1 text-sm text-slate-300">
              <p>
                General:&nbsp;
                <a
                  href="mailto:contact@nextforgepro.com"
                  className="hover:text-sky-300"
                >
                  contact@nextforgepro.com
                </a>
              </p>
              <p>
                Billing:&nbsp;
                <a
                  href="mailto:billing@nextforgepro.com"
                  className="hover:text-sky-300"
                >
                  billing@nextforgepro.com
                </a>
              </p>
              <p>
                Support:&nbsp;
                <a
                  href="mailto:support@nextforgepro.com"
                  className="hover:text-sky-300"
                >
                  support@nextforgepro.com
                </a>
              </p>
              <p>
                Quotes:&nbsp;
                <a
                  href="mailto:quotes@nextforgepro.com"
                  className="hover:text-sky-300"
                >
                  quotes@nextforgepro.com
                </a>
              </p>
            </div>

            <p className="text-sm text-slate-300">
              Phone:&nbsp;
              <a href="tel:+1-555-555-5555" className="hover:text-sky-300">
                +1 (555) 555-5555
              </a>
            </p>

            {/* Terms + Policy grouped with contact block */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <Link href="/terms" className="hover:text-sky-300">
                Terms
              </Link>
              <span className="text-slate-600">•</span>
              <Link href="/policy" className="hover:text-sky-300">
                Policy
              </Link>
            </div>
          </div>

          {/* Social / platforms */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
              Social &amp; platforms
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                LinkedIn
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                YouTube
              </a>
              <a
                href="https://www.reddit.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                Reddit
              </a>
              <a
                href="https://wa.me/15555555555"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Marketplaces: Thumbtack, Instajob, Upwork */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
              Marketplaces
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="https://www.thumbtack.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                Thumbtack
              </a>
              <a
                href="https://www.instajob.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                Instajob
              </a>
              <a
                href="https://www.upwork.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-sky-300"
              >
                Upwork
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800" />

        {/* Centered payment methods */}
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-sky-400">
            Payment methods
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-200">
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              Visa
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              MasterCard
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              AmEx
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              PayPal
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              Zelle
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
              Bitcoin
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-800" />

        {/* Bottom: centered copyright */}
        <p className="text-center text-xs md:text-sm text-slate-500">
          © {year} Next Forge Pro LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
