import { describe, expect, it } from "vitest";
import { destinations, stations } from "./content";
import { destinationProfiles } from "./destinationProfiles";
import { greenDestinationContent, greenHomeCard, greenStationContent } from "./greenContent";

describe("Green station content", () => {
  it("links only existing destination cards and uses their Vietnamese profiles", () => {
    const station = stations.find((item) => item.id === "green-tourism");
    expect(station?.destinationIds).toEqual(["ghenh-che", "nui-coc", "ho-ba-be", "khu-du-lich-sinh-thai-phuong-hoang", "sen-ho-eco-garden", "suoi-kem-homestay", "dat-ngao-quan-chu"]);
    for (const id of station?.destinationIds ?? []) {
      expect(destinations.some((destination) => destination.id === id)).toBe(true);
      if (id in greenDestinationContent) expect(destinationProfiles[id]).toEqual(greenDestinationContent[id as keyof typeof greenDestinationContent].vi.profile);
    }
  });

  it("has complete copy in three languages without public editorial warnings", () => {
    for (const locale of ["vi", "en", "ru"] as const) {
      expect(greenStationContent[locale].layers).toHaveLength(4);
      expect(greenHomeCard[locale].length).toBeGreaterThan(0);
      for (const destination of Object.values(greenDestinationContent)) {
        const content = destination[locale];
        expect(content.cardTitle.length).toBeGreaterThan(0);
        expect(content.profile.introduction.length).toBeGreaterThan(0);
        expect(content.profile.activities.length).toBeGreaterThan(0);
        expect(content.profile.locationAndConnections.length).toBeGreaterThan(0);
      }
      expect(JSON.stringify({ station: greenStationContent[locale], destinations: Object.values(greenDestinationContent).map((item) => item[locale]) }))
        .not.toMatch(/cần xác minh|chưa xác minh|needs verification|unverified|требует проверки|не проверен/i);
    }
  });
});
