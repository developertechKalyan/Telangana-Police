import { motion } from "framer-motion";
import { useT } from "@/contexts/LanguageContext";
import type { JourneyStep } from "@/types/content";

export function Timeline({ steps }: { steps: JourneyStep[] }) {
  const t = useT();

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-navy-200 sm:top-5 sm:right-0 sm:bottom-auto sm:left-0 sm:h-0.5 sm:w-auto dark:bg-navy-700" />
      <div className="relative flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="relative flex gap-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-3 sm:text-center"
          >
            <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-600 font-mono text-sm font-bold text-white shadow-md">
              {s.step}
            </span>
            <div className="sm:mt-1">
              <h3 className="font-display font-semibold text-navy-900 dark:text-navy-50">{t(s.title)}</h3>
              <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{t(s.body)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
