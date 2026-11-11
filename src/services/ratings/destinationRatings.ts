import { createSupabaseServerClient } from "@/lib/supabase/server";
import { combineDemoAndRealRatings } from "./demoRating";

export interface DestinationRatingState {
  available: boolean;
  authenticated: boolean;
  average: number;
  count: number;
  userRating: number | null;
}

type SummaryRow = { average_rating: number | string | null; rating_count: number | string | null };
type AllSummaryRow = SummaryRow & { destination_id: string };
export type DestinationRatingSummaries = Record<string, { average: number; count: number }>;
let warnedUnavailable = false;

export function parseRating(value: unknown): number | null {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5 ? Number(value) : null;
}

export async function getDestinationRatingSummaries(): Promise<DestinationRatingSummaries> {
  const client = await createSupabaseServerClient();
  if (!client) return {};
  const { data, error } = await client.rpc("get_destination_rating_summaries");
  if (error) {
    console.warn("Destination rating summaries unavailable.", error.message);
    return {};
  }
  return Object.fromEntries(((data ?? []) as AllSummaryRow[]).map((row) => [
    row.destination_id,
    combineDemoAndRealRatings(row.destination_id, {
      average: Number(row.average_rating ?? 0),
      count: Number(row.rating_count ?? 0),
    }),
  ]));
}

export async function getDestinationRatingState(destinationId: string): Promise<DestinationRatingState> {
  const client = await createSupabaseServerClient();
  if (!client) return { available: false, authenticated: false, average: 0, count: 0, userRating: null };

  const { data: { user } } = await client.auth.getUser();
  const [summaryResult, userResult] = await Promise.all([
    client.rpc("get_destination_rating_summary", { p_destination_id: destinationId }),
    user
      ? client.from("destination_ratings").select("rating").eq("destination_id", destinationId).eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (summaryResult.error) {
    if (!warnedUnavailable) {
      console.warn("Destination ratings unavailable.", summaryResult.error.message);
      warnedUnavailable = true;
    }
    return { available: false, authenticated: Boolean(user), average: 0, count: 0, userRating: null };
  }

  const summary = ((summaryResult.data ?? []) as SummaryRow[])[0];
  const displaySummary = combineDemoAndRealRatings(destinationId, {
    average: Number(summary?.average_rating ?? 0),
    count: Number(summary?.rating_count ?? 0),
  });
  return {
    available: true,
    authenticated: Boolean(user),
    ...displaySummary,
    userRating: userResult.error ? null : parseRating(userResult.data?.rating),
  };
}
