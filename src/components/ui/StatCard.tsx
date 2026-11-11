import type { ReactNode } from "react";
import { useCountUp } from "@/hooks/useCountUp";

export function StatCard({
  value,
  suffix = "",
  label,
  icon,
  decimals = 0,
  className = "",
}: {
  value: number;
  suffix?: string;
  label: string;
  icon?: ReactNode;
  decimals?: number;
  className?: string;
}) {
  const { ref, formatted } = useCountUp(value, { decimals });

  return (
    <div className={`rounded-2xl border border-navy-800/10 bg-white p-6 shadow-sm dark:border-navy-700 dark:bg-navy-800 ${className}`}>
      {icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white dark:bg-brand-500">
          {icon}
        </div>
      )}
      <div className="font-mono text-3xl font-bold tabular-nums text-navy-900 dark:text-navy-50 sm:text-4xl">
        <span ref={ref}>{formatted}</span>
        {suffix}
      </div>
      <p className="mt-1 text-sm text-black dark:text-navy-400">{label}</p>
    </div>
  );
}
