import { describe, expect, it } from "vitest";
import { destinations, stations } from "./content";
import { destinationProfiles } from "./destinationProfiles";
import { historyDestinationContent, historyHomeCard, historyStationContent } from "./historyContent";

describe("History and festival station content", () => {
  it("uses existing mapped cards and the edited Company 915 profile", () => {
    const station = stations.find((item) => item.id === "history-festival");
    expect(station?.destinationIds).toEqual(["dai-doi-915", "lan-tin-keo", "nha-tuong-niem-atk", "khuon-tat", "chua-hang-kim-son-tu", "khu-khao-co-than-sa", "den-duom"]);
    for (const id of station?.destinationIds ?? []) {
      expect(destinations.some((destination) => destination.id === id)).toBe(true);
    }
    expect(destinationProfiles["dai-doi-915"]).toEqual(historyDestinationContent["dai-doi-915"].vi.profile);
  });

  it("has three-language station and destination copy without fixed festival dates or editorial warnings", () => {
    for (const locale of ["vi", "en", "ru"] as const) {
      const station = historyStationContent[locale];
      expect(station.layers).toHaveLength(4);
      expect(station.spaces).toHaveLength(3);
      expect(station.festivals).toHaveLength(5);
      expect(station.activities).toHaveLength(6);
      expect(historyHomeCard[locale].length).toBeGreaterThan(0);
      const destination = historyDestinationContent["dai-doi-915"][locale];
      expect(destination.profile.introduction.length).toBeGreaterThan(0);
      expect(destination.profile.activities.length).toBeGreaterThan(0);
      expect(JSON.stringify({ station, destination })).not.toMatch(/cần xác minh|chưa xác minh|needs verification|unverified|требует проверки|не проверен/i);
      expect(JSON.stringify(station.festivals)).not.toMatch(/20\d\d|\d{1,2}\/\d{1,2}/);
    }
  });
});
