export interface BusinessSite {
  id: string;
  name: string;
  vertical: 'gym' | 'restaurant' | 'salon' | 'clinic' | 'shop';
  hero: HeroContent;
  services: ServiceItem[];
  news: NewsItem[];
  schedule: ScheduleItem[];
  pricing: PricingPlan[];
  contact: ContactInfo;
  footer: FooterContent;
  lastUpdated: Date;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: Date;
  isActive: boolean;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number;
  className: string;
  time: string;
  instructor?: string;
  duration: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'session';
  features: string[];
  isPopular: boolean;
  order: number;
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