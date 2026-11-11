import { describe, expect, it } from "vitest";
import type { Destination, Journey } from "@/domain/models";
import { resolveJourneyCover } from "./journeyContent";

const journey = {
  id: "route", slug: "route", name: "Route", summary: "", duration: "1-day",
  interests: [], audiences: [], seasons: [], days: [{ day: 1, items: [{ destinationId: "first" }] }],
  destinationIds: ["first", "second"], image: "/old-cover.jpg", priority: 1, dataStatus: "demo",
} satisfies Journey;

function destination(id: string, media: Destination["media"]): Destination {
  return {
    id, slug: id, name: id, stationIds: [], interestTags: [], suitableFor: [], seasons: [],
    shortDescription: "", media, experienceIds: [], productIds: [], relatedDestinationIds: [], dataStatus: "demo",
  };
}

describe("journey published cover", () => {
  it("uses the published cover of the first scheduled destination", () => {
    const destinations = [
      destination("first", [
        { id: "gallery", type: "image", url: "/gallery.jpg", alt: "" },
        { id: "cover", type: "image", url: "/new-cover.jpg", alt: "", isCover: true },
      ]),
      destination("second", [{ id: "second", type: "image", url: "/second.jpg", alt: "", isCover: true }]),
    ];
    expect(resolveJourneyCover(journey, destinations)).toBe("/new-cover.jpg");
  });

  it("skips destinations without an image and keeps the static image as final fallback", () => {
    expect(resolveJourneyCover(journey, [destination("first", [{ id: "video", type: "youtube", url: "https://youtu.be/demo", alt: "" }])]))
      .toBe("/old-cover.jpg");
  });
});
