import { Component, output, inject, signal } from '@angular/core';
import { LanguageService, LangCode } from '../services/language.service';
import { TutorialService, Level } from '../services/tutorial.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  template: `
    <!-- MAIN CONTAINER WITH MODERN DARK THEME -->
    <div class="fixed inset-0 bg-[#0F172A] text-white flex flex-col items-center justify-center z-50 overflow-y-auto font-sans selection:bg-pink-500 selection:text-white">
      
      <!-- BACKGROUND AMBIENT GRADIENTS -->
      <div class="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div class="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-pink-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow delay-1000"></div>

      <!-- CONTENT WRAPPER -->
      <div class="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center animate-fade-in-up min-h-full md:min-h-0 justify-center">
        
        <!-- LOGO SECTION -->
        <div class="mb-10 relative group shrink-0 cursor-default">
          <!-- Glow Behind Logo -->
          <div class="absolute inset-0 bg-gradient-to-tr from-pink-500 to-violet-600 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-full"></div>
          
          <!-- Logo Container -->
          <div class="relative w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-105 hover:rotate-2">
             <!-- Latest Angular Logo (Shield with A) -->
             <img src="https://angular.dev/assets/images/logos/angular/angular.svg" 
                  alt="Angular Logo" 
                  class="w-full h-full object-contain filter drop-shadow-lg"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
             <!-- Fallback SVG if image fails -->
             <svg style="display:none" viewBox="0 0 250 250" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path d="M125 30L125 30L125 30L31.9 63.2L46.1 186.3L125 230L203.9 186.3L218.1 63.2L125 30Z" fill="url(#grad1)"/>
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#f31d5b;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#832e9e;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M125 53L105 100H145L125 53ZM125 30L31.9 63.2L46.1 186.3L125 230L203.9 186.3L218.1 63.2L125 30ZM183 160H163L154 138H96L87 160H67L125 30L183 160Z" fill="white"/>
             </svg>
          </div>
        </div>

        <!-- TITLE -->
        <h1 class="text-4xl md:text-7xl font-black tracking-tight pb-6 pt-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shrink-0 leading-[1.1] drop-shadow-sm">
          Angular Routing<br>
          <span class="text-white text-3xl md:text-5xl font-extrabold tracking-normal">Playground</span>
        </h1>
        
        <p class="text-lg md:text-xl text-slate-400 mb-12 text-center max-w-2xl leading-relaxed shrink-0 font-medium">
          Master the art of navigation visually. From basic 
          <span class="text-pink-400">outlets</span> to advanced 
          <span class="text-purple-400">strategies</span>.
        </p>

        <!-- GRID SELECTION AREA -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl">
            
            <!-- CARD 1: LANGUAGE -->
            <div class="bg-slate-800/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col shadow-2xl ring-1 ring-white/10 hover:ring-pink-500/50 transition-all duration-300 group">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold">1</div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">Select Language</h3>
                </div>
                
                <div class="flex flex-wrap gap-3 justify-center h-full items-start content-start">
                    @for(lang of languages; track lang.code) {
                    <button (click)="selectLang(lang.code)"
                            [class.bg-gradient-to-br]="selectedLang() === lang.code"
                            [class.from-pink-600]="selectedLang() === lang.code"
                            [class.to-purple-600]="selectedLang() === lang.code"
                            [class.text-white]="selectedLang() === lang.code"
                            [class.shadow-lg]="selectedLang() === lang.code"
                            [class.shadow-pink-900/40]="selectedLang() === lang.code"
                            [class.border-transparent]="selectedLang() === lang.code"
                            [class.bg-slate-700/50]="selectedLang() !== lang.code"
                            [class.text-slate-300]="selectedLang() !== lang.code"
                            [class.border-slate-600/50]="selectedLang() !== lang.code"
                            class="flex-1 min-w-[100px] py-3 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-bold text-sm border hover:bg-slate-700 hover:border-pink-500/30">
                        <span class="text-xl drop-shadow-md">{{lang.flag}}</span>
                        <span>{{lang.name}}</span>
                    </button>
                    }
                </div>
            </div>

            <!-- CARD 2: LEVEL -->
            <div class="bg-slate-800/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl flex flex-col shadow-2xl ring-1 ring-white/10 hover:ring-purple-500/50 transition-all duration-300 group">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">2</div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-slate-300">Select Experience</h3>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    @for(lvl of levels; track lvl.id) {
                    <button (click)="selectLevel(lvl.id)"
                            [class.ring-2]="selectedLevel() === lvl.id"
                            [class.ring-purple-500]="selectedLevel() === lvl.id"
                            [class.bg-purple-500/20]="selectedLevel() === lvl.id"
                            [class.bg-slate-700/30]="selectedLevel() !== lvl.id"
                            class="p-3 rounded-xl transition-all hover:bg-slate-700/60 text-left relative group border border-transparent hover:border-purple-400/30 flex flex-col gap-1.5 h-full">
                        <div class="flex justify-between items-center">
                            <span class="text-2xl filter drop-shadow">{{lvl.icon}}</span>
                            @if(selectedLevel() === lvl.id) {
                                <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(192,132,252,0.8)]"></div>
                            }
                        </div>
                        <span class="font-bold text-sm text-slate-200">{{lvl.label}}</span>
                        <span class="text-[10px] text-slate-400 leading-tight">{{lvl.desc}}</span>
                    </button>
                    }
                </div>
            </div>
        </div>

        <!-- ACTION AREA -->
        <div class="mt-12 flex flex-col items-center gap-4">
            <button (click)="onStart()" 
                    class="group relative px-12 py-5 rounded-full font-bold text-lg text-white shadow-2xl transition-all hover:scale-105 hover:shadow-pink-500/30 active:scale-95 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 transition-all duration-300 group-hover:bg-gradient-to-br"></div>
                <div class="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span class="relative flex items-center gap-3">
                    Enter Playground <span class="group-hover:translate-x-1 transition-transform">🚀</span>
                </span>
            </button>
            
            <div class="text-slate-500 text-[10px] font-medium uppercase tracking-widest opacity-60 mt-4">
               Interactive Angular Learning Environment
            </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
    .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LandingPageComponent {
  ls = inject(LanguageService);
  ts = inject(TutorialService);
  start = output<void>();

  selectedLang = signal<LangCode>(this.ls.currentLang());
  selectedLevel = signal<Level>(this.ts.currentLevel());

  languages: {code: LangCode, name: string, flag: string}[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🌴' },
  ];

  levels: {id: Level, label: string, desc: string, icon: string}[] = [
    { id: 'beginner', label: 'Student', desc: 'New to code', icon: '🎒' },
    { id: 'intermediate', label: 'Intern', desc: 'Basic JS/HTML', icon: '💻' },
    { id: 'advanced', label: 'Developer', desc: 'Daily Angular user', icon: '🛠️' },
    { id: 'professional', label: 'Architect', desc: 'Deep dive internals', icon: '🏛️' },
  ];

  selectLang(code: LangCode) { this.selectedLang.set(code); }
  selectLevel(l: Level) { this.selectedLevel.set(l); }

  onStart() {
    this.ls.setLanguage(this.selectedLang());
    this.ts.setLevel(this.selectedLevel());
    this.start.emit();
  }
}
