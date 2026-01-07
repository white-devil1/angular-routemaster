import { Component, output, inject, signal } from '@angular/core';
import { LanguageService, LangCode } from '../services/language.service';
import { TutorialService, Level } from '../services/tutorial.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-white flex flex-col items-center justify-center z-50 overflow-y-auto">
      
      <!-- Content Wrapper -->
      <div class="relative z-10 w-full max-w-4xl px-6 py-12 flex flex-col items-center animate-fade-in-up">
        
        <!-- Logo -->
        <div class="mb-8 p-6 bg-white/5 rounded-full border border-white/10 shadow-2xl relative group">
          <div class="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <span class="text-6xl relative z-10 block transform group-hover:scale-110 transition-transform">🧭</span>
        </div>

        <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-400">
          Angular Routing Master
        </h1>
        <p class="text-lg md:text-xl text-slate-300 mb-10 text-center max-w-2xl leading-relaxed">
          The interactive classroom for everyone. Whether you are a student or an architect, master navigation concepts visually.
        </p>

        <!-- STEP 1: LANGUAGE -->
        <div class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur-md">
          <h3 class="text-center text-xs font-bold uppercase tracking-widest text-indigo-300 mb-6">
            1. Select Language / भाषा / ഭാഷ
          </h3>
          <div class="flex flex-wrap justify-center gap-4">
             @for(lang of languages; track lang.code) {
               <button (click)="selectLang(lang.code)"
                       [class.ring-2]="selectedLang() === lang.code"
                       [class.bg-indigo-600]="selectedLang() === lang.code"
                       [class.bg-white_10]="selectedLang() !== lang.code"
                       class="ring-indigo-400 px-6 py-3 rounded-xl transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 flex items-center gap-3 min-w-[140px]">
                 <span class="text-2xl">{{lang.flag}}</span>
                 <span class="font-bold">{{lang.name}}</span>
               </button>
             }
          </div>
        </div>

        <!-- STEP 2: LEVEL -->
        <div class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
          <h3 class="text-center text-xs font-bold uppercase tracking-widest text-purple-300 mb-6">
            2. Select Your Level
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
             @for(lvl of levels; track lvl.id) {
               <button (click)="selectLevel(lvl.id)"
                       [class.ring-2]="selectedLevel() === lvl.id"
                       [class.bg-purple-600]="selectedLevel() === lvl.id"
                       [class.bg-white_5]="selectedLevel() !== lvl.id"
                       class="ring-purple-400 p-4 rounded-xl transition-all hover:bg-purple-700 hover:-translate-y-1 text-left relative overflow-hidden group">
                 <div class="text-3xl mb-2">{{lvl.icon}}</div>
                 <div class="font-bold text-lg mb-1">{{lvl.label}}</div>
                 <div class="text-xs text-white/60 leading-tight">{{lvl.desc}}</div>
                 
                 <!-- Selection Checkmark -->
                 @if(selectedLevel() === lvl.id) {
                   <div class="absolute top-2 right-2 text-white bg-purple-800 rounded-full p-1 text-xs">✓</div>
                 }
               </button>
             }
          </div>
        </div>

        <!-- START BUTTON -->
        <button (click)="onStart()" 
                class="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full font-bold text-xl shadow-lg shadow-indigo-900/50 hover:shadow-indigo-900/80 hover:scale-105 transition-all flex items-center gap-3">
          Enter Classroom 🎓
        </button>

      </div>
    </div>
  `,
  styles: [`
    .bg-white_10 { background-color: rgba(255,255,255,0.1); }
    .bg-white_5 { background-color: rgba(255,255,255,0.05); }
    .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LandingPageComponent {
  ls = inject(LanguageService);
  ts = inject(TutorialService);
  start = output<void>();

  selectedLang = signal<LangCode>('en');
  selectedLevel = signal<Level>('beginner');

  languages: {code: LangCode, name: string, flag: string}[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🌴' },
  ];

  levels: {id: Level, label: string, desc: string, icon: string}[] = [
    { id: 'beginner', label: 'Student', desc: 'I am new to programming.', icon: '🎒' },
    { id: 'intermediate', label: 'Intern', desc: 'I know some HTML/JS.', icon: '💻' },
    { id: 'advanced', label: 'Developer', desc: 'I use Angular daily.', icon: '🛠️' },
    { id: 'professional', label: 'Architect', desc: 'Deep dive technicals.', icon: '🏛️' },
  ];

  selectLang(code: LangCode) { this.selectedLang.set(code); }
  selectLevel(l: Level) { this.selectedLevel.set(l); }

  onStart() {
    this.ls.setLanguage(this.selectedLang());
    this.ts.setLevel(this.selectedLevel());
    this.start.emit();
  }
}