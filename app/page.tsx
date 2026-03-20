import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] bg-neutral-950 text-white sm:min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.16),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.08),transparent_24%),radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.06),transparent_24%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <section className="mx-auto flex min-h-[100dvh] w-full max-w-3xl items-start justify-center px-4 pt-6 pb-[calc(env(safe-area-inset-bottom)+6rem)] sm:min-h-screen sm:items-center sm:px-6 sm:py-12 lg:px-8">
        <div className="w-full rounded-[22px] border border-white/10 bg-white/[0.035] p-5 text-center shadow-2xl backdrop-blur-xl sm:rounded-[26px] sm:p-8 lg:p-10">
          <div className="mb-5 flex justify-center sm:mb-6">
            <Image
              src="/logo.png"
              alt="NextForge Pro logo"
              width={260}
              height={110}
              className="h-auto w-28 object-contain sm:w-36 lg:w-44"
              priority
            />
          </div>

          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-white/45 sm:text-[11px] sm:tracking-[0.3em]">
            NextForge Pro
          </p>

          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Greetings, and thank you
            <span className="block bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              for visiting NextForge Pro.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 sm:mt-5 sm:text-[15px] sm:leading-7 lg:text-base">
            We truly appreciate your visit and your interest in our work. Our
            website is currently being upgraded and will deploy soon.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/70 sm:mt-4 sm:text-[15px] sm:leading-7 lg:text-base">
            In the meantime, you may contact us directly at{" "}
            <a
              href="mailto:contact@nextforgepro.com"
              className="font-medium text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white/70"
            >
              contact@nextforgepro.com
            </a>
            .
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60 sm:mt-4 sm:text-[15px] sm:leading-7 lg:text-base">
            My apologies, and thank you again for your interest.
          </p>

          <div className="mt-7 border-t border-white/8 pt-5 sm:mt-8 sm:pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
              CEO
            </p>
            <p className="mt-2 text-sm font-medium text-white/85 sm:text-base">
              Edgardo S. Lopez
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}