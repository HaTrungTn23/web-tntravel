import { describe, expect, it } from "vitest";
import { destinations, stations } from "./content";
import { destinationProfiles } from "./destinationProfiles";
import { filesDestinations, filesDestinationContent } from "./filesDestinations";
import { getDestinationTranslation } from "@/i18n/contentTranslations";
import { combineDemoAndRealRatings } from "@/services/ratings/demoRating";

describe("destination files", () => {
  it("adds eight distinct destinations with complete three-language content", () => {
    expect(filesDestinations).toHaveLength(8);
    expect(destinations).toHaveLength(31);
    expect(new Set(destinations.map((item) => item.id)).size).toBe(destinations.length);
    expect(new Set(destinations.map((item) => item.slug)).size).toBe(destinations.length);
    for (const destination of filesDestinations) {
      expect(destinationProfiles[destination.id]).toEqual(filesDestinationContent[destination.id].vi.profile);
      const images = destination.media.filter((item) => item.type === "image");
      expect(images).toHaveLength(7);
      expect(new Set(images.map((item) => item.url)).size).toBe(7);
      expect(images[0].isCover).toBe(true);
      expect(images.every((item) => item.sourceUrl?.startsWith("https://") && item.url.startsWith("https://"))).toBe(true);
      for (const locale of ["vi", "en", "ru"] as const) {
        const localized = filesDestinationContent[destination.id][locale];
        expect(localized.title).toBeTruthy();
        expect(localized.profile.introduction.length).toBeGreaterThan(0);
        expect(localized.profile.activities.length).toBeGreaterThan(0);
        expect(getDestinationTranslation(destination, locale).name).toBe(localized.title);
      }
      for (const stationId of destination.stationIds) {
        expect(stations.find((item) => item.id === stationId)?.destinationIds).toContain(destination.id);
      }
    }
  });

  it("gives every new card a stable simulated baseline and adds real votes on top", () => {
    for (const destination of filesDestinations) {
      const initial = combineDemoAndRealRatings(destination.id, { count: 0, average: 0 });
      const withVote = combineDemoAndRealRatings(destination.id, { count: 1, average: 5 });
      expect(initial.average).toBeGreaterThanOrEqual(4);
      expect(initial.average).toBeLessThanOrEqual(5);
      expect(initial.count).toBeGreaterThan(0);
      expect(withVote.count).toBe(initial.count + 1);
      expect(combineDemoAndRealRatings(destination.id, { count: 0, average: 0 })).toEqual(initial);
    }
  });
});
