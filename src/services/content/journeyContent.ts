import type { Destination, Journey } from "@/domain/models";

export function resolveJourneyCover(journey: Journey, destinations: Destination[]) {
  const byId = new Map(destinations.map((destination) => [destination.id, destination]));
  const orderedIds = [
    ...journey.days.flatMap((day) => day.items.flatMap((item) => item.destinationId ? [item.destinationId] : [])),
    ...journey.destinationIds,
  ];
  for (const destinationId of [...new Set(orderedIds)]) {
    const media = byId.get(destinationId)?.media;
    const cover = media?.find((item) => item.type === "image" && item.isCover)
      ?? media?.find((item) => item.type === "image");
    if (cover?.url) return cover.url;
  }
  return journey.image;
}

export function applyPublishedJourneyCover(journey: Journey, destinations: Destination[]): Journey {
  return { ...journey, image: resolveJourneyCover(journey, destinations) };
}
