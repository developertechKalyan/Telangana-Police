import type { ReactNode } from "react";

function hashHue(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

/** Generated gradient placeholder — we don't scrape real police-department photographs (brain.md §9). */
export function PlaceholderImage({
  seed,
  label,
  className = "",
  icon,
}: {
  seed: string;
  label?: string;
  className?: string;
  icon?: ReactNode;
}) {
  const hue = hashHue(seed);
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 55% 22%), hsl(${(hue + 40) % 360} 65% 38%))`,
      }}
    >
      {icon ? (
        <span className="text-3xl text-white/80">{icon}</span>
      ) : (
        label && (
          <span className="px-4 text-center text-sm font-medium text-white/85 line-clamp-3">{label}</span>
        )
      )}
    </div>
  );
}
