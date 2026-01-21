import { Component, output, OnInit } from '@angular/core';
import { AngularLogoComponent } from './svg/angular-logo.component';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [AngularLogoComponent],
  template: `
    <div class="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center font-sans">
      
      <!-- BACKGROUND: Matrix-like data stream -->
      <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-rain"></div>
        <div class="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-rain delay-700"></div>
        <div class="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-rain delay-300"></div>
      </div>

      <!-- MAIN CONTAINER: The "Browser" Simulation -->
      <div class="relative w-[90vw] max-w-[400px] flex flex-col gap-6 items-center">
        
        <!-- 1. THE URL BAR (Visualizing the Route Request) -->
        <div class="w-full bg-slate-900 rounded-lg border border-slate-700 p-3 flex items-center gap-3 shadow-2xl relative overflow-hidden group">
          <!-- Traffic Lights -->
          <div class="flex gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          
          <!-- Address Field -->
          <div class="flex-1 bg-slate-950/50 rounded h-6 flex items-center px-2 text-xs font-mono text-slate-400 overflow-hidden relative">
            <span class="text-slate-600 mr-1">https://</span>
            <span class="animate-typewriter text-indigo-400 font-bold whitespace-nowrap">angular-router/init...</span>
            <span class="w-1.5 h-4 bg-indigo-500 animate-blink ml-0.5"></span>
          </div>

          <!-- Progress Bar (The Navigation) -->
          <div class="absolute bottom-0 left-0 h-0.5 bg-indigo-500 animate-loading-bar"></div>
        </div>

        <!-- 2. THE ROUTER (Processing) -->
        <div class="flex flex-col items-center gap-2 animate-fade-in-delayed">
          <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Resolving Route...</div>
          <div class="flex items-center gap-1 text-slate-600">
             <div class="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
             <div class="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-100"></div>
             <div class="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        <!-- 3. THE OUTLET (Component Mounting) -->
        <div class="relative w-32 h-32 flex items-center justify-center">
           
           <!-- The "Frame" appearing -->
           <div class="absolute inset-0 border-2 border-dashed border-slate-700 rounded-xl animate-expand-frame"></div>
           
           <!-- The Logo (Component) Dropping In -->
           <div class="w-20 h-20 animate-mount-component filter drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <app-angular-logo></app-angular-logo>
           </div>
        </div>

        <!-- 4. Text -->
        <div class="text-center animate-slide-up-fade">
           <h1 class="text-2xl font-bold text-white tracking-tight">RouteMaster</h1>
           <p class="text-xs text-slate-500 mt-1">Initializing Application Shell</p>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    /* --- ANIMATIONS --- */

    /* Typing Effect */
    @keyframes typewriter {
      0% { width: 0; opacity: 0; }
      10% { opacity: 1; }
      100% { width: 100%; opacity: 1; }
    }
    .animate-typewriter {
      overflow: hidden;
      display: inline-block;
      width: 0;
      animation: typewriter 1.5s steps(20, end) forwards 0.5s;
    }

    /* Cursor Blink */
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .animate-blink { animation: blink 0.8s infinite; }

    /* Loading Bar */
    @keyframes loadingBar { 0% { width: 0; } 50% { width: 70%; } 100% { width: 100%; } }
    .animate-loading-bar { width: 0; animation: loadingBar 2.5s ease-in-out forwards; }

    /* Frame Expansion */
    @keyframes expandFrame {
      0% { transform: scale(0.5); opacity: 0; border-color: #6366f1; }
      50% { opacity: 1; border-color: #6366f1; }
      100% { transform: scale(1); opacity: 0.2; border-color: #334155; }
    }
    .animate-expand-frame { animation: expandFrame 1.5s ease-out forwards 1.5s; opacity: 0; }

    /* Component Mounting (Drop in) */
    @keyframes mountComponent {
      0% { transform: scale(0) translateY(-50px); opacity: 0; }
      60% { transform: scale(1.1) translateY(0); opacity: 1; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .animate-mount-component { animation: mountComponent 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 2s; opacity: 0; }

    /* General Fades */
    .animate-fade-in-delayed { animation: fadeIn 0.5s ease-out forwards 1s; opacity: 0; }
    .animate-slide-up-fade { animation: slideUpFade 0.8s ease-out forwards 2.5s; opacity: 0; }
    
    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes slideUpFade { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* Background Rain */
    @keyframes rain { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
    .animate-rain { animation: rain 3s linear infinite; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-700 { animation-delay: 0.7s; }
  `]
})
export class SplashScreenComponent implements OnInit {
  finished = output<void>();

  ngOnInit() {
    // Sequence duration ~ 3.5s
    setTimeout(() => {
      this.finished.emit();
    }, 3800);
  }
}