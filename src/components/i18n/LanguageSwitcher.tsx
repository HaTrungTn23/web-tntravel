"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { localeCookieName, localeNames, locales, type Locale } from "@/i18n/config";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, setLocale, t } = useLanguage();
  const change = (next: Locale) => {
    setLocale(next);
    document.cookie = `${localeCookieName}=${next};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = next;
    router.refresh();
  };
  return <label className="language-switcher" title={t("language.change")}>
    <Languages aria-hidden="true" />
    <span className="sr-only">{t("language.label")}</span>
    <select value={locale} onChange={(event) => change(event.target.value as Locale)} aria-label={t("language.change")}>
      {locales.map((item) => <option value={item} key={item}>{localeNames[item]}</option>)}
    </select>
  </label>;
}
