import { describe, expect, it } from "vitest";
import { destinations, regions, stations } from "./content";
import { destinationProfiles } from "./destinationProfiles";
import { teaDestinationContent, teaHomeCard, teaStationContent, tanCuongRegionContent } from "./teaContent";

describe("Tea culture source content", () => {
  it("connects the existing tea destinations and Tan Cuong region", () => {
    expect(stations.find((item) => item.id === "tea-culture")?.destinationIds).toEqual(["tan-cuong", "hao-dat", "khong-gian-tra", "la-bang", "vo-tranh", "tien-yen-farmstay"]);
    expect(regions.find((item) => item.id === "tan-cuong-region")?.destinationIds).toEqual(["tan-cuong", "hao-dat", "khong-gian-tra"]);
    for (const id of ["tan-cuong", "khong-gian-tra"] as const) {
      expect(destinations.some((item) => item.id === id)).toBe(true);
      expect(destinationProfiles[id]).toEqual(teaDestinationContent[id].vi.profile);
    }
    expect(destinations.some((item) => item.id === "tien-yen-farmstay")).toBe(true);
  });

  it("offers complete Vietnamese, English and Russian editorial copy", () => {
    for (const locale of ["vi", "en", "ru"] as const) {
      expect(teaStationContent[locale].layers).toHaveLength(4);
      expect(teaStationContent[locale].process).toHaveLength(5);
      expect(teaStationContent[locale].regions).toHaveLength(3);
      expect(tanCuongRegionContent[locale].layers).toHaveLength(3);
      expect(tanCuongRegionContent[locale].seasons).toHaveLength(4);
      expect(teaHomeCard[locale].length).toBeGreaterThan(0);
      for (const destination of Object.values(teaDestinationContent)) {
        expect(destination[locale].profile.introduction.length).toBeGreaterThan(0);
        expect(destination[locale].profile.activities.length).toBeGreaterThan(0);
      }
      expect(JSON.stringify({ station: teaStationContent[locale], region: tanCuongRegionContent[locale], destinations: Object.values(teaDestinationContent).map((item) => item[locale]) }))
        .not.toMatch(/cần xác minh|chưa xác minh|needs verification|unverified|требует проверки|не проверен/i);
    }
  });
});
