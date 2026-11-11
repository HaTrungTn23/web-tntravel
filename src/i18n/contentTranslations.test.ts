import { describe, expect, it } from "vitest";
import { destinationRepository } from "@/repositories";
import { getDestinationTranslation, hasDestinationTranslation, localizeDestination } from "./contentTranslations";

describe("destination translations", () => {
  it("covers every destination card in English and Russian", () => {
    for (const destination of destinationRepository.getAll()) {
      expect(hasDestinationTranslation(destination.id, "en"), `missing English: ${destination.id}`).toBe(true);
      expect(hasDestinationTranslation(destination.id, "ru"), `missing Russian: ${destination.id}`).toBe(true);
    }
  });

  it("returns localized card copy without mutating source data", () => {
    const source = destinationRepository.getById("tan-cuong")!;
    const localized = localizeDestination(source, "en");
    expect(localized.name).toBe("Tan Cuong");
    expect(localized.shortDescription).toContain("tea culture");
    expect(source.name).toBe("Tân Cương");
  });

  it("keeps Vietnamese source copy for the default locale", () => {
    const source = destinationRepository.getById("nui-coc")!;
    expect(getDestinationTranslation(source, "vi")).toEqual({ name: source.name, shortDescription: source.shortDescription });
  });
});
