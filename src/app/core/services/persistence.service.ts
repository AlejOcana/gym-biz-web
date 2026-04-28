import { Injectable } from '@angular/core';
import { BusinessSite } from '../models/site.models';

const STORAGE_KEY = 'gym-site-data';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  save(data: BusinessSite): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  load(): BusinessSite | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading from localStorage', e);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}