import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALE_MAP, type Locale } from "@/i18n/locales";
import { LanguageContext, STORAGE_KEY, loadScriptFont, readStoredLocale } from "@/contexts/LanguageContext";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);
  const dir = LOCALE_MAP[locale].dir;

  useEffect(() => {
    loadScriptFont(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(() => ({ locale, setLocale, dir }), [locale, dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
