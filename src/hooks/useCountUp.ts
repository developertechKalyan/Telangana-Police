import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

export function useCountUp(target: number, options?: { duration?: number; decimals?: number; noGrouping?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const duration = options?.duration ?? 1.8;
  const decimals = options?.decimals ?? 0;
  const noGrouping = options?.noGrouping ?? false;

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [isInView, target, duration, prefersReducedMotion]);

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : noGrouping
        ? String(Math.round(value))
        : Math.round(value).toLocaleString("en-IN");

  return { ref, formatted };
}
