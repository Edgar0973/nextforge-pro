export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/60">
          NextForge Pro
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
          We’re building something beautiful.
        </h1>
        <p className="mt-6 text-base md:text-lg text-white/70 leading-8">
          The site is currently under development and will deploy soon.
          Thank you for your patience.
        </p>
      </div>
    </main>
  );
}