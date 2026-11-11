"use client";

import { Check, Plus } from "lucide-react";
import { analyticsService } from "@/services/analytics/analytics";
import { useMyJourney } from "./JourneyProvider";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function AddToJourneyButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { t } = useLanguage();
  const { add, contains } = useMyJourney();
  const added = contains(id);
  return <button className={compact ? "button button-small button-ghost" : "button button-secondary"} disabled={added} onClick={() => { add(id); analyticsService.track("add_to_my_journey", { destinationId: id }); }}>
    {added ? <Check size={17} /> : <Plus size={17} />} {added ? t("journey.added") : t("journey.add")}
  </button>;
}
