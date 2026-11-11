import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType } from "react-icons";
import { LuChevronDown } from "react-icons/lu";
import { useT } from "@/contexts/LanguageContext";
import type { LocalizedText } from "@/i18n/locales";

export type AccordionItem = {
  heading: LocalizedText;
  icon?: IconType;
  body: LocalizedText;
  extra?: LocalizedText[];
};

export function Accordion({ items, defaultOpenIndex = 0 }: { items: AccordionItem[]; defaultOpenIndex?: number }) {
  const t = useT();
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.heading.en}>
            <motion.button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left transition-colors duration-300 ${
                isOpen ? "bg-brand-600 text-white" : "bg-navy-900 text-white hover:bg-navy-800"
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon && (
                  <span
                    className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors duration-300 ${isOpen ? "bg-white/20" : "bg-white/10"}`}
                  >
                    <item.icon size={16} />
                  </span>
                )}
                <span className="font-display font-semibold">{t(item.heading)}</span>
              </span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-none">
                <LuChevronDown size={18} />
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-2xl bg-white p-6 shadow-sm dark:bg-navy-800">
                    <p className="leading-relaxed text-navy-600 dark:text-navy-300">{t(item.body)}</p>
                    {item.extra && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {item.extra.map((h) => (
                          <li key={h.en} className="rounded-lg bg-navy-50 px-3 py-2 text-sm text-navy-700 dark:bg-navy-900/40 dark:text-navy-200">
                            {t(h)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
