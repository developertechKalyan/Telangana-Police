import { useEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuLanguages } from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { LOCALES, SELECTABLE_LOCALES } from "@/i18n/locales";

export function LanguageSwitcher({ dark = true }: { dark?: boolean }) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = LOCALES.find((l) => l.code === locale)!;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toneClasses = dark
    ? "text-white hover:text-white hover:bg-white/10"
    : "text-navy-600 hover:text-navy-900 hover:bg-navy-100 dark:text-white dark:hover:bg-white/10";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium transition-colors ${toneClasses}`}
      >
        <LuLanguages size={16} />
        <span className="hidden sm:inline">{active.nativeName}</span>
        <LuChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-navy-100 bg-white py-1.5 shadow-xl dark:border-navy-700 dark:bg-navy-800"
          >
            {SELECTABLE_LOCALES.map((l) => (
              <button
                key={l.code}
                role="option"
                aria-selected={l.code === locale}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-navy-700 transition-colors hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-700"
              >
                <span>
                  {l.nativeName}
                  {l.code !== "en" && <span className="ml-1.5 text-xs text-navy-400 dark:text-navy-500">{l.englishName}</span>}
                </span>
                {l.code === locale && <LuCheck size={15} className="text-brand-600 dark:text-brand-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
