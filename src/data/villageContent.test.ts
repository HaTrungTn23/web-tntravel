import { describe, expect, it } from "vitest";
import { destinations, stations } from "./content";
import { destinationProfiles } from "./destinationProfiles";
import { villageContent } from "./villageContent";

const ids = ["ban-ten", "khuan-bang", "thai-hai", "xom-mo-ga"] as const;
const publicFields = ["cardTitle", "cardDescription", "tagline", "introduction", "reasons", "highlights", "activities", "localCulture", "bestTime", "audience", "locationAndConnections"] as const;

describe("Village destination content", () => {
  it("has matching destinations, profiles and village-station links", () => {
    const village = stations.find((station) => station.id === "village");
    for (const id of ids) {
      expect(destinations.find((destination) => destination.id === id)).toBeDefined();
      expect(destinationProfiles[id]).toEqual(villageContent[id].vi.profile);
      expect(village?.destinationIds).toContain(id);
    }
    expect(destinations.find((destination) => destination.id === "khuan-bang")?.location).toBeUndefined();
  });

  it("has complete Vietnamese, English and Russian copy without editorial warnings", () => {
    for (const id of ids) {
      for (const locale of ["vi", "en", "ru"] as const) {
        const content = villageContent[id][locale];
        for (const field of publicFields) {
          const value = field in content.profile ? content.profile[field as keyof typeof content.profile] : content[field as "cardTitle" | "cardDescription"];
          expect(value).toBeTruthy();
          if (Array.isArray(value)) expect(value.length).toBeGreaterThan(0);
          const text = Array.isArray(value) ? value.join(" ") : value;
          expect(text).not.toMatch(/cần xác minh|chưa xác minh|nguồn cần|needs verification|unverified|требует проверки|не проверен/i);
        }
      }
    }
  });
});
