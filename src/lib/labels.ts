import type { AudienceType, DurationCode, InterestTag, Season } from "@/domain/models";
import type { Locale } from "@/i18n/config";
import { translate } from "@/i18n/messages";
export const durationLabels: Record<DurationCode, string> = { "half-day": "Nửa ngày", "1-day": "1 ngày", "2-days": "2 ngày", "3-plus-days": "3+ ngày" };
export const interestLabels: Record<InterestTag, string> = { tea: "Trà", "tea-product": "Sản phẩm chè", culture: "Văn hóa", festival: "Lễ hội", nature: "Thiên nhiên", village: "Bản làng", history: "Lịch sử", food: "Ẩm thực", "local-product": "Sản phẩm địa phương" };
export const audienceLabels: Record<AudienceType, string> = { solo: "Đi một mình", friends: "Bạn bè", family: "Gia đình", student: "Học sinh / sinh viên", international: "Khách quốc tế" };
export const seasonLabels: Record<Season, string> = { spring: "Mùa xuân", summer: "Mùa hè", autumn: "Mùa thu", winter: "Mùa đông" };

export function getLocalizedLabels(locale: Locale) {
  return {
    duration: Object.fromEntries(Object.keys(durationLabels).map((key) => [key, translate(locale, `duration.${key}` as `duration.${DurationCode}`)])) as Record<DurationCode, string>,
    interest: Object.fromEntries(Object.keys(interestLabels).map((key) => [key, translate(locale, `interest.${key}` as `interest.${InterestTag}`)])) as Record<InterestTag, string>,
    audience: Object.fromEntries(Object.keys(audienceLabels).map((key) => [key, translate(locale, `audience.${key}` as `audience.${AudienceType}`)])) as Record<AudienceType, string>,
    season: Object.fromEntries(Object.keys(seasonLabels).map((key) => [key, translate(locale, `season.${key}` as `season.${Season}`)])) as Record<Season, string>,
  };
}
