import { MessageCircleHeart } from "lucide-react";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
export default async function SurveyPage() { const locale = await getServerLocale(); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key); return <div className="survey-page page-wrap"><header className="page-intro centered"><div className="eyebrow"><MessageCircleHeart /> {t("survey.kicker")}</div><h1>{t("survey.titleA")}<br /><em>{t("survey.titleB")}</em></h1><p>{t("survey.body")}</p></header><SurveyForm /></div>; }
