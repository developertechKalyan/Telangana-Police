/**
 * Decorative, non-interactive SVG backdrops for hero/section containers. Each is absolutely
 * positioned (`inset-0`) and `pointer-events-none` — drop one inside a `relative overflow-hidden`
 * wrapper. Kept low-opacity/monochrome via `currentColor` so they read as texture, not noise,
 * and stay legible in both themes.
 */

export function DotGridPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full text-white/[0.07] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  );
}

/** Concentric radar rings + crosshair — a "monitoring station" motif for telecom/dispatch sections. */
export function RadarSweepPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-slate-500/[0.06] ${className}`}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="1" />
      <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Gentle stacked sine waves — signal/frequency motif, sits well along a section's bottom edge. */
export function SignalWavesPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 200"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full text-white/[0.05] ${className}`}
      aria-hidden="true"
    >
      <path d="M0 120 Q 100 60 200 120 T 400 120 T 600 120 T 800 120" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M0 150 Q 100 100 200 150 T 400 150 T 600 150 T 800 150" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M0 180 Q 100 140 200 180 T 400 180 T 600 180 T 800 180" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
