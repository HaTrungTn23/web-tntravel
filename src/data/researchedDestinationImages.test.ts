import { describe, expect, it } from "vitest";
import { destinations } from "@/data/content";

const researchedDestinationIds = [
  "la-bang", "vo-tranh", "ghenh-che", "ban-ten", "bao-tang-dan-toc",
  "dai-doi-915", "khuon-tat", "nha-tuong-niem-atk", "hang-phuong-hoang",
  "suoi-mo-ga", "ho-ba-be", "den-an-ma", "bo-dau", "khuan-bang",
  "suoi-kem", "xom-mo-ga", "pac-ngoi", "lan-tin-keo",
];

describe("researched destination images", () => {
  it.each(researchedDestinationIds)("provides at least seven attributed, distinct images for %s", (id) => {
    const destination = destinations.find((item) => item.id === id);
    expect(destination).toBeDefined();
    const images = destination!.media.filter((item) => item.type === "image");
    expect(images.length).toBeGreaterThanOrEqual(7);
    expect(new Set(images.map((item) => item.url)).size).toBe(images.length);
    expect(new Set(images.map((item) => item.id)).size).toBe(images.length);
    expect(images.every((item) => Boolean(item.sourceUrl && item.caption))).toBe(true);
    expect(images[0].isCover).toBe(true);
    expect(images.some((item) => item.url.includes("images.unsplash.com"))).toBe(false);
  });
});
