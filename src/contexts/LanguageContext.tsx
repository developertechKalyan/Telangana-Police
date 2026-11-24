import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, LOCALE_MAP, type Locale, type LocalizedText } from "@/i18n/locales";

export const STORAGE_KEY = "mppolice-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: "ltr" | "rtl";
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

// Script fonts are loaded only when their language is chosen; index.html loads just the Latin fonts.
const SCRIPT_FONTS: Partial<Record<Locale, string>> = {
  hi: "Noto+Sans+Devanagari",
  te: "Noto+Sans+Telugu",
  gu: "Noto+Sans+Gujarati",
  ur: "Noto+Nastaliq+Urdu",
  sd: "Noto+Sans+Arabic",
};

export function loadScriptFont(locale: Locale) {
  const family = SCRIPT_FONTS[locale];
  if (!family || typeof document === "undefined") return;
  const id = `font-${locale}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && stored in LOCALE_MAP ? (stored as Locale) : DEFAULT_LOCALE;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Resolves any LocalizedText to the active locale's string. */
export function useT() {
  const { locale } = useLanguage();
  return (text: LocalizedText) => text[locale] ?? text[DEFAULT_LOCALE];
}
