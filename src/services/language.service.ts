import { Injectable, signal } from '@angular/core';

export type LangCode = 'en' | 'hi' | 'ml';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<LangCode>('en');

  setLanguage(code: LangCode) {
    this.currentLang.set(code);
  }

  // Helper to get text based on current language
  get(en: string, hi: string, ml: string): string {
    const lang = this.currentLang();
    if (lang === 'hi') return hi;
    if (lang === 'ml') return ml;
    return en;
  }
}