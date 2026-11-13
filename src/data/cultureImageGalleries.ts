import rawGalleries from "./cultureImageGalleries.json";

export const cultureImageGalleries = rawGalleries as Record<string, string[]>;

export function getCultureImages(id: string) {
  return cultureImageGalleries[id] ?? [];
}

export function getCultureImage(id: string, index = 0) {
  const images = getCultureImages(id);
  return images[index] ?? images[0];
}
