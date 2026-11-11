import type { Metadata } from "next";
import { FestivalPageContent } from "@/components/festival/FestivalPageContent";
import { destinationRepository } from "@/repositories";
import { getDestinationsWithPublishedMedia } from "@/services/content/destinationContent";
import { getServerLocale } from "@/i18n/server";
import { festivalCopy, festivalCurrentDay, festivalState } from "@/data/festival2026";
import { getPublishedFestivalContent } from "@/services/content/festivalContent";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const copy = festivalCopy[locale];
  return { title: copy.title, description: copy.intro };
}

export default async function FestivalPage() {
  const locale = await getServerLocale();
  const [destinations, festival] = await Promise.all([getDestinationsWithPublishedMedia(destinationRepository.getAll(), locale), getPublishedFestivalContent()]);
  const relatedDestinations = destinations.filter((destination) => ["tan-cuong", "khong-gian-tra", "la-bang", "vo-tranh", "nui-coc"].includes(destination.id));
  return <FestivalPageContent initialDay={festivalCurrentDay()} status={festivalState()} destinations={relatedDestinations} content={festival.content} />;
}
