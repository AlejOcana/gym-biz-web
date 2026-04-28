import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { BusinessSite, NewsItem, ScheduleItem, HeroContent, ContactInfo } from '../models/site.models';
import { DEFAULT_SITE } from '../data/default-site';
import { PersistenceService } from './persistence.service';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private persistence = inject(PersistenceService);

  private _site = signal<BusinessSite>(DEFAULT_SITE);
  readonly site = this._site.asReadonly();

  readonly activeNews = computed(() =>
    this._site().news.filter(n => n.isActive).slice(0, 3)
  );

  readonly sortedServices = computed(() =>
    [...this._site().services].sort((a, b) => a.order - b.order)
  );

  readonly sortedPricing = computed(() =>
    [...this._site().pricing].sort((a, b) => a.order - b.order)
  );

  constructor() {
    const saved = this.persistence.load();
    if (saved) {
      this._site.set(saved);
    }

    effect(() => {
      this.persistence.save(this._site());
    });
  }

  updateHero(hero: Partial<HeroContent>) {
    this._site.update(site => ({
      ...site,
      hero: { ...site.hero, ...hero }
    }));
  }

  addNews(news: Omit<NewsItem, 'id'>) {
    this._site.update(site => ({
      ...site,
      news: [...site.news, { ...news, id: crypto.randomUUID() }]
    }));
  }

  updateNews(id: string, updates: Partial<NewsItem>) {
    this._site.update(site => ({
      ...site,
      news: site.news.map(n => n.id === id ? { ...n, ...updates } : n)
    }));
  }

  deleteNews(id: string) {
    this._site.update(site => ({
      ...site,
      news: site.news.filter(n => n.id !== id)
    }));
  }

  updateContact(contact: Partial<ContactInfo>) {
    this._site.update(site => ({
      ...site,
      contact: { ...site.contact, ...contact }
    }));
  }

  updateSchedule(schedule: ScheduleItem[]) {
    this._site.update(site => ({
      ...site,
      schedule
    }));
  }

  reset() {
    this._site.set(DEFAULT_SITE);
  }
}