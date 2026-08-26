/** GymBiz v2 — domain model. */

export type Vertical = 'gym' | 'restaurant' | 'salon' | 'clinic' | 'shop';

export interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  imageUrl?: string;
  imageAttribution?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string; // ISO date
  isActive: boolean;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 1 = Monday … 7 = Sunday
  className: string;
  time: string; // "HH:mm"
  instructor: string;
  duration: number; // minutes
  capacity: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // monthly
  features: string[];
  isPopular: boolean;
  order: number;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  initials: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'whatsapp';
  url: string;
}

export interface FooterContent {
  copyright: string;
}

export interface SiteContent {
  name: string;
  vertical: Vertical;
  hero: HeroContent;
  services: ServiceItem[];
  schedule: ScheduleItem[];
  pricing: PricingPlan[];
  trainers: Trainer[];
  news: NewsItem[];
  contact: ContactInfo;
  footer: FooterContent;
  lastUpdated: string;
}

/* ---- bookings & messages ---- */

export interface Booking {
  id: string;
  sessionId: string;
  className: string;
  time: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

/* ---- auth ---- */

export interface AdminSession {
  email: string;
  loggedInAt: string;
}

export const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Annual price = 12 monthly payments with 2 months free. */
export function annualPrice(monthly: number): number {
  return monthly * 10;
}
