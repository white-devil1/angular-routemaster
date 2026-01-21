import { Component, output, OnInit } from '@angular/core';
import { AngularLogoComponent } from './svg/angular-logo.component';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [AngularLogoComponent],
  template: `
    <div class="fixed inset-0 z-[100] bg-[#000000] flex items-center justify-center overflow-hidden">
      
      <!-- === SCENE: THE ROUTING NETWORK === -->
      <div class="relative w-[100vw] h-[100vh] flex items-center justify-center perspective-container">

        <!-- 1. Background Grid (The Web) -->
        <div class="absolute inset-0 grid-floor opacity-20"></div>

        <!-- 2. Connection Paths (The Routes) -->
        <!-- Diagonal lines converging to center -->
        <div class="absolute w-[140vmax] h-[2px] bg-slate-800 rotate-45 transform origin-center"></div>
        <div class="absolute w-[140vmax] h-[2px] bg-slate-800 -rotate-45 transform origin-center"></div>
        
        <!-- 3. Moving Data Packets (Navigation Events) -->
        <!-- Packet 1: Top-Left -> Center (Blue) -->
        <div class="absolute top-1/2 left-1/2 w-32 h-[4px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-10 packet-1"></div>
        
        <!-- Packet 2: Bottom-Right -> Center (Pink) -->
        <div class="absolute top-1/2 left-1/2 w-32 h-[4px] bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent shadow-[0_0_15px_#d946ef] z-10 packet-2"></div>
        
        <!-- Packet 3: Top-Right -> Center (Yellow) -->
        <div class="absolute top-1/2 left-1/2 w-32 h-[4px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_15px_#facc15] z-10 packet-3"></div>
        
        <!-- Packet 4: Bottom-Left -> Center (Green) -->
        <div class="absolute top-1/2 left-1/2 w-32 h-[4px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] z-10 packet-4"></div>


        <!-- 4. The Central "Router Outlet" (The Frame) -->
        <div class="relative z-50">
          
          <!-- Outer Spinning Rings (Processing) -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-slate-700/50 rounded-full animate-spin-slow"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-t border-b border-indigo-500/30 rounded-full animate-spin-reverse"></div>

          <!-- The Core Container -->
          <div class="relative w-24 h-24 bg-[#0f172a] rounded-xl border border-slate-700 flex items-center justify-center shadow-2xl overflow-hidden core-container">
            
            <!-- Impact Flash (White screen overlay when packets hit) -->
            <div class="absolute inset-0 bg-white z-50 impact-flash opacity-0"></div>
            
            <!-- Inner Glow -->
            <div class="absolute inset-0 bg-indigo-900/20 core-glow"></div>

            <!-- THE ANGULAR LOGO (Reveals at end) -->
            <div class="w-14 h-14 relative z-20 logo-reveal opacity-0 scale-0">
               <app-angular-logo></app-angular-logo>
            </div>

            <!-- Loading Spinner (Initial State) -->
            <div class="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-xl animate-spin z-10 initial-loader"></div>
          </div>
          
          <!-- Final Shockwave -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-500 rounded-full opacity-0 shockwave"></div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* --- ANIMATIONS --- */

    /* 1. Packets Traveling */
    /* They start far away and converge to (0,0) center */
    
    .packet-1 {
      /* Top-Left (-100vw, -100vh) to Center */
      transform-origin: center right;
      animation: travel-tl 2.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards;
    }
    @keyframes travel-tl {
      0% { transform: translate(-100vw, -100vh) rotate(45deg) scaleX(1); opacity: 0; }
      10% { opacity: 1; }
      80% { transform: translate(-50px, -50px) rotate(45deg) scaleX(0.5); opacity: 1; }
      100% { transform: translate(0, 0) rotate(45deg) scaleX(0); opacity: 0; }
    }

    .packet-2 {
      /* Bottom-Right (100vw, 100vh) to Center */
      transform-origin: center left;
      animation: travel-br 2.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards 0.2s;
      opacity: 0;
    }
    @keyframes travel-br {
      0% { transform: translate(100vw, 100vh) rotate(45deg) scaleX(1); opacity: 0; }
      10% { opacity: 1; }
      80% { transform: translate(50px, 50px) rotate(45deg) scaleX(0.5); opacity: 1; }
      100% { transform: translate(0, 0) rotate(45deg) scaleX(0); opacity: 0; }
    }

    .packet-3 {
      /* Top-Right (100vw, -100vh) to Center */
      transform-origin: center right;
      animation: travel-tr 2.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards 0.5s;
      opacity: 0;
    }
    @keyframes travel-tr {
      0% { transform: translate(100vw, -100vh) rotate(-45deg) scaleX(1); opacity: 0; }
      10% { opacity: 1; }
      80% { transform: translate(50px, -50px) rotate(-45deg) scaleX(0.5); opacity: 1; }
      100% { transform: translate(0, 0) rotate(-45deg) scaleX(0); opacity: 0; }
    }

    .packet-4 {
      /* Bottom-Left (-100vw, 100vh) to Center */
      transform-origin: center left;
      animation: travel-bl 2.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards 0.8s;
      opacity: 0;
    }
    @keyframes travel-bl {
      0% { transform: translate(-100vw, 100vh) rotate(-45deg) scaleX(1); opacity: 0; }
      10% { opacity: 1; }
      80% { transform: translate(-50px, 50px) rotate(-45deg) scaleX(0.5); opacity: 1; }
      100% { transform: translate(0, 0) rotate(-45deg) scaleX(0); opacity: 0; }
    }

    /* 2. Core Reaction */
    .core-container {
      animation: core-shake 3s linear forwards;
    }
    @keyframes core-shake {
      0%, 80% { transform: scale(1); border-color: #334155; } /* Slate 700 */
      85% { transform: scale(1.1); border-color: #6366f1; box-shadow: 0 0 30px #6366f1; } /* Hit 1 */
      90% { transform: scale(1.15); border-color: #d946ef; box-shadow: 0 0 40px #d946ef; } /* Hit 2 */
      95% { transform: scale(1.2); border-color: #ffffff; box-shadow: 0 0 60px #ffffff; background: #fff; } /* Overload */
      100% { transform: scale(1.5); border-color: #ffffff; background: #0f172a; } /* Stabilize */
    }

    /* 3. Impact Flashes */
    .impact-flash {
      animation: flash-sequence 3s linear forwards;
    }
    @keyframes flash-sequence {
      0%, 80% { opacity: 0; }
      82% { opacity: 0.8; } /* Hit 1 */
      84% { opacity: 0; }
      88% { opacity: 0.8; } /* Hit 2 */
      90% { opacity: 0; }
      96% { opacity: 1; } /* Explosion */
      100% { opacity: 0; }
    }

    /* 4. Initial Loader (Disappears when Logo Appears) */
    .initial-loader {
      animation: spin 1s linear infinite, fade-out-loader 0.2s linear forwards 2.8s;
    }
    @keyframes fade-out-loader {
      to { opacity: 0; border-width: 0; }
    }

    /* 5. Logo Reveal (Final) */
    .logo-reveal {
      animation: logo-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 3s;
    }
    @keyframes logo-pop {
      from { opacity: 0; transform: scale(0); }
      to { opacity: 1; transform: scale(1); }
    }

    /* 6. Shockwave (Final Transition) */
    .shockwave {
      animation: expand-wave 0.8s ease-out forwards 3s;
    }
    @keyframes expand-wave {
      0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); border: 2px solid white; }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(30); border: 0px solid white; }
    }

    /* Utility Animations */
    .animate-spin-slow { animation: spin 10s linear infinite; }
    .animate-spin-reverse { animation: spin 15s linear infinite reverse; }
    @keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }

    /* Grid Background */
    .grid-floor {
      background-image: 
        linear-gradient(rgba(51, 65, 85, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(51, 65, 85, 0.3) 1px, transparent 1px);
      background-size: 50px 50px;
    }
  `]
})
export class SplashScreenComponent implements OnInit {
  finished = output<void>();

  ngOnInit() {
    // Total animation sequence is roughly 3.5s
    // 0-2.5s: Packets travel
    // 3.0s: Explosion/Logo Reveal
    // 3.5s: Stabilize
    // 4.0s: Emit Finish
    setTimeout(() => {
      this.finished.emit();
    }, 4000);
  }
}