import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Next Forge Pro – Freelance Web & App Designer",
  description:
    "Mobile-first app and responsive website design for startups and growing teams.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {/* Global techy gradient backdrop */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          {/* Vertical cyan glow */}
          <div className="absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-cyan-500/30 via-transparent to-transparent blur-3xl" />
          {/* Left magenta / cyan orb */}
          <div className="absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/30 to-cyan-500/20 blur-3xl" />
          {/* Right lime / cyan orb */}
          <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-lime-400/20 to-cyan-400/20 blur-3xl" />
          {/* Subtle noise layer (optional simple fallback) */}
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
