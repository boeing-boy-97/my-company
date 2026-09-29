'use client';

/**
 * HoverSwap — the classic agency link microinteraction, kept precise:
 * the label slides up and its clone returns from below, one gesture,
 * 320ms, no bounce. The clone is aria-hidden so screen readers announce
 * the link once. Reduced motion: pure CSS fallback to a color change.
 * Used on nav, footer and arrow links — deliberately not everywhere.
 */
export default function HoverSwap({ label }: { label: string }) {
  return (
    <span className="kiln-swap">
      <span className="kiln-swap-l kiln-swap-a">{label}</span>
      <span className="kiln-swap-l kiln-swap-b" aria-hidden>
        {label}
      </span>
    </span>
  );
}
