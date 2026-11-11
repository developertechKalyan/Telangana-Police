export type Locale = "en" | "hi" | "te" | "gu" | "ur" | "sd";

export interface LocaleMeta {
  code: Locale;
  englishName: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: LocaleMeta[] = [
  { code: "en", englishName: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", dir: "ltr" },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", dir: "rtl" },
  { code: "sd", englishName: "Sindhi", nativeName: "سنڌي", dir: "rtl" },
];

export const LOCALE_MAP: Record<Locale, LocaleMeta> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l]),
) as Record<Locale, LocaleMeta>;

/** Languages offered in the header's language switcher. Other locales in LOCALES still have
 * full translation data — this just limits what's selectable for now. */
export const SELECTABLE_LOCALES: LocaleMeta[] = LOCALES.filter((l) => l.code === "en" || l.code === "hi" || l.code === "te");

/** Every user-facing string in the app is a full translation set, not a lookup key — this
 * makes a missing language a TypeScript error instead of a silent runtime fallback. */
export type LocalizedText = Record<Locale, string>;
