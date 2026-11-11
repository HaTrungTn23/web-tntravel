import { Route } from "lucide-react";
import { MyJourneyClient } from "@/components/journey/MyJourneyClient";
import { destinationRepository } from "@/repositories";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
export default async function MyJourneyPage() { const locale = await getServerLocale(); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key); return <div className="page-wrap my-journey-page"><header className="page-intro"><div className="eyebrow"><Route /> {t("my.kicker")}</div><h1>{t("my.titleA")}<br /><em>{t("my.titleB")}</em></h1><p>{t("my.body")}</p></header><MyJourneyClient destinations={destinationRepository.getAll()} /></div>; }
