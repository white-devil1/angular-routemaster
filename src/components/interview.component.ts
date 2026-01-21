
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterviewService } from '../services/interview.service';
import { TutorialService } from '../services/tutorial.service';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  template: `
    <!-- Transparent BG for Theme Flow -->
    <div class="h-full bg-transparent p-6 overflow-y-auto flex flex-col items-center">
      
      <!-- HEADER & LIST QUESTIONS -->
      <div class="max-w-3xl w-full animate-slide-up">
        
        <div class="flex items-center gap-4 mb-8">
          <button (click)="goHome()" class="p-2 hover:bg-white/10 rounded-full transition-colors text-white" title="Exit">
            ⬅️
          </button>
          <div>
            <h1 class="text-2xl font-black text-white">
              <span class="text-indigo-400">{{ currentLevel() | titlecase }}</span> Interview Q&A
            </h1>
            <p class="text-sm text-slate-400">{{ filteredQuestions().length }} Questions available for this level</p>
          </div>
        </div>

        <div class="space-y-4 pb-20">
          @for(q of filteredQuestions(); track q.id) {
            <!-- WHITE CARD for Contrast -->
            <div class="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01]">
              <button (click)="service.toggle(q.id)" 
                      class="w-full text-left px-6 py-5 flex justify-between items-start focus:outline-none">
                <span class="font-bold text-slate-800 pr-4 leading-relaxed">{{q.question}}</span>
                <div class="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors"
                      [class.bg-indigo-50]="q.isOpen" [class.border-indigo-100]="q.isOpen">
                  <span class="text-slate-400 font-light transition-transform duration-300" 
                        [class.rotate-45]="q.isOpen"
                        [class.text-indigo-600]="q.isOpen">+</span>
                </div>
              </button>
              
              @if(q.isOpen) {
                <div class="px-6 pb-6 pt-0 animate-slide-down">
                  <div class="p-4 bg-slate-50 border-l-4 border-indigo-400 rounded-r-lg text-slate-700 leading-relaxed text-sm">
                    <!-- CHANGED: [innerHTML] to support code blocks and bolding -->
                    <div [innerHTML]="q.answer"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

      </div>

    </div>
  `,
  styles: [`
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-slide-down { animation: slideDown 0.2s ease-out; transform-origin: top; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: scaleY(0.95); height: 0; } to { opacity: 1; transform: scaleY(1); height: auto; } }
  `]
})
export class InterviewComponent {
  service = inject(InterviewService);
  tutorial = inject(TutorialService);
  router: Router = inject(Router);

  // Automatically sync with the global tutorial level
  currentLevel = computed(() => this.tutorial.currentLevel());

  filteredQuestions = computed(() => {
    return this.service.questions().filter(q => q.level === this.currentLevel());
  });

  goHome() {
    this.router.navigate(['/home']);
  }
}
