export const locales = ["vi", "en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
export const localeCookieName = "tn-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export const localeNames: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
  ru: "Русский",
};
