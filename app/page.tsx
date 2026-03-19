import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.20),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.12),transparent_25%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.10),transparent_25%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="NextForge Pro logo"
              width={260}
              height={110}
              className="h-auto w-44 sm:w-56 object-contain"
              priority
            />
          </div>

          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/45">
            NextForge Pro
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Greetings, and thank you
            <span className="block bg-gradient-to-r from-white via-white to-white/65 bg-clip-text text-transparent">
              for visiting NextForge Pro.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            We truly appreciate your visit and your interest in our work.
            Our website is currently being upgraded and will deploy soon.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            In the meantime, you may contact us directly at{" "}
            <a
              href="mailto:contact@nextforgepro.com"
              className="font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white/70"
            >
              contact@nextforgepro.com
            </a>
            .
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            My apologies, and thank you again for your interest.
          </p>

          <div className="mt-10 pt-6">
            <p className="text-sm uppercase tracking-[0.22em] text-white/40">
              CEO
            </p>
            <p className="mt-2 text-lg font-medium text-white/85">
              Edgardo S. Lopez
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}