import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, PackageOpen, Route } from "lucide-react";
import { JourneyProvider } from "@/components/journey/JourneyProvider";
import { TravelChatbot } from "@/components/chat/TravelChatbot";
import { LanguageProvider } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AuthNav } from "@/components/auth/AuthNav";
import { ExploreNavDropdown } from "@/components/navigation/ExploreNavDropdown";
import { translate } from "@/i18n/messages";
import { getServerLocale } from "@/i18n/server";
import { getCurrentUser } from "@/services/auth/session";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const copy = {
    vi: { title: "Thái Nguyên trong tầm tay", description: "Khám phá Thái Nguyên qua hành trình, bản đồ và những câu chuyện địa phương." },
    en: { title: "Thai Nguyen in your hands", description: "Explore Thai Nguyen through journeys, maps and local stories." },
    ru: { title: "Тхайнгуен в ваших руках", description: "Исследуйте Тхайнгуен через маршруты, карты и местные истории." },
  }[locale];
  return { title: { default: copy.title, template: `%s | ${copy.title}` }, description: copy.description };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, user] = await Promise.all([getServerLocale(), getCurrentUser()]);
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <LanguageProvider initialLocale={locale}>
        <a className="skip-link" href="#main-content">{t("skip.content")}</a>
        <JourneyProvider>
          <header className="site-header">
            <Link href="/" className="brand" aria-label={t("brand.home")}>
              <span className="brand-mark"><Leaf size={21} /></span>
              <span><b>{t("brand.name")}</b><small>{t("brand.suffix")}</small></span>
            </Link>
            <nav aria-label={t("nav.label")}>
              <Link href="/#journey-selector">{t("nav.plan")}</Link>
              <ExploreNavDropdown />
              <Link href="/tea-brands"><PackageOpen size={16} /> {t("nav.teaBrands")}</Link>
              <Link href="/my-journey"><Route size={16} /> {t("nav.mine")}</Link>
            </nav>
            <div className="header-account-actions">
              <LanguageSwitcher />
              <AuthNav email={user?.email ?? null} locale={locale} />
            </div>
          </header>
          <main id="main-content">{children}</main>
          <footer className="site-footer">
            <div><Leaf size={22} /><b>{t("brand.name")} {t("brand.suffix")}</b></div>
            <div className="footer-links"><Link href="/explore">{t("footer.map")}</Link><Link href="/survey">{t("footer.feedback")}</Link><Link href="/impact">{t("footer.impact")}</Link></div>
          </footer>
          <TravelChatbot />
        </JourneyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
