'use client';
import Button from '@/components/ui/Button';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="max-w-[520px] py-32 text-center">
        <p className="font-mono text-[12px] uppercase tracking-tech text-accent">500 · Something broke</p>
        <h1 className="display-tight mt-5 font-display text-[clamp(2rem,5vw,3.2rem)] font-semibold leading-[1.08] text-ink">
          That’s on us — not you.
        </h1>
        <p className="mt-5 text-[15.5px] leading-relaxed text-soft">
          An unexpected error occurred while rendering this page. Try again, or head back to the homepage.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={reset} arrow={false}>
            Try Again
          </Button>
          <Button href="/" variant="outline">Back to Home</Button>
        </div>
        {error.digest && <p className="mt-6 font-mono text-[11px] text-faint">reference: {error.digest}</p>}
      </div>
    </main>
  );
}
