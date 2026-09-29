'use client';
// Last-resort error boundary — replaces <html> entirely, so it must be standalone.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#F7F5F1', color: '#17191E', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8B8680' }}>Kiln — something broke</p>
            <h1 style={{ fontSize: 34, fontWeight: 600, margin: '16px 0 8px' }}>That’s our fault, not yours.</h1>
            <p style={{ color: '#5C5952', lineHeight: 1.6 }}>
              An unexpected error occurred while rendering this page. Try again — if it keeps happening, email{' '}
              <a href="mailto:hello@kiln.studio" style={{ color: '#17191E' }}>hello@kiln.studio</a>.
            </p>
            {error.digest && <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8B8680', marginTop: 12 }}>ref: {error.digest}</p>}
            <button
              onClick={() => reset()}
              style={{ marginTop: 24, background: '#17191E', color: '#F7F5F1', border: 0, borderRadius: 999, padding: '12px 28px', fontSize: 14, cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
