import { destinations, experiences, journeys, languageContents, products, regions, stations } from "@/data/content";

export const destinationRepository = {
  getAll: () => destinations,
  getById: (id: string) => destinations.find((item) => item.id === id),
  getBySlug: (slug: string) => destinations.find((item) => item.slug === slug),
  getByIds: (ids: string[]) => ids.flatMap((id) => destinations.find((item) => item.id === id) ?? []),
};
export const journeyRepository = {
  getAll: () => journeys,
  getBySlug: (slug: string) => journeys.find((item) => item.slug === slug),
  getByDestination: (id: string) => journeys.filter((item) => item.destinationIds.includes(id)),
};
export const stationRepository = { getAll: () => stations, getBySlug: (slug: string) => stations.find((item) => item.slug === slug) };
export const regionRepository = { getAll: () => regions, getBySlug: (slug: string) => regions.find((item) => item.slug === slug) };
export const productRepository = { getAll: () => products, getBySlug: (slug: string) => products.find((item) => item.slug === slug), getByIds: (ids: string[]) => ids.flatMap((id) => products.find((item) => item.id === id) ?? []) };
export const experienceRepository = { getByIds: (ids: string[]) => ids.flatMap((id) => experiences.find((item) => item.id === id) ?? []) };
export const languageRepository = { getByDestination: (id: string) => languageContents.filter((item) => item.destinationId === id) };
