
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService, QuizQuestion } from '../services/quiz.service';
import { TutorialService } from '../services/tutorial.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- MAIN WRAPPER: Transparent to let global flow theme show through -->
    <div class="h-full flex flex-col bg-transparent relative overflow-hidden font-sans">
      
      <!-- HEADER (Glass) -->
      <!-- Added pr-16 for mobile to clear space for the absolute toggle button -->
      <div class="relative z-10 bg-slate-900/30 backdrop-blur-md border-b border-white/10 p-3 pr-16 md:p-4 flex justify-between items-center shadow-lg shrink-0">
        <h2 class="text-base md:text-xl font-black text-white flex items-center gap-2">
          <span>🧠</span> 
          <span class="hidden md:inline">Routing Quiz</span>
          <span class="md:hidden">Quiz</span>
          <span class="px-2 py-1 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] md:text-xs font-normal uppercase tracking-wider">
            {{ tutorial.currentLevel() }}
          </span>
        </h2>
        @if(quiz.quizState() === 'active') {
          <div class="flex items-center gap-2 md:gap-4">
             <div class="text-xs md:text-sm font-bold text-slate-400">Score: <span class="text-indigo-400 text-sm md:text-lg">{{quiz.score()}}</span></div>
             <div class="w-20 md:w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
               <div class="h-full bg-indigo-500 transition-all duration-500" [style.width.%]="quiz.progress()"></div>
             </div>
          </div>
        }
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2 md:p-6 relative z-10 flex flex-col items-center justify-start md:justify-center">
        
        <!-- STATE: ACTIVE QUESTION -->
        @if(quiz.quizState() === 'active' && quiz.currentQuestion(); as q) {
          <!-- WHITE CARD for Contrast -->
          <div class="max-w-3xl w-full bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col animate-slide-up my-4 md:my-0">
            
            <!-- Question Text -->
            <div class="p-5 md:p-8 bg-slate-50 border-b border-slate-200">
               <div class="flex justify-between mb-4">
                 <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide">
                   Q {{quiz.currentQuestionIndex() + 1}} / {{ quiz.totalQuestionsInLevel() }}
                 </span>
                 <span class="text-[10px] md:text-xs font-bold text-slate-400 uppercase">{{q.type}}</span>
               </div>
               
               <h3 class="text-lg md:text-2xl font-bold text-slate-800 leading-snug">
                 {{ formatQuestionText(q) }}
               </h3>
               
               @if(q.codeContext) {
                 <div class="mt-4 p-3 bg-slate-800 rounded-lg font-mono text-xs md:text-sm text-blue-300 border border-slate-700 shadow-inner overflow-x-auto whitespace-pre-wrap">
                   {{q.codeContext}}
                 </div>
               }
            </div>

            <!-- Input Area -->
            <div class="p-5 md:p-8 bg-white text-slate-800">
              @if(!quiz.showExplanation()) {
                
                <!-- MCQ -->
                @if(q.type === 'mcq') {
                  <div class="grid gap-3">
                    @for(opt of q.options; track opt) {
                      <button (click)="submit(opt)" 
                              class="w-full text-left p-3 md:p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all font-medium text-sm md:text-base text-slate-700 active:scale-[0.98]">
                        {{opt}}
                      </button>
                    }
                  </div>
                }

                <!-- FILL BLANK -->
                @if(q.type === 'fill-blank') {
                  <div class="flex flex-col md:flex-row gap-2">
                    <input #txtInput type="text" 
                           (keydown.enter)="submit(txtInput.value)"
                           placeholder="Type answer..." 
                           class="flex-1 p-3 md:p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-base md:text-lg font-medium bg-slate-50 text-slate-900 w-full">
                    <button (click)="submit(txtInput.value)" class="w-full md:w-auto px-6 py-3 md:py-0 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-transform">Submit</button>
                  </div>
                }

                <!-- CODE -->
                @if(q.type === 'code') {
                  <div class="flex flex-col gap-3">
                    <textarea #codeInput rows="4" 
                              placeholder="Write your code snippet here..." 
                              class="w-full p-4 rounded-xl bg-slate-900 text-green-400 font-mono text-sm border-2 border-slate-700 focus:border-indigo-500 focus:outline-none shadow-inner resize-none"></textarea>
                    <button (click)="submit(codeInput.value)" class="self-end px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg w-full md:w-auto">Run Code ▶</button>
                  </div>
                }

              } @else {
                <!-- RESULT FEEDBACK -->
                <div class="text-center animate-pop-in">
                  <div class="text-5xl md:text-6xl mb-4">
                    {{ quiz.isCorrect() ? '✅' : '❌' }}
                  </div>
                  <h3 class="text-xl md:text-2xl font-bold mb-2" 
                      [class.text-green-600]="quiz.isCorrect()" 
                      [class.text-red-600]="!quiz.isCorrect()">
                    {{ quiz.isCorrect() ? 'Correct!' : 'Incorrect' }}
                  </h3>
                  
                  <div class="bg-slate-50 p-4 md:p-6 rounded-xl text-left border border-slate-200 mb-8 shadow-sm text-slate-700 text-sm md:text-base">
                    <p class="font-bold text-xs text-slate-400 uppercase tracking-widest mb-2">Explanation:</p>
                    <p class="text-slate-700 leading-relaxed">{{q.explanation}}</p>
                    @if(!quiz.isCorrect()) {
                      <div class="mt-4 pt-4 border-t border-slate-200">
                        <span class="font-bold text-xs text-slate-400 uppercase tracking-widest">Correct Answer:</span>
                        <code class="block bg-slate-200 p-2 rounded mt-2 text-xs md:text-sm font-mono text-slate-800 break-words whitespace-pre-wrap">
                          {{ q.type === 'code' ? 'Must contain keywords: ' + q.correctAnswer : q.correctAnswer }}
                        </code>
                      </div>
                    }
                  </div>

                  <button (click)="quiz.nextQuestion()" 
                          class="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    Next Question →
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <!-- STATE: RESULT -->
        @if(quiz.quizState() === 'result') {
          @let scorePercent = quiz.scorePercentage();
          <div class="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center animate-pop-in border border-slate-100 relative overflow-hidden my-4 md:my-0">
             
            <!-- Tier 4: 90-100% -->
            @if (scorePercent >= 90) {
              <div class="absolute inset-0 pointer-events-none">
                <!-- Gold Confetti -->
                <div class="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-confetti-1"></div>
                <div class="absolute top-0 left-1/2 w-3 h-3 bg-yellow-300 rounded-full animate-confetti-2"></div>
                <div class="absolute top-0 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-confetti-3"></div>
              </div>
              <div class="text-6xl md:text-8xl mb-4 animate-trophy-bounce">🏆</div>
              <h2 class="text-2xl md:text-3xl font-black text-amber-600 mb-2">Mastery!</h2>
              <p class="text-sm md:text-base text-slate-500 mb-6">You have an expert understanding of this topic.</p>
            }
            <!-- Tier 3: 70-89% -->
            @else if (scorePercent >= 70) {
              <div class="text-6xl md:text-8xl mb-4 animate-star-pulse">✨</div>
              <h2 class="text-2xl md:text-3xl font-black text-indigo-600 mb-2">Excellent Work!</h2>
              <p class="text-sm md:text-base text-slate-500 mb-6">You have a strong grasp of the concepts.</p>
            }
            <!-- Tier 2: 40-69% -->
            @else if (scorePercent >= 40) {
              <div class="text-6xl md:text-8xl mb-4 animate-thumbs-up">👍</div>
              <h2 class="text-2xl md:text-3xl font-black text-sky-600 mb-2">Good Effort!</h2>
              <p class="text-sm md:text-base text-slate-500 mb-6">You're on the right track. Keep studying!</p>
            }
            <!-- Tier 1: < 40% -->
            @else {
              <div class="text-6xl md:text-8xl mb-4 animate-gentle-shake">📉</div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-700 mb-2">Needs Improvement</h2>
              <p class="text-sm md:text-base text-slate-500 mb-6">Review the tutorials and try again.</p>
            }

             <!-- Score Display -->
            <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div class="text-5xl md:text-6xl font-black text-slate-800">
                  {{ scorePercent }}<span class="text-3xl md:text-4xl text-slate-400">%</span>
              </div>
              <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Final Score</div>
              
              <div class="flex justify-center divide-x divide-slate-200">
                <div class="px-2 md:px-4">
                  <div class="text-xl md:text-2xl font-bold text-green-600">{{ quiz.correctCount() }}</div>
                  <div class="text-[9px] md:text-[10px] uppercase font-bold text-slate-500">Correct</div>
                </div>
                <div class="px-2 md:px-4">
                  <div class="text-xl md:text-2xl font-bold text-red-600">{{ quiz.totalQuestionsInLevel() - quiz.correctCount() }}</div>
                  <div class="text-[9px] md:text-[10px] uppercase font-bold text-slate-500">Incorrect</div>
                </div>
                 <div class="px-2 md:px-4">
                  <div class="text-xl md:text-2xl font-bold text-slate-700">{{ quiz.score() }}</div>
                  <div class="text-[9px] md:text-[10px] uppercase font-bold text-slate-500">Points</div>
                </div>
              </div>
            </div>

             <div class="flex flex-col md:flex-row gap-3 justify-center mt-8">
               <button (click)="goHome()" class="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 w-full md:w-auto">Exit</button>
               <button (click)="retry()" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg w-full md:w-auto">Retry Quiz</button>
             </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    
    /* Result Animations */
    @keyframes confettiFall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(500px) rotate(360deg); opacity: 0; } }
    .animate-confetti-1 { animation: confettiFall 2s linear infinite; }
    .animate-confetti-2 { animation: confettiFall 2.5s linear infinite 0.5s; }
    .animate-confetti-3 { animation: confettiFall 1.8s linear infinite 1s; }

    @keyframes trophyBounce { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(5deg) scale(1.1); } }
    .animate-trophy-bounce { animation: trophyBounce 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
    
    @keyframes starPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }
    .animate-star-pulse { animation: starPulse 1.5s ease-in-out infinite; }
    
    @keyframes thumbsUp { 0%, 100% { transform: scale(1) rotate(0); } 25% { transform: scale(1.1) rotate(-10deg); } 75% { transform: scale(1.1) rotate(10deg); } }
    .animate-thumbs-up { animation: thumbsUp 1.2s ease-in-out; }
    
    @keyframes gentleShake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-gentle-shake { animation: gentleShake 0.4s ease-in-out; }
  `]
})
export class QuizComponent implements OnInit {
  quiz = inject(QuizService);
  tutorial = inject(TutorialService);
  router: Router = inject(Router);

  ngOnInit() {
    this.retry();
  }

  formatQuestionText(q: QuizQuestion): string {
    if (q.type === 'fill-blank' && q.question) {
      return q.question.replace('[?]', '____');
    }
    return q.question;
  }

  submit(answer: string) {
    if (!answer || this.quiz.showExplanation()) return;
    this.quiz.submitAnswer(answer);
  }

  retry() {
    this.quiz.startQuiz(this.tutorial.currentLevel());
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
