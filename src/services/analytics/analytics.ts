export type AnalyticsEvent = "home_view" | "journey_form_submit" | "journey_recommendation_view" | "journey_detail_view" | "map_view" | "destination_view" | "product_view" | "add_to_my_journey" | "survey_submit";
export interface AnalyticsService { track(eventName: AnalyticsEvent, payload?: Record<string, unknown>): void }

class LocalAnalyticsService implements AnalyticsService {
  track(eventName: AnalyticsEvent, payload: Record<string, unknown> = {}) {
    try {
      const events = JSON.parse(localStorage.getItem("tn-analytics") ?? "[]") as unknown[];
      localStorage.setItem("tn-analytics", JSON.stringify([...events, { eventName, payload, at: new Date().toISOString() }].slice(-100)));
    } catch { /* Analytics never blocks the interface. */ }
  }
}
export const analyticsService: AnalyticsService = new LocalAnalyticsService();
