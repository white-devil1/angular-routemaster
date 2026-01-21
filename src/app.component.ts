
import { Component, signal, inject, computed, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { TutorialService } from './services/tutorial.service';
import { SpeechService } from './services/speech.service';
import { LanguageService } from './services/language.service';
import { QuizService } from './services/quiz.service';
import { InterviewService } from './services/interview.service';
import { LandingPageComponent } from './components/landing.component';
import { SplashScreenComponent } from './components/splash.component';
import { AngularLogoComponent } from './components/svg/angular-logo.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LandingPageComponent, SplashScreenComponent, TitleCasePipe, AngularLogoComponent],
  templateUrl: './app.component.html',
  styles: [`
    @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes slideDown { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
    .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .animate-slide-down { animation: slideDown 0.2s ease-out; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

    /* THEME: Flowing Water (Space/Dark) */
    .landing-bg-flow {
      background-image: linear-gradient(to right, #020617, #2e1065, #1e1b4b, #020617);
      background-size: 200% auto;
      animation: gradientFlow 15s ease-in-out infinite;
    }
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `]
})
export class AppComponent {
  tutorial = inject(TutorialService);
  speech = inject(SpeechService);
  langService = inject(LanguageService);
  quiz = inject(QuizService);
  interview = inject(InterviewService);
  router: Router = inject(Router);

  // App State
  showSplash = signal(true);
  showLandingPage = signal(true);
  currentUrlStr = signal('/');
  showCode = signal(false);
  isSpeaking = this.speech.isSpeaking;
  isSidebarOpen = signal(false); // Mobile sidebar state
  isPlaygroundOpen = signal(false); // Toggle between Tutorial and Playground

  // React to lesson changes to stop speech
  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrlStr.set(e.urlAfterRedirects);
      // Close sidebar on mobile navigation
      this.isSidebarOpen.set(false);
    });
    
    // Auto-stop speech when changing lessons
    effect(() => {
      const step = this.tutorial.currentStep(); // Dependency
      this.speech.stop();
    });
  }

  // --- Actions ---

  onSplashFinish() {
    this.showSplash.set(false);
  }

  startTutorial() {
    // RESET ALL STATE FOR A FRESH SESSION
    // 1. Reset Internal Services
    this.quiz.reset();
    this.interview.reset();
    
    // 2. Hide Landing Page
    this.showLandingPage.set(false);
    this.isPlaygroundOpen.set(false);

    // 3. Force clean navigation
    this.router.navigate(['/home', { outlets: { left: null, right: null } }]);
  }

  goBack() {
    this.speech.stop();
    this.showLandingPage.set(true);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleCode() {
    this.showCode.update(v => !v);
  }

  togglePlayground() {
    this.isPlaygroundOpen.update(v => !v);
  }

  toggleSpeech() {
    if (this.isSpeaking()) {
      this.speech.stop();
    } else {
      const text = this.tutorial.currentStep().content;
      this.speech.speak(text, this.langService.currentLang());
    }
  }

  selectStep(index: number) {
    this.tutorial.goTo(index);
    const url = this.router.url;
    if (url.includes('quiz') || url.includes('interview')) {
      this.router.navigate(['/home']);
    }
    this.isSidebarOpen.set(false);
    // Optional: Reset to reading mode when changing steps?
    // this.isPlaygroundOpen.set(false); 
  }

  // --- Visualization Helpers ---

  parsedUrl = computed(() => {
    const raw = this.currentUrlStr();
    const result = { primary: '', id: '', left: '', right: '' };

    if (!raw || raw === '/') {
      result.primary = 'home';
      return result;
    }

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
