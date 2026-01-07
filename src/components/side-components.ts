import { Component } from '@angular/core';

// --- LEFT OUTLET COMPONENTS ---

@Component({
  selector: 'app-menu-sidebar',
  standalone: true,
  template: `
    <div class="h-full bg-green-100 p-4 border-4 border-green-600 rounded">
      <h3 class="font-bold text-green-900 text-lg">🍔 Menu</h3>
      <ul class="list-disc ml-5 text-green-800 mt-2 space-y-1">
        <li><a href="#" class="underline">Profile</a></li>
        <li><a href="#" class="underline">History</a></li>
        <li><a href="#" class="underline">Logout</a></li>
      </ul>
      <p class="mt-4 text-xs text-green-700 bg-white/50 p-1">Outlet: 'left'</p>
    </div>
  `
})
export class MenuSidebarComponent {}

@Component({
  selector: 'app-ads-sidebar',
  standalone: true,
  template: `
    <div class="h-full bg-yellow-100 p-4 border-4 border-yellow-600 rounded">
      <h3 class="font-bold text-yellow-900 text-lg">📢 Promo</h3>
      <div class="w-full h-24 bg-yellow-300 mt-2 rounded flex items-center justify-center font-mono text-yellow-800 font-bold border-2 border-dashed border-yellow-500">
        BUY NOW
      </div>
      <p class="mt-4 text-xs text-yellow-700 bg-white/50 p-1">Outlet: 'left'</p>
    </div>
  `
})
export class AdsSidebarComponent {}

// --- RIGHT OUTLET COMPONENTS ---

@Component({
  selector: 'app-help-sidebar',
  standalone: true,
  template: `
    <div class="h-full bg-red-100 p-4 border-4 border-red-600 rounded">
      <h3 class="font-bold text-red-900 text-lg">❓ Help</h3>
      <p class="text-red-800 mt-2 text-sm">Need assistance? Here are some common topics.</p>
      <div class="mt-4 bg-white p-2 rounded shadow-sm text-xs text-red-700">
        Click the 'X' button above to close this panel.
      </div>
    </div>
  `
})
export class HelpSidebarComponent {}

@Component({
  selector: 'app-notes-sidebar',
  standalone: true,
  template: `
    <div class="h-full bg-orange-100 p-4 border-4 border-orange-600 rounded relative">
      <div class="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full p-2 shadow">📝</div>
      <h3 class="font-bold text-orange-900 text-lg">Notes</h3>
      <textarea class="w-full h-32 mt-2 p-2 text-sm border border-orange-300 rounded resize-none" placeholder="Type quick notes here..."></textarea>
      <p class="mt-2 text-xs text-orange-700">Outlet: 'right'</p>
    </div>
  `
})
export class NotesSidebarComponent {}