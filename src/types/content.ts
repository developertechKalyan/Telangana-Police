import type { LocalizedText } from "@/i18n/locales";

export interface NavLink {
  label: LocalizedText;
  path: string;
  children?: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "twitter" | "youtube";
}

export interface ImpactStat {
  label: LocalizedText;
  value: number;
  suffix?: LocalizedText;
}

export interface DecadeStat {
  label: LocalizedText;
  total: number;
  thisMonth: number;
  last24h: number;
  updated: string;
}

export interface DailyStat {
  label: LocalizedText;
  total: number;
  male: number;
  female: number;
}

export interface LeaderProfile {
  name: string;
  title: LocalizedText;
  initials: string;
  image: string;
}

export interface FleetStat {
  label: LocalizedText;
  value: string;
  description: LocalizedText;
}

export type ServiceCategory = "Community Services" | "Personal Safety Services" | "Traffic Services" | "Emergency Services";

export interface ServiceItem {
  title: LocalizedText;
  description: LocalizedText;
  stat: LocalizedText;
  features: LocalizedText[];
  category: ServiceCategory;
}

export interface ChannelItem {
  title: LocalizedText;
  bestFor: LocalizedText;
  steps: LocalizedText[];
  note?: LocalizedText;
  situationTags: string[];
}

export interface SituationCategory {
  title: LocalizedText;
  examples: LocalizedText[];
}

export interface JourneyStep {
  step: number;
  title: LocalizedText;
  body: LocalizedText;
}

export interface DoDontItem {
  kind: "do" | "dont";
  text: LocalizedText;
}

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface MythFactItem {
  myth: LocalizedText;
  fact: LocalizedText;
}

export interface GalleryItem {
  id: number;
  type: "photo" | "video";
  caption: LocalizedText;
  src: string;
}

export type WeatherCondition = "Sunny" | "Partly Cloudy" | "Cloudy" | "Rain";
