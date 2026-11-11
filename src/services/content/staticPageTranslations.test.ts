import { describe, expect, it } from "vitest";
import { journeyRepository } from "@/repositories";
import { localizeJourney } from "./staticPageTranslations";

describe("journey translation", () => {
  it("replaces display text while preserving route IDs and schedule structure", () => {
    const journey = journeyRepository.getAll().find((item) => item.days.some((day) => day.items.some((step) => step.note)))!;
    const payload = {
      name: "Translated journey",
      summary: "Translated summary",
      days: journey.days.map((day) => ({ items: day.items.map(() => ({ title: "Translated stop", note: "Translated note" })) })),
    };
    const translated = localizeJourney(journey, payload);
    expect(translated.name).toBe("Translated journey");
    expect(translated.days.flatMap((day) => day.items).find((step) => step.note)?.note).toBe("Translated note");
    expect(translated.days.map((day) => day.items.map((item) => item.destinationId)))
      .toEqual(journey.days.map((day) => day.items.map((item) => item.destinationId)));
    expect(translated.slug).toBe(journey.slug);
  });
});
