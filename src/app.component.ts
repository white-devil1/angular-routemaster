import { Component, signal, inject, computed, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { TutorialService } from './services/tutorial.service';
import { SpeechService } from './services/speech.service';
import { LanguageService } from './services/language.service';
import { LandingPageComponent } from './components/landing.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LandingPageComponent, TitleCasePipe],
  templateUrl: './app.component.html',
  styles: [`
    @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
    .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .animate-slide-down { animation: slideDown 0.2s ease-out; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  `]
})
export class AppComponent {
  tutorial = inject(TutorialService);
  speech = inject(SpeechService);
  langService = inject(LanguageService);
  private router = inject(Router);

  // App State
  showLandingPage = signal(true);
  currentUrlStr = signal('/');
  showCode = signal(false);
  isSpeaking = this.speech.isSpeaking;

  // React to lesson changes to stop speech
  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrlStr.set(e.urlAfterRedirects);
    });
    
    // Auto-stop speech when changing lessons
    effect(() => {
      const step = this.tutorial.currentStep(); // Dependency
      this.speech.stop();
    });
  }

  // --- Actions ---

  startTutorial() {
    this.showLandingPage.set(false);
  }

  goBack() {
    this.speech.stop();
    this.showLandingPage.set(true);
  }

  toggleCode() {
    this.showCode.update(v => !v);
  }

  toggleSpeech() {
    if (this.isSpeaking()) {
      this.speech.stop();
    } else {
      const text = this.tutorial.currentStep().content;
      // Use current language code
      this.speech.speak(text, this.langService.currentLang());
    }
  }

  // --- Visualization Helpers ---

  parsedUrl = computed(() => {
    const raw = this.currentUrlStr();
    const result = { primary: '', id: '', left: '', right: '' };

    if (!raw || raw === '/') {
      result.primary = 'home';
      return result;
    }

    // Regex parsing for display
    const leftMatch = raw.match(/left:([^)\/]+)/);
    if (leftMatch) result.left = leftMatch[1];

    const rightMatch = raw.match(/right:([^)\/]+)/);
    if (rightMatch) result.right = rightMatch[1];

    let primaryPart = raw.split('(')[0]; 
    if (primaryPart.startsWith('/')) primaryPart = primaryPart.substring(1);
    
    if (primaryPart.startsWith('user/')) {
       result.primary = 'user';
       result.id = primaryPart.split('/')[1];
    } else {
       result.primary = primaryPart || 'home';
    }

    return result;
  });

  shouldDim(area: string): boolean {
    const focus = this.tutorial.currentStep().focusArea;
    if (focus === 'intro' || focus === 'url') return false; 
    return focus !== area;
  }
}