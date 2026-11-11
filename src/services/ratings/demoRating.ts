// Stable display values for destinations without real votes.
// Generates a deterministic rating between 4.0 and 5.0 based on destination id.
export function getDemoDestinationRating(destinationId: string): number {
  const seed = Array.from(destinationId).reduce(
    (sum, character, index) => sum + character.charCodeAt(0) * (index + 1),
    0,
  );
  return 4 + (seed % 11) / 10;
}

// Generates a deterministic simulated review count (15–280) based on destination id.
export function getDemoDestinationCount(destinationId: string): number {
  const seed = Array.from(destinationId).reduce(
    (sum, character, index) => sum + character.charCodeAt(0) * (index + 7),
    0,
  );
  return 15 + (seed % 266);
}

export interface RatingSummary { average: number; count: number }

export function combineDemoAndRealRatings(destinationId: string, real: RatingSummary): RatingSummary {
  const demoCount = getDemoDestinationCount(destinationId);
  const realCount = Math.max(0, Math.trunc(real.count));
  const count = demoCount + realCount;
  return {
    average: (getDemoDestinationRating(destinationId) * demoCount + (realCount ? real.average * realCount : 0)) / count,
    count,
  };
}
