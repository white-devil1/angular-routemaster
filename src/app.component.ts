
import { Component, signal, inject, computed, effect, HostListener, OnInit } from '@angular/core';
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
    
    /* Sidebar Transition */
    .sidebar-transition {
      transition: width 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
  `]
})
export class AppComponent implements OnInit {
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
  
  // UI State
  isSidebarOpen = signal(true); 
  isPlaygroundOpen = signal(false); 
  isMobile = signal(false);

  // React to lesson changes to stop speech
  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrlStr.set(e.urlAfterRedirects);
      // Close sidebar on mobile navigation automatically, keep open on desktop
      if (this.isMobile()) {
        this.isSidebarOpen.set(false);
      }
    });
    
    // Auto-stop speech when changing lessons
    effect(() => {
      const step = this.tutorial.currentStep(); // Dependency
      this.speech.stop();
    });
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    // Determine if mobile (portrait or narrow width)
    const width = window.innerWidth;
    const isPortrait = window.innerHeight > window.innerWidth;
    const wasMobile = this.isMobile();
    
    this.isMobile.set(width < 768 || (width < 1024 && isPortrait));

    // Reset layout defaults only if the mode actually changed (prevent jarring resets)
    if (this.isMobile() !== wasMobile) {
      if (this.isMobile()) {
        this.isSidebarOpen.set(false); // Default close on mobile
      } else {
        this.isSidebarOpen.set(true); // Default open on desktop
      }
    }
  }

  // --- Actions ---

  onSplashFinish() {
    this.showSplash.set(false);
  }

  startTutorial() {
    // RESET ALL STATE FOR A FRESH SESSION
    this.quiz.reset();
    this.interview.reset();
    
    this.showLandingPage.set(false);
    this.isPlaygroundOpen.set(false);
    
    // Set proper sidebar state
    this.isSidebarOpen.set(!this.isMobile());

    // Force clean navigation
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
    const newState = !this.isPlaygroundOpen();
    this.isPlaygroundOpen.set(newState);

    if (newState) {
      // Focus Mode: Hide Sidebar when entering playground
      this.isSidebarOpen.set(false);
    } else {
      // Restore Mode: Show Sidebar if desktop, else keep closed
      this.isSidebarOpen.set(!this.isMobile());
    }
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
    
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
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
