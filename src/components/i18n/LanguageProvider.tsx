"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { translate, type MessageKey } from "@/i18n/messages";

type Translator = (key: MessageKey, values?: Record<string, string | number>) => string;
const LanguageContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: Translator }>({
  locale: "vi",
  setLocale: () => undefined,
  t: (key, values) => translate("vi", key, values),
});

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocale] = useState(initialLocale);
  const value = useMemo(() => ({ locale, setLocale, t: (key: MessageKey, values?: Record<string, string | number>) => translate(locale, key, values) }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
