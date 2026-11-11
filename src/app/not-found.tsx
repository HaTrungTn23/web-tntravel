import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";
import { getServerLocale } from "@/i18n/server";
import { translate } from "@/i18n/messages";
export default async function NotFound() { const locale = await getServerLocale(); const t = (key: Parameters<typeof translate>[1]) => translate(locale, key); return <div className="empty-state large not-found"><MapPinOff /><h1>{t("notFound.title")}</h1><p>{t("notFound.body")}</p><Link href="/" className="button button-primary"><ArrowLeft /> {t("notFound.home")}</Link></div>; }
