export type Season = "spring" | "summer" | "autumn" | "winter";
export type AudienceType = "solo" | "friends" | "family" | "student" | "international";
export type InterestTag = "tea" | "culture" | "nature" | "village" | "history" | "food" | "local-product";
export type DurationCode = "half-day" | "1-day" | "2-days" | "3-plus-days";
export type DataStatus = "verified" | "source-provided" | "demo" | "incomplete";

export type GeoPointType = "entrance" | "visitor-center" | "meeting-point" | "center";
export type GeoVerification = "verified" | "approximate";

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
  address?: string;
  pointType?: GeoPointType;
  verification?: GeoVerification;
  sourceUrl?: string;
  verifiedAt?: string;
  note?: string;
}
export type MediaType = "image" | "youtube";
export interface Media {
  id: string;
  type: MediaType;
  url: string;
  alt: string;
  thumbnailUrl?: string;
  caption?: string;
  sourceUrl?: string;
  isCover?: boolean;
  order?: number;
}
export interface Experience { id: string; name: string; description: string }

export interface Destination {
  id: string;
  slug: string;
  name: string;
  regionId?: string;
  stationIds: string[];
  interestTags: InterestTag[];
  suitableFor: AudienceType[];
  seasons: Season[];
  shortDescription: string;
  story?: string;
  media: Media[];
  location?: GeoPoint;
  experienceIds: string[];
  productIds: string[];
  relatedDestinationIds: string[];
  languageContentIds?: string[];
  dataStatus: DataStatus;
}

export interface Region {
  id: string; slug: string; name: string; description?: string;
  seasons: Season[]; destinationIds: string[]; experienceIds: string[]; location?: GeoPoint;
}

export interface Station {
  id: string; slug: string; name: string; description: string; destinationIds: string[]; icon: string;
}

export interface Product {
  id: string; slug: string; name: string; shortDescription?: string;
  media: Media[]; destinationIds: string[]; journeyIds: string[]; dataStatus: DataStatus;
}

export interface LanguageContent {
  id: string; destinationId: string; language: "vi" | "en" | "ru";
  vocabulary: { source: string; translated: string }[];
  phrases: { source: string; translated: string }[];
  challenge?: string;
}

export interface JourneyItem {
  destinationId?: string; title?: string; startTime?: string; durationMinutes?: number; note?: string; isDemoSchedule?: boolean;
}
export interface JourneyDay { day: number; items: JourneyItem[] }
export interface Journey {
  id: string; slug: string; name: string; summary: string; duration: DurationCode;
  interests: InterestTag[]; audiences: AudienceType[]; seasons: Season[];
  days: JourneyDay[]; destinationIds: string[]; image: string; priority: number; dataStatus: DataStatus;
  code?: string; durationLabel?: string; conditions?: string; sourceLabel?: string;
}

export interface JourneyPreferences {
  duration: DurationCode; interests: InterestTag[]; audience: AudienceType; season: Season;
}
export interface JourneyRecommendation { journey: Journey; score: number; matchedReasons: string[] }
