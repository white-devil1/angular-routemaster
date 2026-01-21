import { Component, output, OnInit } from '@angular/core';
import { AngularLogoComponent } from './svg/angular-logo.component';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [AngularLogoComponent],
  template: `
    <div class="fixed inset-0 z-[100] bg-[#020617] text-white overflow-hidden font-sans flex flex-col items-center justify-center perspective-container">
      
      <!-- === BACKGROUND LAYERS === -->
      
      <!-- 1. Deep Space Gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#020617] to-black"></div>
      
      <!-- 2. Moving 3D Grid Floor -->
      <div class="absolute bottom-0 w-[200vw] h-[100vh] origin-bottom transform-gpu grid-floor opacity-20"></div>

      <!-- 3. Ambient Spotlights -->
      <div class="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 blur-[100px] rounded-full animate-pulse-slow"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-pink-600/20 blur-[100px] rounded-full animate-pulse-slow delay-1000"></div>


      <!-- === CONTENT === -->
      <div class="relative z-10 flex flex-col items-center justify-center">
        
        <!-- Logo Assembly -->
        <div class="relative mb-12">
          
          <!-- Glowing Core Behind Logo -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/40 blur-[50px] animate-core-pulse"></div>

          <!-- Orbiting Rings -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-500/30 rounded-full border-t-transparent animate-spin-slow"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-pink-500/20 rounded-full border-b-transparent animate-spin-reverse"></div>
          
          <!-- Floating Logo -->
          <div class="w-32 h-32 md:w-40 md:h-40 relative z-10 animate-float filter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
             <app-angular-logo></app-angular-logo>
          </div>
        </div>

        <!-- Typography -->
        <div class="text-center space-y-4 relative">
           <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400 animate-title-reveal drop-shadow-2xl">
             RouteMaster
           </h1>
           
           <div class="flex items-center justify-center gap-2 overflow-hidden">
             <div class="h-[1px] w-12 bg-gradient-to-r from-transparent to-indigo-500"></div>
             <p class="font-mono text-xs md:text-sm text-indigo-400 tracking-[0.3em] uppercase animate-subtitle-reveal">
               System Initialization
             </p>
             <div class="h-[1px] w-12 bg-gradient-to-l from-transparent to-indigo-500"></div>
           </div>
        </div>

        <!-- Progress Loader -->
        <div class="mt-12 w-64 md:w-96 h-1 bg-slate-800 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(99,102,241,0.2)]">
           <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-progress-bar w-full origin-left"></div>
           <!-- Scanner Light -->
           <div class="absolute inset-y-0 w-20 bg-white/50 blur-md animate-scan-line"></div>
        </div>

        <!-- Code Stream (Decorative) -->
        <div class="absolute bottom-[-100px] font-mono text-[10px] text-green-500/20 select-none pointer-events-none whitespace-pre text-center animate-fade-in-up">
           LOADING_MODULES: [ROUTER, SIGNALS, RXJS]...
           OPTIMIZING_BUNDLES... 
           ESTABLISHING_UPLINK...
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* 3D Grid Floor Effect */
    .perspective-container {
      perspective: 1000px;
    }
    .grid-floor {
      background-image: 
        linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px);
      background-size: 40px 40px;
      transform: rotateX(60deg) translateY(0);
      animation: gridScroll 20s linear infinite;
      mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
    }

    @keyframes gridScroll {
      0% { background-position: 0 0; }
      100% { background-position: 0 1000px; }
    }

    /* Floating Logo */
    @keyframes float {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-15px) scale(1.05); }
    }
    .animate-float { animation: float 4s ease-in-out infinite; }

    /* Pulse Core */
    @keyframes corePulse {
      0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.5); }
    }
    .animate-core-pulse { animation: corePulse 3s ease-in-out infinite; }

    /* Rings */
    .animate-spin-slow { animation: spin 8s linear infinite; }
    .animate-spin-reverse { animation: spin 12s linear infinite reverse; }
    @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }

    /* Typography Reveal */
    @keyframes titleReveal {
      0% { opacity: 0; transform: translateY(20px) scale(0.9); filter: blur(10px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }
    .animate-title-reveal { animation: titleReveal 1s cubic-bezier(0.2, 1, 0.3, 1) forwards; }

    @keyframes subtitleReveal {
      0% { opacity: 0; letter-spacing: 0em; }
      100% { opacity: 1; letter-spacing: 0.3em; }
    }
    .animate-subtitle-reveal { animation: subtitleReveal 1.5s ease-out forwards 0.5s; opacity: 0; }

    /* Progress Bar */
    @keyframes progressBar {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }
    .animate-progress-bar { animation: progressBar 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

    @keyframes scanLine {
      0% { left: -20%; }
      100% { left: 120%; }
    }
    .animate-scan-line { animation: scanLine 2s linear infinite; }

    /* Code Stream */
    .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards 1s; opacity: 0; }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .delay-1000 { animation-delay: 1s; }
  `]
})
export class SplashScreenComponent implements OnInit {
  finished = output<void>();

  ngOnInit() {
    // Show splash for 3.0 seconds (slightly longer for dramatic effect) then emit finished
    setTimeout(() => {
      this.finished.emit();
    }, 3000);
  }
}