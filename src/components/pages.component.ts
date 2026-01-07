import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

// --- EXISTING COMPONENTS ---
@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <div class="h-full bg-blue-100 p-6 rounded-lg border-4 border-blue-500 text-center animate-fade-in">
      <div class="text-6xl mb-4">🏠</div>
      <h2 class="text-2xl font-bold text-blue-900">Home Page</h2>
      <p class="text-blue-700 mt-2">I am the Home Component.</p>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; } .animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`]
})
export class HomePageComponent {}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  template: `
    <div class="h-full bg-indigo-100 p-6 rounded-lg border-4 border-indigo-500 text-center animate-fade-in">
      <div class="text-6xl mb-4">📊</div>
      <h2 class="text-2xl font-bold text-indigo-900">Dashboard</h2>
      <p class="text-indigo-700 mt-2">I am the Dashboard.</p>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; } .animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`]
})
export class DashboardPageComponent {}

@Component({
  selector: 'app-settings-page',
  standalone: true,
  template: `
    <div class="h-full bg-purple-100 p-6 rounded-lg border-4 border-purple-500 text-center animate-fade-in">
      <div class="text-6xl mb-4">⚙️</div>
      <h2 class="text-2xl font-bold text-purple-900">Settings</h2>
      <p class="text-purple-700 mt-2">Configuration Page.</p>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; } .animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`]
})
export class SettingsPageComponent {}

// --- NEW COMPONENT FOR PARAMETERS ---
@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-full bg-fuchsia-100 p-6 rounded-lg border-4 border-fuchsia-500 text-center animate-fade-in flex flex-col items-center justify-center">
      <div class="w-24 h-24 rounded-full bg-fuchsia-200 border-4 border-fuchsia-400 flex items-center justify-center text-4xl mb-4 shadow-lg">
        👤
      </div>
      <h2 class="text-2xl font-bold text-fuchsia-900">User Profile</h2>
      
      <div class="mt-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-fuchsia-200">
        <span class="text-gray-500 text-sm uppercase font-bold tracking-wider">Current ID</span>
        <div class="text-3xl font-mono text-fuchsia-600 font-bold">
          {{ userId() || '...' }}
        </div>
      </div>
      
      <div class="mt-4 flex gap-2">
         <a routerLink="../1" class="text-xs underline text-fuchsia-700">User 1</a>
         <a routerLink="../99" class="text-xs underline text-fuchsia-700">User 99</a>
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; } .animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`]
})
export class UserPageComponent {
  private route = inject(ActivatedRoute);
  userId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
}

// --- NEW COMPONENT FOR WILDCARD / 404 ---
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="h-full bg-red-50 p-6 rounded-lg border-4 border-dashed border-red-400 text-center animate-shake flex flex-col items-center justify-center">
      <div class="text-6xl mb-2">🚫</div>
      <h2 class="text-3xl font-black text-red-600">404 Error</h2>
      <p class="text-red-800 font-bold mt-2">Page Not Found!</p>
      <p class="text-red-600 text-sm mt-2 max-w-xs">
        The Router didn't find a match for this URL, so it loaded the <b>Wildcard Route (**)</b>.
      </p>
      <a routerLink="/home" class="mt-4 px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700">Go Home</a>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; } 
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
    .animate-shake { animation: shake 0.4s ease-in-out; }
  `]
})
export class NotFoundComponent {}