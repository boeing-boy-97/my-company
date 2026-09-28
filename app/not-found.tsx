import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="toplight relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 gridlines gridlines-fade" aria-hidden />
      <div className="relative py-32 text-center">
        <p className="font-mono text-[12px] uppercase tracking-tech text-accent">404 · Not found</p>
        <h1 className="display-tight mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] font-semibold leading-[1.05] text-ink">
          Looks like this page<br />went exploring.
        </h1>
        <p className="mx-auto mt-5 max-w-[420px] text-[16px] leading-relaxed text-soft">
          The address doesn’t match anything we know. It may have moved, or it may never have existed.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/work" variant="outline">See Our Work</Button>
        </div>
      </div>
    </main>
  );
}
