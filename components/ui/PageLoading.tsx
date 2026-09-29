// Neutral skeleton shown while a dynamic route streams in. No fake content.
export default function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="text-center">
        <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" aria-hidden />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-tech text-faint">{label}…</p>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}
