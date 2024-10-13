import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('en');
  currentLanguage$ = this.currentLanguage.asObservable();
  setLanguage(language: string) {
    this.currentLanguage.next(language);
    localStorage.setItem('language', language);
  }
  getLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }
}
