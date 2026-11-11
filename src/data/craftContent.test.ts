import { describe, expect, it } from "vitest";
import { destinations, products, stations } from "./content";
import { craftDestinationContent, craftProductContent, craftStationContent } from "./craftContent";
import { destinationProfiles } from "./destinationProfiles";

describe("Craft station content", () => {
  it("links only existing destination and product records", () => {
    const station = stations.find((item) => item.id === "craft-products");
    expect(station?.destinationIds).toEqual(["bo-dau", "hao-dat"]);
    for (const id of station?.destinationIds ?? []) {
      expect(destinations.some((destination) => destination.id === id)).toBe(true);
      expect(destinationProfiles[id]).toEqual(craftDestinationContent[id as keyof typeof craftDestinationContent].vi.profile);
    }
    expect(products.some((product) => product.id === "tan-cuong-tea")).toBe(true);
  });

  it("provides complete copy in three languages without editorial warnings", () => {
    for (const locale of ["vi", "en", "ru"] as const) {
      const text = JSON.stringify({ station: craftStationContent[locale], product: craftProductContent[locale], destinations: Object.values(craftDestinationContent).map((item) => item[locale]) });
      expect(text).not.toMatch(/cần xác minh|chưa xác minh|needs verification|unverified|требует проверки|не проверен/i);
      expect(craftStationContent[locale].layers).toHaveLength(4);
      expect(craftProductContent[locale].story.length).toBeGreaterThan(0);
      for (const destination of Object.values(craftDestinationContent)) {
        expect(destination[locale].profile.introduction.length).toBeGreaterThan(0);
        expect(destination[locale].profile.activities.length).toBeGreaterThan(0);
      }
    }
  });
});
