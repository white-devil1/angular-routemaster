import { Injectable, signal, computed, inject } from '@angular/core';
import { LanguageService } from './language.service';

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface TutorialStep {
  id: number;
  module: string;
  title: string;
  content: string; 
  codeSnippet: string; 
  focusArea: 'intro' | 'primary' | 'active' | 'params' | 'wildcard' | 'left' | 'right' | 'url' | 'guards' | 'lazy';
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private langService = inject(LanguageService);
  
  private _currentStepIndex = signal(0);
  currentLevel = signal<Level>('beginner');

  // --- CONTENT HELPER ---
  private t(data: {
    beginner: { en: string, hi: string, ml: string },
    intermediate: { en: string, hi: string, ml: string },
    advanced: { en: string, hi: string, ml: string },
    professional: { en: string, hi: string, ml: string }
  }): string {
    const lang = this.langService.currentLang();
    const level = this.currentLevel();
    return data[level][lang];
  }

  // --- CODE HELPER ---
  private c(data: { beginner: string, intermediate: string, advanced: string, professional: string }): string {
    return data[this.currentLevel()];
  }

  readonly steps = computed<TutorialStep[]>(() => {
    return [
      // =================================================================================================
      // STEP 1: INTRO (THE FRAME)
      // =================================================================================================
      {
        id: 1,
        module: 'Foundations',
        title: this.t({
          beginner: { en: 'The Magic Picture Frame', hi: 'जादुई तस्वीर का फ्रेम', ml: 'മാജിക്കൽ ഫോട്ടോ ഫ്രെയിം' },
          intermediate: { en: 'The Router Outlet', hi: 'राउटर आउटलेट', ml: 'റൗട്ടർ ഔട്ട്ലെറ്റ്' },
          advanced: { en: 'Dynamic View Loading', hi: 'डायनामिक व्यू लोडिंग', ml: 'ഡൈനാമിക് വ്യൂ ലോഡിംഗ്' },
          professional: { en: 'ViewContainerRef Architecture', hi: 'ViewContainerRef आर्किटेक्चर', ml: 'ViewContainerRef ആർക്കിടെക്ചർ' }
        }),
        focusArea: 'intro',
        codeSnippet: this.c({
          beginner: `<!-- STEP 1: Place the frame on the wall -->\n<router-outlet></router-outlet>`,
          intermediate: `<!-- app.component.html -->\n<header>My App</header>\n<router-outlet></router-outlet>\n<footer>Copyright</footer>`,
          advanced: `// The directive selector matches this tag\n@Directive({ selector: 'router-outlet' })\nexport class RouterOutlet implements OnDestroy, OnInit { ... }`,
          professional: `// Internal Logic\nthis.viewContainerRef.createComponent(factory, index, injector);`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Imagine a Magic Frame</h3>
              <p class="mb-3">Think of your house. You have a wall. On that wall, you hang a <strong>Magic Picture Frame</strong>.</p>
              <ul class="list-disc ml-5 space-y-2 mb-4">
                <li>Normally, if you want to see a new photo, you have to take the frame down, open the back, swap the photo, and hang it up again. That takes a long time! (This is how old websites worked).</li>
                <li>With the <strong>Magic Frame</strong>, you just press a button on a remote, and the photo changes <em>instantly</em>. The wall doesn't move. The frame doesn't move. Only the picture inside changes.</li>
              </ul>
              <p>In Angular, this frame is called <code>&lt;router-outlet&gt;</code>. It creates a space on the screen where different pages can appear without reloading the whole computer.</p>
            `,
            hi: `एक जादुई फ्रेम की कल्पना करें। एंगुलर में, इसे <code>&lt;router-outlet&gt;</code> कहा जाता है।`,
            ml: `ഒരു മാജിക്കൽ ഫ്രെയിം സങ്കൽപ്പിക്കുക. ആംഗുലറിൽ ഇതിനെ <code>&lt;router-outlet&gt;</code> എന്ന് വിളിക്കുന്നു.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">What is it really?</h3>
              <p class="mb-3">The <code>&lt;router-outlet&gt;</code> is a placeholder directive. It tells Angular: <em>"Dynamically render the active component right here."</em></p>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <strong class="text-indigo-800">✅ Pros (Why use it?)</strong>
                  <ul class="list-disc ml-4 text-sm mt-1">
                    <li><strong>No White Flash:</strong> The page doesn't blink or go white when navigating.</li>
                    <li><strong>Speed:</strong> We only fetch data, not the entire HTML page structure.</li>
                    <li><strong>State:</strong> Variables in your header/sidebar stay alive.</li>
                  </ul>
                </div>
                <div class="bg-red-50 p-3 rounded-lg border border-red-100">
                   <strong class="text-red-800">❌ Cons</strong>
                   <ul class="list-disc ml-4 text-sm mt-1">
                     <li><strong>Complexity:</strong> Harder to setup than basic HTML files.</li>
                     <li><strong>SEO:</strong> Search engines need help to read these dynamic pages (SSR).</li>
                   </ul>
                </div>
              </div>
              <p><strong>Where to use:</strong> In your <code>app.component.html</code> to act as the main stage for your application.</p>
            `,
            hi: `<code>&lt;router-outlet&gt;</code> एक प्लेसहोल्डर डायरेक्टिव है। यह एंगुलर को सक्रिय घटक को यहाँ रेंडर करने के लिए कहता है।`,
            ml: `<code>&lt;router-outlet&gt;</code> ഒരു പ്ലേസ്‌ഹോൾഡർ ഡയറക്‌ടീവ് ആണ്. ആക്റ്റീവ് കംപോണന്റിനെ ഇവിടെ റെൻഡർ ചെയ്യാൻ ഇത് ആംഗുലറിനോട് പറയുന്നു.`
          },
          advanced: {
            en: `
              <p class="mb-3">The <code>RouterOutlet</code> is a structural directive that acts as a sink for the instantiated component. When a route is matched, the Router looks for the nearest outlet in the component tree.</p>
              <p class="mb-3">Technically, it creates a <strong>Sibling</strong> of the outlet tag in the DOM, not a child. This is a common misconception.</p>
              <div class="p-3 bg-slate-100 rounded border border-slate-200 text-sm">
                <strong>Key Concept:</strong> Outlets can be nested. A parent component can have an outlet, and the child component loaded into that outlet can have <em>another</em> outlet. This creates a hierarchy of views.
              </div>
            `,
            hi: `<code>RouterOutlet</code> एक स्ट्रक्चरल डायरेक्टिव है। जब कोई रूट मेल खाता है, तो राउटर घटक ट्री में निकटतम आउटलेट की तलाश करता है।`,
            ml: `<code>RouterOutlet</code> ഒരു സ്ട്രക്ച്ചറൽ ഡയറക്റ്റീവ് ആണ്. റൂട്ട് മാച്ച് ആകുമ്പോൾ, റൗട്ടർ ഏറ്റവും അടുത്തുള്ള ഔട്ട്ലെറ്റ് കണ്ടെത്തുന്നു.`
          },
          professional: {
            en: `
              <p>Under the hood, <code>RouterOutlet</code> interacts with <code>ChildrenOutletContexts</code> to store the state of the component. It uses <code>ViewContainerRef.createComponent</code> to instantiate the routed component.</p>
              <p>When you navigate away, the default behavior is to <strong>destroy</strong> the component. However, if a custom <code>RouteReuseStrategy</code> is implemented, the outlet will <strong>detach</strong> the view (keeping it in memory) instead of destroying it. This allows for instant restoration of state when navigating back.</p>
            `,
            hi: `आंतरिक रूप से, <code>RouterOutlet</code> घटक की स्थिति को संग्रहीत करने के लिए <code>ChildrenOutletContexts</code> के साथ इंटरैक्ट करता है।`,
            ml: `<code>RouterOutlet</code> കംപോണന്റ് സ്റ്റേറ്റ് സൂക്ഷിക്കാൻ <code>ChildrenOutletContexts</code> ഉപയോഗിക്കുന്നു. <code>ViewContainerRef</code> വഴിയാണ് കംപോണന്റ് ഉണ്ടാക്കുന്നത്.`
          }
        })
      },

      // =================================================================================================
      // STEP 2: CONFIGURATION (THE MAP)
      // =================================================================================================
      {
        id: 2,
        module: 'Foundations',
        title: this.t({
          beginner: { en: 'The Treasure Map', hi: 'खजाने का नक्शा', ml: 'നിധി ഭൂപടം' },
          intermediate: { en: 'Routes Configuration', hi: 'रूट विन्यास', ml: 'റൂട്ട് കോൺഫിഗറേഷൻ' },
          advanced: { en: 'Route Definitions', hi: 'रूट परिभाषाएँ', ml: 'റൂട്ട് ഡെഫിനിഷൻസ്' },
          professional: { en: 'Tree Matching Algorithm', hi: 'ट्री मिलान एल्गोरिदम', ml: 'ട്രീ മാച്ചിംഗ് അൽഗോരിതം' }
        }),
        focusArea: 'url',
        codeSnippet: this.c({
          beginner: `// Tell the frame what to show\nIf URL is "home" -> Show HomePicture\nIf URL is "dashboard" -> Show GraphPicture`,
          intermediate: `const routes: Routes = [\n  { path: 'home', component: HomeComponent },\n  { path: 'dashboard', component: DashboardComponent },\n  { path: '', redirectTo: 'home', pathMatch: 'full' }\n];`,
          advanced: `export const routes: Routes = [\n  {\n    path: 'admin',\n    loadChildren: () => import('./admin/routes')\n  },\n  { path: 'home', component: HomeComponent, title: 'Welcome' }\n];`,
          professional: `// The config is a recursive tree structure.\n// 'pathMatch: full' ensures exact URL matching for redirects.\n// Empty path '' routes are often used for layout wrappers.`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Giving Directions</h3>
              <p class="mb-3">Imagine you invite a robot to your house. The robot doesn't know where the kitchen is. You have to give it a <strong>Map</strong>.</p>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                 <p class="font-mono text-sm text-slate-600">
                   • If I say "Kitchen" -> Go to Room A.<br>
                   • If I say "Bedroom" -> Go to Room B.<br>
                   • If I say nothing -> Go to the Living Room (Default).
                 </p>
              </div>
              <p>In Angular, this map is a list called <code>routes</code>. It connects a <strong>word</strong> in the address bar (like '/home') to a <strong>picture</strong> (Component) to show in the frame.</p>
            `,
            hi: `कल्पना कीजिए कि आप एक रोबोट को अपने घर आमंत्रित करते हैं। आपको उसे एक <strong>नक्शा</strong> देना होगा।`,
            ml: `നിങ്ങൾ ഒരു റോബോട്ടിനെ വീട്ടിലേക്ക് ക്ഷണിക്കുന്നു. അതിന് അടുക്കള എവിടെയാണെന്ന് അറിയില്ല. നിങ്ങൾ അതിനൊരു <strong>മാപ്പ്</strong> നൽകണം.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Routes Array</h3>
              <p class="mb-3">We configure the router by creating an array of objects. Each object needs two main things:</p>
              <ul class="list-disc ml-5 space-y-2 mb-4">
                <li><code>path</code>: The string in the URL (e.g., 'dashboard').</li>
                <li><code>component</code>: The class name of the page to load (e.g., DashboardComponent).</li>
              </ul>
              <p class="mb-2"><strong>Special Case: Redirects</strong></p>
              <p>When the user opens the app, the path is empty (<code>''</code>). We usually want to auto-forward them to the home page. We use <code>redirectTo: 'home'</code> and <code>pathMatch: 'full'</code>.</p>
            `,
            hi: `हम वस्तुओं की एक सरणी बनाकर राउटर को कॉन्फ़िगर करते हैं। प्रत्येक वस्तु को दो मुख्य चीजों की आवश्यकता होती है: path और component।`,
            ml: `നമ്മൾ ഒബ്ജക്റ്റുകളുടെ ഒരു അറേ ഉണ്ടാക്കുന്നു. ഓരോ ഒബ്ജക്റ്റിനും path ഉം component ഉം ആവശ്യമാണ്.`
          },
          advanced: {
            en: `
              <p class="mb-3">The <code>pathMatch: 'full'</code> property is critical. Without it, the router matches by "prefix".</p>
              <p class="mb-3">Since the empty string <code>''</code> is a prefix of <em>every</em> string, a default route without <code>pathMatch: 'full'</code> would match every single URL, causing an infinite loop or loading the wrong page!</p>
              <p><strong>Where to use:</strong> In your <code>app.routes.ts</code> or <code>app-routing.module.ts</code>.</p>
            `,
            hi: `<code>pathMatch: 'full'</code> गुण महत्वपूर्ण है। इसके बिना, राउटर "prefix" द्वारा मेल खाता है।`,
            ml: `<code>pathMatch: 'full'</code> വളരെ പ്രധാനമാണ്. ഇതില്ലെങ്കിൽ റൗട്ടർ തെറ്റായ പേജ് ലോഡ് ചെയ്തേക്കാം.`
          },
          professional: {
            en: `
              <p>The Router uses a <strong>Depth-First, First-Match-Wins</strong> strategy. This means the <em>order</em> of your routes matters immensely.</p>
              <p>If you define a generic route (like a wildcard) before a specific route, the specific route will never be reachable. Angular parses the URL into a <code>UrlTree</code> and attempts to match segments against the configuration nodes recursively.</p>
            `,
            hi: `राउटर <strong>Depth-First, First-Match-Wins</strong> रणनीति का उपयोग करता है। इसका मतलब है कि आपके मार्गों का क्रम बहुत मायने रखता है।`,
            ml: `റൗട്ടർ <strong>Depth-First, First-Match-Wins</strong> സ്ട്രാറ്റജി ഉപയോഗിക്കുന്നു. റൂട്ടുകളുടെ ഓർഡർ വളരെ പ്രധാനമാണ്.`
          }
        })
      },

      // =================================================================================================
      // STEP 3: NAVIGATION (LINKS)
      // =================================================================================================
      {
        id: 3,
        module: 'Foundations',
        title: this.t({
          beginner: { en: 'The Teleport Button', hi: 'टेलीपोर्ट बटन', ml: 'ടെലിപോർട്ട് ബട്ടൺ' },
          intermediate: { en: 'RouterLink vs Href', hi: 'RouterLink बनाम Href', ml: 'RouterLink vs Href' },
          advanced: { en: 'Programmatic Navigation', hi: 'प्रोग्रामेटिक नेविगेशन', ml: 'പ്രോഗ്രാമാറ്റിക് നാവിഗേഷൻ' },
          professional: { en: 'Navigation Lifecycle', hi: 'नेविगेशन जीवनचक्र', ml: 'നാവിഗേഷൻ ലൈഫ്സൈക്കിൾ' }
        }),
        focusArea: 'primary',
        codeSnippet: this.c({
          beginner: `<!-- A button that changes the channel -->\n<button routerLink="/home">Go Home</button>`,
          intermediate: `<!-- Standard HTML vs Angular -->\n<!-- DON'T DO THIS (Reloads page): <a href="/home"> -->\n<a routerLink="/home">Home</a>`,
          advanced: `// Programmatic navigation in Class\nthis.router.navigate(['/home']);\n\n// Template with parameters\n<a [routerLink]="['/user', userId]">User Profile</a>`,
          professional: `// Relative Navigation\nthis.router.navigate(['../', 'sibling'], { relativeTo: this.route });\n\n// URL Creation Strategy\nconst urlTree = this.router.createUrlTree(['/home'], { queryParams: { ref: 'email' } });`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Don't Walk, Teleport!</h3>
              <p class="mb-3">In a normal website, clicking a link is like walking to a new house. You have to pack your bags, leave, walk, and enter the new house. This takes time (the screen flashes white).</p>
              <p class="mb-3">In Angular, we use a special sticker called <code>routerLink</code>.</p>
              <ul class="list-disc ml-5 space-y-2 mb-4">
                <li>It works like a <strong>Teleporter</strong>.</li>
                <li>You press the button, and <em>BAM!</em> You are there instantly.</li>
                <li>You don't lose the things you were holding in your memory.</li>
              </ul>
              <p><strong>Try it:</strong> Click the 'Home' and 'Dash' buttons in the playground. Notice how the screen doesn't blink?</p>
            `,
            hi: `एक सामान्य वेबसाइट में, लिंक पर क्लिक करना एक नए घर में जाने जैसा है। एंगुलर में, हम <code>routerLink</code> का उपयोग करते हैं। यह एक टेलीपोर्टर की तरह काम करता है।`,
            ml: `സാധാരണ വെബ്സൈറ്റുകളിൽ ലിങ്ക് ക്ലിക്ക് ചെയ്യുമ്പോൾ പുതിയ വീട്ടിലേക്ക് നടന്നുപോകുന്ന പോലെയാണ്. എന്നാൽ ആംഗുലറിൽ <code>routerLink</code> ഉപയോഗിക്കുമ്പോൾ ടെലിപോർട്ട് ചെയ്യുന്നത് പോലെ തൽസമയം എത്താം.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">href vs routerLink</h3>
              <p class="mb-3">This is the most common interview question.</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="bg-red-50 p-3 rounded-lg border border-red-100">
                  <strong class="text-red-800">HTML (href="/home")</strong>
                  <p class="text-sm mt-1">Triggers a standard browser request. The browser destroys the current page, downloads index.html again, and restarts Angular. <strong>Slow. loses state.</strong></p>
                </div>
                <div class="bg-green-50 p-3 rounded-lg border border-green-100">
                   <strong class="text-green-800">Angular (routerLink="/home")</strong>
                   <p class="text-sm mt-1">Intercepts the click. It prevents the browser from reloading. It tells the Angular Router to just swap the component. <strong>Fast. keeps state.</strong></p>
                </div>
              </div>
            `,
            hi: `यह सबसे आम साक्षात्कार प्रश्न है: href बनाम routerLink। href धीमा है और स्थिति खो देता है। routerLink तेज़ है और स्थिति रखता है।`,
            ml: `ഇതൊരു പ്രധാന ഇന്റർവ്യൂ ചോദ്യമാണ്. href പേജ് റീലോഡ് ചെയ്യുന്നു, അതിനാൽ സ്ലോ ആണ്. routerLink പേജ് റീലോഡ് ചെയ്യാതെ കംപോണന്റ് മാറ്റുന്നു, അതിനാൽ ഫാസ്റ്റ് ആണ്.`
          },
          advanced: {
            en: `
              <p class="mb-3">You can also navigate using TypeScript code (e.g., after a user logs in). Use the <code>Router.navigate()</code> method.</p>
              <p class="mb-3">You should pass an <strong>array of segments</strong> instead of a string: <code>['/user', 5]</code>. Angular will automatically encode unsafe characters for you (handling spaces, special symbols, etc.), preventing URL errors.</p>
              <p><strong>Use Case:</strong> Redirecting a user after they successfully submit a form.</p>
            `,
            hi: `आप TypeScript कोड का उपयोग करके भी नेविगेट कर सकते हैं। <code>Router.navigate()</code> विधि का उपयोग करें।`,
            ml: `ലോഗിൻ ചെയ്ത ശേഷം പേജ് മാറ്റാൻ TypeScript കോഡ് വഴി സാധിക്കും. ഇതിനായി <code>Router.navigate()</code> ഉപയോഗിക്കാം.`
          },
          professional: {
            en: `
              <p>When navigation occurs, a complex lifecycle triggers:</p>
              <ol class="list-decimal ml-5 space-y-1 mb-4 text-sm">
                <li><strong>URL Parsing:</strong> Convert string to UrlTree.</li>
                <li><strong>Recognition:</strong> Find matching config.</li>
                <li><strong>Guards:</strong> Check CanDeactivate (current) and CanActivate (next).</li>
                <li><strong>Resolution:</strong> Fetch data (Resolvers).</li>
                <li><strong>Activation:</strong> Instantiate components and render view.</li>
              </ol>
              <p>Using <code>href</code> bypasses all of this, breaking your application logic.</p>
            `,
            hi: `जब नेविगेशन होता है, तो एक जटिल जीवनचक्र ट्रिगर होता है: URL पार्सिंग, मान्यता, गार्ड, संकल्प, और सक्रियण।`,
            ml: `നാവിഗേഷൻ നടക്കുമ്പോൾ പല കാര്യങ്ങൾ സംഭവിക്കുന്നു: URL പാർസിംഗ്, മാച്ചിംഗ്, ഗാർഡുകൾ, റിസോൾവറുകൾ, ആക്റ്റിവേഷൻ.`
          }
        })
      },

      // =================================================================================================
      // STEP 4: PARAMETERS
      // =================================================================================================
      {
        id: 4,
        module: 'Dynamic Data',
        title: this.t({
          beginner: { en: 'The Form Letter', hi: 'फॉर्म लेटर', ml: 'ഫോം ലെറ്റർ' },
          intermediate: { en: 'Route Parameters', hi: 'रूट पैरामीटर', ml: 'റൂട്ട് പാരാമീറ്ററുകൾ' },
          advanced: { en: 'ActivatedRoute & Observables', hi: 'ActivatedRoute और Observables', ml: 'ActivatedRoute & Observables' },
          professional: { en: 'State Reactivity', hi: 'स्थिति प्रतिक्रियाशीलता', ml: 'സ്റ്റേറ്റ് റിയാക്റ്റിവിറ്റി' }
        }),
        focusArea: 'params',
        codeSnippet: this.c({
          beginner: `<!-- In the browser bar: /user/1 -->\n<!-- In the code: -->\nShow user with ID: 1`,
          intermediate: `// Route Config\n{ path: 'user/:id', component: UserProfile }\n\n// If URL is /user/42, then :id = 42`,
          advanced: `export class UserComponent {\n  private route = inject(ActivatedRoute);\n  // Get the ID as a signal\n  userId = toSignal(this.route.paramMap.pipe(map(p => p.get('id'))));\n}`,
          professional: `// CRITICAL: Always use Observables/Signals for params.\n// If you navigate from /user/1 to /user/2, the Component is REUSED.\n// The constructor runs only once. Only the Observable emits the new ID.`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Don't Write 1,000 Letters</h3>
              <p class="mb-3">Imagine you want to send a letter to 1,000 friends. Do you hand-write 1,000 completely different letters?</p>
              <p class="mb-3">No! You write <strong>one</strong> letter and leave a blank space for the name: <em>"Dear [Name]..."</em>.</p>
              <ul class="list-disc ml-5 space-y-2 mb-4">
                <li>In Angular, we create <strong>one</strong> page called <code>UserPage</code>.</li>
                <li>We leave a blank space in the URL: <code>/user/:id</code>.</li>
                <li>When you visit <code>/user/1</code>, Angular fills the blank with "1". When you visit <code>/user/99</code>, it fills it with "99".</li>
              </ul>
              <p><strong>Try it:</strong> Click the User 1 and User 99 buttons. It's the same page, just different data!</p>
            `,
            hi: `कल्पना कीजिए कि आप 1,000 दोस्तों को पत्र भेजना चाहते हैं। क्या आप 1,000 अलग-अलग पत्र लिखते हैं? नहीं! आप एक पत्र लिखते हैं और नाम के लिए खाली जगह छोड़ देते हैं।`,
            ml: `1000 കൂട്ടുകാർക്ക് കത്തെഴുതുമ്പോൾ നമ്മൾ 1000 കത്തെഴുതാറില്ല. ഒരെണ്ണം എഴുതി പേര് മാത്രം മാറ്റും. ആംഗുലറിലും ഇതുപോലെ ഒരു പേജ് ഉണ്ടാക്കി വിവരങ്ങൾ മാത്രം മാറ്റുന്നു.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Defining Parameters</h3>
              <p class="mb-3">We use a colon <code>:</code> to define a parameter in our route config.</p>
              <code class="block bg-slate-100 p-2 rounded mb-3">{ path: 'user/:id', component: UserComponent }</code>
              <p class="mb-3">This tells Angular: <em>"Whatever is in this position of the URL, capture it and call it 'id'."</em></p>
              <p><strong>Use Cases:</strong></p>
              <ul class="list-disc ml-5 mb-4 text-sm">
                <li>Product Details (<code>/product/4502</code>)</li>
                <li>Order History (<code>/orders/AX-99</code>)</li>
                <li>Blog Posts (<code>/blog/how-to-code</code>)</li>
              </ul>
            `,
            hi: `हम अपने रूट कॉन्फ़िगरेशन में पैरामीटर को परिभाषित करने के लिए कोलन <code>:</code> का उपयोग करते हैं।`,
            ml: `റൂട്ട് കോൺഫിഗറേഷനിൽ പാരാമീറ്റർ ഡിഫൈൻ ചെയ്യാൻ നമ്മൾ കോളൻ <code>:</code> ഉപയോഗിക്കുന്നു.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Snapshot Trap</h3>
              <p class="mb-3">You can read the ID in two ways:</p>
              <ol class="list-decimal ml-5 space-y-2 mb-4 text-sm">
                <li><code>route.snapshot.paramMap</code>: Reads the ID <strong>once</strong> when the component is created.</li>
                <li><code>route.paramMap.subscribe()</code>: Listens for <strong>changes</strong> to the ID.</li>
              </ol>
              <p><strong>Warning:</strong> If you use snapshot, and the user clicks from "User 1" to "User 2", the page <strong>won't update</strong> because Angular reuses the component to save energy. Always use the Observable/Signal approach!</p>
            `,
            hi: `आप आईडी को दो तरीकों से पढ़ सकते हैं: snapshot और subscribe। यदि आप snapshot का उपयोग करते हैं, तो पेज अपडेट नहीं होगा।`,
            ml: `ഐഡി രണ്ട് രീതിയിൽ വായിക്കാം: snapshot ഉം subscribe ഉം. snapshot ഉപയോഗിച്ചാൽ പേജ് അപ്ഡേറ്റ് ആകില്ല.`
          },
          professional: {
            en: `
              <p class="mb-3">Angular's <strong>Route Reuse Strategy</strong> is a performance optimization. Destroying and recreating components and DOM nodes is expensive.</p>
              <p>When only the route parameters change (same component class), Angular keeps the instance alive. This means <code>ngOnInit</code> is NOT called again. You must design your components to be <strong>reactive</strong>. Instead of fetching data once in <code>ngOnInit</code>, you should use a <code>switchMap</code> on the params observable to fetch new data whenever the ID changes.</p>
            `,
            hi: `एंगुलर की <strong>Route Reuse Strategy</strong> एक प्रदर्शन अनुकूलन है। घटकों को नष्ट करना और फिर से बनाना महंगा है।`,
            ml: `ആംഗുലർ പെർഫോമൻസ് കൂട്ടാൻ <strong>Route Reuse Strategy</strong> ഉപയോഗിക്കുന്നു. കംപോണന്റ് റീയൂസ് ചെയ്യുമ്പോൾ <code>ngOnInit</code> വീണ്ടും വർക്ക് ആകില്ല.`
          }
        })
      },

      // =================================================================================================
      // STEP 5: ACTIVE STYLING
      // =================================================================================================
      {
        id: 5,
        module: 'Styling',
        title: this.t({
          beginner: { en: 'You Are Here', hi: 'आप यहाँ हैं', ml: 'നിങ്ങൾ ഇവിടെയാണ്' },
          intermediate: { en: 'Active Links', hi: 'सक्रिय लिंक', ml: 'ആക്ടീവ് ലിങ്കുകൾ' },
          advanced: { en: 'RouterLinkActive Directive', hi: 'RouterLinkActive डायरेक्टिव', ml: 'RouterLinkActive ഡയറക്റ്റീവ്' },
          professional: { en: 'Tree Containment Logic', hi: 'ट्री कंटेनमेंट लॉजिक', ml: 'ട്രീ കണ്ടെയ്ൻമെന്റ് ലോജിക്' }
        }),
        focusArea: 'active',
        codeSnippet: this.c({
          beginner: `<!-- If we are on Home, make this button blue! -->\n<a routerLink="/home" class="blue-glow">Home</a>`,
          intermediate: `<a routerLink="/settings"\n   routerLinkActive="active-class">\n  Settings\n</a>\n\n/* CSS */\n.active-class { background: purple; color: white; }`,
          advanced: `<a [routerLink]="['/admin']"\n   routerLinkActive="font-bold ring-2"\n   [routerLinkActiveOptions]="{exact: true}">\n  Admin\n</a>`,
          professional: `// How it works:\n// 1. Subscribe to NavigationEnd.\n// 2. Parse current URL tree.\n// 3. Check if link's URL tree is a subset of current URL tree.\n// 4. If yes, apply Renderer2.addClass().`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Glowing Map Pin</h3>
              <p class="mb-3">When you walk around a shopping mall, you check the map. It has a big sticker that says: <strong>"YOU ARE HERE"</strong>.</p>
              <p class="mb-3">Websites need this too. When users click "Settings", the Settings button should light up so they know where they are.</p>
              <p>Angular does this automatically! We just tell it: <em>"When this button matches the current page, make it purple."</em></p>
              <p><strong>Look above:</strong> Click 'Home', 'Dash', 'Set'. See how the button glows?</p>
            `,
            hi: `जब आप किसी शॉपिंग मॉल में घूमते हैं, तो आप नक्शा देखते हैं। उस पर लिखा होता है: "आप यहाँ हैं"। वेबसाइटों को भी इसकी आवश्यकता होती है।`,
            ml: `ഷോപ്പിംഗ് മാളിൽ പോകുമ്പോൾ നമ്മൾ മാപ്പ് നോക്കും. അതിൽ "നിങ്ങൾ ഇവിടെയാണ്" എന്ന് കാണാം. വെബ്സൈറ്റുകളിലും ഇത് ആവശ്യമാണ്. ആംഗുലർ ഇത് തനിയെ ചെയ്യുന്നു.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">routerLinkActive</h3>
              <p class="mb-3">We use the <code>routerLinkActive</code> directive on our link tags.</p>
              <p class="mb-3"><strong>How to use:</strong></p>
              <code class="block bg-slate-100 p-2 rounded mb-3 text-xs">&lt;a routerLink="/about" routerLinkActive="font-bold underline"&gt;About&lt;/a&gt;</code>
              <p>This simply adds the classes <code>font-bold</code> and <code>underline</code> to the element whenever the URL starts with <code>/about</code>. You don't need to write complex <code>if/else</code> logic in your component!</p>
            `,
            hi: `हम अपने लिंक टैग पर <code>routerLinkActive</code> डायरेक्टिव का उपयोग करते हैं। यह बस तत्व में क्लास जोड़ता है।`,
            ml: `നമ്മൾ <code>routerLinkActive</code> ഉപയോഗിക്കുന്നു. ഇത് URL മാച്ച് ആകുമ്പോൾ CSS ക്ലാസുകൾ ആഡ് ചെയ്യുന്നു.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Exact Matching</h3>
              <p class="mb-3">By default, the matching is "inclusive".</p>
              <ul class="list-disc ml-5 space-y-2 mb-4 text-sm">
                <li>If you link to <code>/user</code>, it stays active even if you are at <code>/user/5/edit</code>. This is great for menus.</li>
                <li>However, a "Home" link (<code>/</code>) matches <em>everything</em> because every URL starts with <code>/</code>.</li>
              </ul>
              <p>To fix the Home link always glowing, use <code>[routerLinkActiveOptions]="{exact: true}"</code>.</p>
            `,
            hi: `डिफ़ॉल्ट रूप से, मिलान "समावेशी" है। यदि आप <code>/user</code> से लिंक करते हैं, तो यह तब भी सक्रिय रहेगा जब आप <code>/user/5/edit</code> पर होंगे।`,
            ml: `സാധാരണയായി പേരന്റ് ലിങ്ക് ആക്ടീവ് ആയിരിക്കും. ഹോം പേജ് എപ്പോഴും ആക്ടീവ് ആകുന്നത് ഒഴിവാക്കാൻ <code>{exact: true}</code> ഉപയോഗിക്കുക.`
          },
          professional: {
            en: `
              <p class="mb-3">The directive compares the <code>UrlTree</code> of the link against the <code>UrlTree</code> of the active route. It performs a <strong>Subset Check</strong>.</p>
              <p>Be careful with performance: Since this directive runs a tree comparison on <em>every</em> navigation event, having hundreds of these links (like in a massive tree-view menu) can cause UI jank during navigation. In extreme cases, manual change detection or reactive signals might be more performant.</p>
            `,
            hi: `डायरेक्टिव लिंक के <code>UrlTree</code> की तुलना सक्रिय रूट के <code>UrlTree</code> से करता है।`,
            ml: `ഈ ഡയറക്റ്റീവ് രണ്ട് UrlTree കൾ തമ്മിൽ താരതമ്യം ചെയ്യുന്നു. ഒരുപാട് ലിങ്കുകൾ ഉണ്ടെങ്കിൽ ഇത് പെർഫോമൻസിനെ ബാധിച്ചേക്കാം.`
          }
        })
      },

      // =================================================================================================
      // STEP 6: NAMED OUTLETS
      // =================================================================================================
      {
        id: 6,
        module: 'Advanced',
        title: this.t({
          beginner: { en: 'Picture-in-Picture', hi: 'पिक्चर-इन-पिक्चर', ml: 'പിക്ചർ-ഇൻ-പിക്ചർ' },
          intermediate: { en: 'Multiple Outlets', hi: 'एकाधिक आउटलेट', ml: 'മൾട്ടിപ്പിൾ ഔട്ട്ലെറ്റുകൾ' },
          advanced: { en: 'Auxiliary Routes', hi: 'सहायक मार्ग', ml: 'ഓക്സിലിയറി റൂട്ടുകൾ' },
          professional: { en: 'UrlTree Serialization', hi: 'UrlTree सीरियलाइजेशन', ml: 'UrlTree സീരിയലൈസേഷൻ' }
        }),
        focusArea: 'left',
        codeSnippet: this.c({
          beginner: `<!-- Main Frame -->\n<router-outlet></router-outlet>\n\n<!-- Side Frame (Green) -->\n<router-outlet name="left"></router-outlet>`,
          intermediate: `// Link to open menu in the left frame\n<a [routerLink]="[{ outlets: { left: 'menu' } }]">Open Menu</a>\n\n// Resulting URL:\n// http://site.com/home(left:menu)`,
          advanced: `// Route Config\n{ path: 'menu', component: MenuComponent, outlet: 'left' }\n\n// Closing an outlet\nthis.router.navigate([{ outlets: { left: null } }]);`,
          professional: `// URL Structure: /primary(outlet:secondary)\n// Segments in parentheses are treated as independent branches of the UrlTree.\n// They allow disjointed component rendering without state coupling.`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Watching TV while Gaming</h3>
              <p class="mb-3">Have you ever seen a TV where you can watch a movie in a big box, but play a video game in a small box in the corner? This is called "Picture-in-Picture".</p>
              <p class="mb-3">Angular allows this too! We can have a <strong>Main Frame</strong> (Blue) and a <strong>Side Frame</strong> (Green/Red).</p>
              <p>You can change the Side Frame to show a "Menu" or "Ads" without changing the Main Frame. They are independent!</p>
              <p><strong>Try it:</strong> Click the 'Menu' or 'Ads' buttons on the Left Card.</p>
            `,
            hi: `क्या आपने कभी ऐसा टीवी देखा है जहाँ आप एक बड़े बॉक्स में फिल्म देख सकते हैं, लेकिन कोने में एक छोटे बॉक्स में वीडियो गेम खेल सकते हैं?`,
            ml: `ഒരു ടിവിയിൽ സിനിമ കാണുമ്പോൾ തന്നെ ചെറിയൊരു ബോക്സിൽ ഗെയിം കളിക്കുന്നത് പോലെയാണിത്. ആംഗുലറിൽ ഒരേ സമയം പല കാര്യങ്ങൾ ചെയ്യാം.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Named Outlets</h3>
              <p class="mb-3">A page can have one default <code>&lt;router-outlet&gt;</code> and unlimited <em>named</em> outlets: <code>&lt;router-outlet name="sidebar"&gt;</code>.</p>
              <p class="mb-3">This is perfect for:</p>
              <ul class="list-disc ml-5 space-y-1 mb-4 text-sm">
                <li><strong>Popups/Modals:</strong> Allow users to bookmark a popup state.</li>
                <li><strong>Chat Widgets:</strong> Keep chat open while navigating the main app.</li>
                <li><strong>Sidebars:</strong> Dynamic tools based on context.</li>
              </ul>
            `,
            hi: `एक पेज में एक डिफ़ॉल्ट <code>&lt;router-outlet&gt;</code> और असीमित नामित आउटलेट हो सकते हैं।`,
            ml: `ഒരു പേജിൽ ഒന്നിലധികം ഔട്ട്ലെറ്റുകൾ വെക്കാം. പോപ്പപ്പുകൾക്കും സൈഡ്ബാറുകൾക്കും ഇത് വളരെ ഉപകാരപ്രദമാണ്.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The URL Syntax</h3>
              <p class="mb-3">When you use secondary outlets, the URL looks weird: <code>/dashboard(left:menu//right:help)</code>.</p>
              <p class="mb-3">The parentheses <code>(...)</code> tell Angular that these parts are separate from the main path. To close an outlet, you navigate it to <code>null</code>.</p>
              <code class="block bg-slate-100 p-2 rounded text-xs text-slate-600">this.router.navigate([{ outlets: { left: null } }])</code>
            `,
            hi: `जब आप माध्यमिक आउटलेट का उपयोग करते हैं, तो URL अजीब दिखता है। कोष्ठक <code>(...)</code> एंगुलर को बताते हैं कि ये भाग मुख्य पथ से अलग हैं।`,
            ml: `സെക്കൻഡറി ഔട്ട്ലെറ്റുകൾ ഉപയോഗിക്കുമ്പോൾ URL ൽ <code>(...)</code> കാണാം. ഇത് മെയിൻ പാത്തിൽ നിന്ന് വ്യത്യസ്തമാണെന്ന് കാണിക്കുന്നു.`
          },
          professional: {
            en: `
              <p class="mb-3">Named outlets utilize the full power of the <strong>UrlTree</strong> serializer. Angular treats the URL not as a simple string, but as a tree with branches.</p>
              <p><strong>Benefit:</strong> Deep Linking. A user can copy the URL <code>/product/55(popup:details)</code> and send it to a friend. When the friend opens it, they see the Product Page AND the Details Popup open exactly as it was. This is impossible with standard JavaScript modals.</p>
            `,
            hi: `नामित आउटलेट <strong>UrlTree</strong> सीरियलाइज़र की पूरी शक्ति का उपयोग करते हैं। एंगुलर URL को एक साधारण स्ट्रिंग के रूप में नहीं, बल्कि शाखाओं वाले पेड़ के रूप में मानता है।`,
            ml: `ഇത് <strong>UrlTree</strong> സീരിയലൈസറിന്റെ ശക്തി കാണിക്കുന്നു. ഡീപ് ലിങ്കിംഗ് സാധ്യമാക്കുന്നു. സുഹൃത്തിന് ലിങ്ക് അയച്ചാൽ അതേ പോലെ തന്നെ കാണാം.`
          }
        })
      },

      // =================================================================================================
      // STEP 7: WILDCARD (ERRORS)
      // =================================================================================================
      {
        id: 7,
        module: 'Error Handling',
        title: this.t({
          beginner: { en: 'Lost & Found', hi: 'खोया-पाया', ml: 'നഷ്ടപ്പെട്ടത്' },
          intermediate: { en: '404 Error Handling', hi: '404 त्रुटि हैंडलिंग', ml: '404 പിശക് കൈകാര്യം ചെയ്യൽ' },
          advanced: { en: 'Wildcard Route', hi: 'वाइल्डकार्ड रूट', ml: 'വൈൽഡ്കാർഡ് റൂട്ട്' },
          professional: { en: 'Pattern Matching Strategy', hi: 'पैटर्न मिलान रणनीति', ml: 'പാറ്റേൺ മാച്ചിംഗ് സ്ട്രാറ്റജി' }
        }),
        focusArea: 'wildcard',
        codeSnippet: this.c({
          beginner: `<!-- If the user is lost, show this -->\n{ path: '**', component: LostFoundPage }`,
          intermediate: `const routes = [\n  { path: 'home', ... },\n  // MUST BE LAST\n  { path: '**', component: NotFoundComponent }\n];`,
          advanced: `// '**' matches absolutely anything.\n// If you put this at the top of your array, ALL pages will be 404!\n// Order matters: Specific first, Generic last.`,
          professional: `// Guarding the 404\n// Sometimes you want to redirect unknown URLs to home instead of showing an error.\n{ path: '**', redirectTo: 'home' }`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Mystery Room</h3>
              <p class="mb-3">What happens if you try to walk into a room that doesn't exist? Like trying to find "The Chocolate Room" in your house?</p>
              <p class="mb-3">Usually, you would hit a wall. Ouch! But in our app, we have a <strong>Lost & Found</strong> department.</p>
              <p>If the router doesn't know where to go (like if you typed <code>/magic-room</code>), it automatically sends you to the 404 Page. It's a safety net!</p>
              <p><strong>Try it:</strong> Click 'Err: Broken Link' in the simulator.</p>
            `,
            hi: `क्या होगा यदि आप किसी ऐसे कमरे में जाने का प्रयास करते हैं जो मौजूद नहीं है? आमतौर पर, आप एक दीवार से टकराएंगे।`,
            ml: `ഇല്ലാത്ത ഒരു മുറിയിലേക്ക് പോയാൽ എന്ത് സംഭവിക്കും? സാധാരണ ഗതിയിൽ നമ്മൾ തട്ടി വീഴും. എന്നാൽ ഇവിടെ "Lost & Found" ലേക്ക് പോകും.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Wildcard **</h3>
              <p class="mb-3">In web terms, a missing page is a <strong>404 Error</strong>. Angular handles this with a special path: <code>**</code>.</p>
              <p class="mb-3">This "Wildcard" means <em>"Match Anything"</em>.</p>
              <p class="p-2 bg-yellow-100 rounded text-yellow-800 text-sm border border-yellow-200"><strong>Crucial Rule:</strong> The Wildcard route MUST be the <strong>last</strong> item in your routes array. Angular checks routes from top to bottom. If you put <code>**</code> at the top, it will match everything immediately, and your real pages will never load!</p>
            `,
            hi: `वेब शब्दों में, एक लापता पृष्ठ एक <strong>404 त्रुटि</strong> है। एंगुलर इसे एक विशेष पथ के साथ संभालता है: <code>**</code>।`,
            ml: `ഇതിനെ <strong>404 Error</strong> എന്ന് വിളിക്കുന്നു. <code>**</code> എന്ന പാത്ത് ഉപയോഗിച്ചാണ് ഇത് സെറ്റ് ചെയ്യുന്നത്. ഇത് എപ്പോഴും അവസാനം കൊടുക്കണം.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Smart Redirects</h3>
              <p class="mb-3">You don't always have to show an error page. Sometimes, it's better to just redirect users to the dashboard if they get lost.</p>
              <code class="block bg-slate-100 p-2 rounded mb-3 text-xs">{ path: '**', redirectTo: 'dashboard' }</code>
              <p>This is common in dashboards where unauthorized URLs should just bounce the user back to safety.</p>
            `,
            hi: `आपको हमेशा एक त्रुटि पृष्ठ दिखाने की आवश्यकता नहीं है। कभी-कभी, उपयोगकर्ताओं को डैशबोर्ड पर पुनर्निर्देशित करना बेहतर होता है।`,
            ml: `എപ്പോഴും എറർ പേജ് കാണിക്കേണ്ട ആവശ്യമില്ല. ചിലപ്പോൾ ഡാഷ്ബോർഡിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നതാണ് നല്ലത്.`
          },
          professional: {
            en: `
              <p class="mb-3">In enterprise applications, the Wildcard route is often protected by a Guard.</p>
              <p>Why? We might want to log the 404 error to an analytics service (like Google Analytics) to track broken links before we show the "Not Found" UI. The Guard can execute this side-effect logic.</p>
            `,
            hi: `एंटरप्राइज़ अनुप्रयोगों में, वाइल्डकार्ड रूट अक्सर गार्ड द्वारा सुरक्षित होता है। हम 404 त्रुटि को लॉग करना चाह सकते हैं।`,
            ml: `എന്റർപ്രൈസ് ആപ്പുകളിൽ 404 എററുകൾ ലോഗ് ചെയ്യാൻ നമ്മൾ ഗാർഡുകൾ ഉപയോഗിക്കാറുണ്ട്.`
          }
        })
      },

      // =================================================================================================
      // STEP 8: GUARDS
      // =================================================================================================
      {
        id: 8,
        module: 'Security',
        title: this.t({
          beginner: { en: 'The Bouncer', hi: 'बाउंसर', ml: 'ബൗൺസർ' },
          intermediate: { en: 'Route Guards', hi: 'रूट गार्ड', ml: 'റൂട്ട് ഗാർഡുകൾ' },
          advanced: { en: 'Functional Guards', hi: 'फंक्शनल गार्ड', ml: 'ഫങ്ഷണൽ ഗാർഡുകൾ' },
          professional: { en: 'Navigation Cancellation', hi: 'नेविगेशन रद्दीकरण', ml: 'നാവിഗേഷൻ റദ്ദാക്കൽ' }
        }),
        focusArea: 'intro',
        codeSnippet: this.c({
          beginner: `// Code tells the guard:\nif (userHasTicket) { return true; }\nelse { return false; }`,
          intermediate: `// route config\n{ \n  path: 'admin', \n  component: AdminPage,\n  canActivate: [authGuard] \n}`,
          advanced: `export const authGuard: CanActivateFn = (route, state) => {\n  const auth = inject(AuthService);\n  return auth.isLoggedIn() ? true : createUrlTreeFromSnapshot(route, ['/login']);\n};`,
          professional: `// Types of Guards:\n// CanMatch: Stops route matching (good for feature flags)\n// CanActivate: Stops entry\n// CanDeactivate: Stops exit (unsaved changes)\n// CanLoad: Prevents lazy loading (deprecated for CanMatch)`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Security Guard</h3>
              <p class="mb-3">Some rooms in a building are private, like the Manager's Office. You can't just walk in.</p>
              <p class="mb-3">There is a big <strong>Security Guard</strong> at the door. He asks: <em>"Do you have an ID badge?"</em></p>
              <ul class="list-disc ml-5 space-y-2 mb-4">
                <li>If <strong>YES</strong>: He steps aside and lets you in.</li>
                <li>If <strong>NO</strong>: He blocks you and sends you to the Login desk.</li>
              </ul>
              <p>In Angular, we call this code a <strong>Guard</strong>.</p>
            `,
            hi: `इमारत के कुछ कमरे निजी होते हैं, जैसे प्रबंधक का कार्यालय। दरवाजे पर एक बड़ा सुरक्षा गार्ड है। वह पूछता है: "क्या आपके पास आईडी बैज है?"`,
            ml: `ചില മുറികൾ പ്രൈവറ്റ് ആണ്. അവിടെ സെക്യൂരിറ്റി ഗാർഡ് ഉണ്ടാകും. ഐഡി കാർഡ് ഉണ്ടെങ്കിൽ മാത്രമേ അകത്തേക്ക് വിടൂ.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">CanActivate</h3>
              <p class="mb-3">A Guard is a function that runs <em>before</em> the navigation completes. The most common type is <code>canActivate</code>.</p>
              <p class="mb-3">It returns a boolean:</p>
              <ul class="list-disc ml-5 space-y-1 mb-4 text-sm">
                <li><code>true</code>: Navigation proceeds.</li>
                <li><code>false</code>: Navigation stops (user stays on current page).</li>
                <li><code>UrlTree</code>: Navigation is redirected to a new path (e.g., Login).</li>
              </ul>
            `,
            hi: `गार्ड एक फ़ंक्शन है जो नेविगेशन पूरा होने से पहले चलता है। सबसे आम प्रकार <code>canActivate</code> है।`,
            ml: `നാവിഗേഷൻ പൂർത്തിയാകുന്നതിന് മുൻപ് പ്രവർത്തിക്കുന്ന ഫംഗ്ഷനാണ് ഗാർഡ്. <code>canActivate</code> ആണ് പ്രധാനം.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">CanDeactivate</h3>
              <p class="mb-3">Guards can also check if you are allowed to <em>leave</em>. This is called <code>CanDeactivate</code>.</p>
              <p class="mb-3"><strong>Real World Example:</strong> Have you ever tried to close a tab while filling out a form, and the browser screams: <em>"You have unsaved changes! Are you sure?"</em></p>
              <p>That is a CanDeactivate guard in action. It protects users from losing data.</p>
            `,
            hi: `गार्ड यह भी जांच सकते हैं कि क्या आपको छोड़ने की अनुमति है। इसे <code>CanDeactivate</code> कहा जाता है।`,
            ml: `പേജിൽ നിന്ന് പുറത്തുപോകുമ്പോൾ പ്രവർത്തിക്കുന്ന ഗാർഡാണ് <code>CanDeactivate</code>. സേവ് ചെയ്യാത്ത ഡാറ്റ നഷ്ടപ്പെടാതിരിക്കാൻ ഇത് സഹായിക്കുന്നു.`
          },
          professional: {
            en: `
              <p class="mb-3">In modern Angular (v16+), we use <strong>Functional Guards</strong>. They are simple functions that can use <code>inject()</code>.</p>
              <p>We also have <code>CanMatch</code>. This is powerful for <strong>Feature Flags</strong>. If <code>CanMatch</code> returns false, the router pretends that route <em>doesn't even exist</em> and keeps searching down the config list. This allows you to have two routes with the same path (e.g., 'dashboard'), one for 'Admin' and one for 'User', and the guard decides which component actually loads.</p>
            `,
            hi: `आधुनिक एंगुलर में, हम फंक्शनल गार्ड का उपयोग करते हैं। हमारे पास CanMatch भी है। यह फीचर फ्लैग के लिए शक्तिशाली है।`,
            ml: `പുതിയ ആംഗുലറിൽ ഫങ്ഷണൽ ഗാർഡുകൾ ഉപയോഗിക്കുന്നു. <code>CanMatch</code> ഉപയോഗിച്ച് ഒരേ പാത്തിൽ രണ്ട് വ്യത്യസ്ത കംപോണന്റുകൾ ലോഡ് ചെയ്യാം.`
          }
        })
      },

      // =================================================================================================
      // STEP 9: LAZY LOADING
      // =================================================================================================
      {
        id: 9,
        module: 'Performance',
        title: this.t({
          beginner: { en: 'Packing Light', hi: 'हल्का पैकिंग', ml: 'പാക്കിംഗ് ലൈറ്റ്' },
          intermediate: { en: 'Lazy Loading', hi: 'लेज़ी लोडिंग', ml: 'ലേസി ലോഡിംഗ്' },
          advanced: { en: 'Code Splitting', hi: 'कोड स्प्लिटिंग', ml: 'കോഡ് സ്പ്ലിറ്റിംഗ്' },
          professional: { en: 'Bundle Optimization', hi: 'बंडल अनुकूलन', ml: 'ബണ്ടിൽ ഒപ്റ്റിമൈസേഷൻ' }
        }),
        focusArea: 'intro',
        codeSnippet: this.c({
          beginner: `// Don't buy all the furniture for the house at once.\n// Buy the baby room furniture ONLY when the baby is born.`,
          intermediate: `// Old way (Eager): component: AdminComponent\n\n// New way (Lazy):\nloadComponent: () => import('./admin.component').then(m => m.AdminComponent)`,
          advanced: `// routes.ts\n{\n  path: 'settings',\n  loadChildren: () => import('./settings/settings.routes')\n}`,
          professional: `// Webpack splits this into 'src_app_settings_ts.js'.\n// The browser only downloads this 20KB file when the user clicks 'Settings'.\n// Reduces Initial Bundle Size (LCP/FCP).`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Don't Pack the Winter Coat</h3>
              <p class="mb-3">Imagine you are going on a summer vacation. Do you pack your heavy winter coat, snow boots, and scarf? No! That would make your bag too heavy to carry.</p>
              <p class="mb-3">Computers are the same. If a user only visits the "Home Page", why force them to download the code for the "Settings Page"?</p>
              <p>Angular waits. It only downloads the "Settings" code <em>when the user actually clicks the button</em>. This makes the app start super fast!</p>
            `,
            hi: `कल्पना कीजिए कि आप गर्मियों की छुट्टी पर जा रहे हैं। क्या आप अपना भारी विंटर कोट पैक करते हैं? नहीं! कंप्यूटर भी ऐसे ही होते हैं।`,
            ml: `വേനൽക്കാല യാത്രയ്ക്ക് നമ്മൾ തണുപ്പുകാല വസ്ത്രങ്ങൾ എടുക്കാറില്ല. അത് ബാഗിന്റെ ഭാരം കൂട്ടും. അതുപോലെ കമ്പ്യൂട്ടറും ആവശ്യമുള്ളപ്പോൾ മാത്രമേ കോഡ് ഡൗൺലോഡ് ചെയ്യൂ.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Lazy Loading</h3>
              <p class="mb-3">By default, Angular creates one giant JavaScript file (<code>main.js</code>). If your app is huge, this file takes 10 seconds to load.</p>
              <p class="mb-3">Lazy loading splits your code into "chunks".</p>
              <ul class="list-disc ml-5 space-y-1 mb-4 text-sm">
                <li><strong>Eager:</strong> <code>component: Dashboard</code> (Loads instantly at startup)</li>
                <li><strong>Lazy:</strong> <code>loadChildren: () => import(...)</code> (Loads on demand)</li>
              </ul>
              <p><strong>Result:</strong> Your main bundle is tiny, and the app loads instantly.</p>
            `,
            hi: `डिफ़ॉल्ट रूप से, एंगुलर एक विशाल जावास्क्रिप्ट फ़ाइल बनाता है। लेज़ी लोडिंग आपके कोड को "हिस्सों" में विभाजित करता है।`,
            ml: `ലേസി ലോഡിംഗ് കോഡിനെ ചെറിയ ഭാഗങ്ങളായി തിരിക്കുന്നു. ആവശ്യമുള്ളപ്പോൾ മാത്രം ഡൗൺലോഡ് ചെയ്യുന്നു.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Dynamic Imports</h3>
              <p class="mb-3">We use the JavaScript dynamic import syntax: <code>import('./path')</code>. This returns a Promise.</p>
              <p class="mb-3">When the router matches a lazy route, it pauses, fires a network request to fetch the JS file, executes it, and then renders the component. You might see a slight delay, which is why we often use loading spinners during this pause.</p>
            `,
            hi: `हम जावास्क्रिप्ट डायनामिक आयात सिंटैक्स का उपयोग करते हैं। यह एक प्रॉमिस लौटाता है।`,
            ml: `നമ്മൾ ഡൈനാമിക് ഇമ്പോർട്ട് സിന്റാക്സ് ഉപയോഗിക്കുന്നു. ഇത് ഒരു പ്രോമിസ് റിട്ടേൺ ചെയ്യുന്നു.`
          },
          professional: {
            en: `
              <p class="mb-3">To get the best of both worlds (Fast Start + Fast Navigation), we use <strong>Preloading Strategies</strong>.</p>
              <p class="mb-3">We configure the router to load the main page first. Then, while the user is reading the home page, Angular secretly downloads the "Settings" and "Admin" chunks in the background. When the user eventually clicks, the code is already there!</p>
            `,
            hi: `दोनों दुनिया के सर्वश्रेष्ठ (तेज़ शुरुआत + तेज़ नेविगेशन) प्राप्त करने के लिए, हम प्रीलोडिंग रणनीतियों का उपयोग करते हैं।`,
            ml: `വേഗത്തിലുള്ള തുടക്കവും നാവിഗേഷനും ലഭിക്കാൻ നമ്മൾ പ്രീലോഡിംഗ് സ്ട്രാറ്റജികൾ ഉപയോഗിക്കുന്നു. ബാക്ക്ഗ്രൗണ്ടിൽ കോഡ് ഡൗൺലോഡ് ചെയ്യുന്നു.`
          }
        })
      },

      // =================================================================================================
      // STEP 10: LIFECYCLE (EVENTS)
      // =================================================================================================
      {
        id: 10,
        module: 'Deep Dive',
        title: this.t({
          beginner: { en: 'Hello and Goodbye', hi: 'नमस्ते और अलविदा', ml: 'ഹലോയും ഗുഡ്ബൈയും' },
          intermediate: { en: 'Component Lifecycle', hi: 'घटक जीवनचक्र', ml: 'കംപോണന്റ് ലൈഫ്സൈക്കിൾ' },
          advanced: { en: 'OnInit vs OnDestroy', hi: 'OnInit बनाम OnDestroy', ml: 'OnInit vs OnDestroy' },
          professional: { en: 'Memory Leak Prevention', hi: 'मेमोरी लीक रोकथाम', ml: 'മെമ്മറി ലീക്ക് തടയൽ' }
        }),
        focusArea: 'intro',
        codeSnippet: this.c({
          beginner: `// When picture is put in frame:\nhello();\n\n// When picture is taken out:\ngoodbye();`,
          intermediate: `ngOnInit() {\n  console.log('Component Created');\n  // Fetch data here\n}\n\nngOnDestroy() {\n  console.log('Component Deleted');\n  // Stop timers here\n}`,
          advanced: `// If you navigate /user/1 -> /user/2\n// Neither Init nor Destroy runs!\n// Because the component is REUSED.\n// Use route.params.subscribe() instead.`,
          professional: `// Memory Leaks:\n// If you subscribe to a global service in ngOnInit but don't unsubscribe in OnDestroy,\n// the subscription lives forever, eating up RAM even after the page is gone.`
        }),
        content: this.t({
          beginner: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Clean Up Your Room!</h3>
              <p class="mb-3">When a page appears, it says "Hello!" (Born). When it disappears, it says "Goodbye!" (Destroyed).</p>
              <p class="mb-3">Imagine you turn on the water tap (start a timer) when you enter the kitchen. If you leave the kitchen without turning it off, the house floods!</p>
              <p>In Angular, we use the "Goodbye" moment (<code>ngOnDestroy</code>) to turn off taps, stop timers, and clean up the memory so the computer doesn't get slow.</p>
            `,
            hi: `जब कोई पेज दिखाई देता है, तो वह "नमस्ते!" कहता है। जब यह गायब हो जाता है, तो वह "अलविदा!" कहता है।`,
            ml: `ഒരു പേജ് വരുമ്പോൾ അത് "ഹലോ" പറയുന്നു. പോകുമ്പോൾ "ഗുഡ്ബൈ" പറയുന്നു. അടുക്കളയിൽ നിന്ന് പോകുമ്പോൾ പൈപ്പ് അടയ്ക്കുന്നത് പോലെ ആംഗുലറിലും നമ്മൾ ക്ലീൻ അപ്പ് ചെയ്യണം.`
          },
          intermediate: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">Lifecycle Hooks</h3>
              <p class="mb-3">Angular gives us hooks to run code at specific times:</p>
              <ul class="list-disc ml-5 space-y-2 mb-4 text-sm">
                <li><code>ngOnInit()</code>: Runs ONCE when the component is created. Great for fetching data from an API.</li>
                <li><code>ngOnDestroy()</code>: Runs ONCE when the component is removed. Use this to unsubscribe from Observables.</li>
              </ul>
            `,
            hi: `एंगुलर हमें विशिष्ट समय पर कोड चलाने के लिए हुक देता है: ngOnInit और ngOnDestroy।`,
            ml: `ആംഗുലർ നമുക്ക് ഹുക്കുകൾ നൽകുന്നു: ngOnInit ഉം ngOnDestroy ഉം. ഡാറ്റ എടുക്കാനും ക്ലീൻ ചെയ്യാനും ഇവ ഉപയോഗിക്കുന്നു.`
          },
          advanced: {
            en: `
              <h3 class="text-lg font-bold text-indigo-600 mb-2">The Reuse Trap</h3>
              <p class="mb-3">Here is a trap that catches everyone: If you go from <code>/user/1</code> to <code>/user/2</code>...</p>
              <p class="font-bold text-red-600 mb-2">ngOnDestroy and ngOnInit DO NOT RUN.</p>
              <p class="mb-3">Why? Because it's the <em>same</em> component class. Angular is smart and reuses it. It only updates the parameter. This is why you must listen to parameter changes instead of relying on <code>ngOnInit</code>.</p>
            `,
            hi: `यहाँ एक जाल है: यदि आप /user/1 से /user/2 पर जाते हैं, तो ngOnDestroy और ngOnInit नहीं चलते हैं।`,
            ml: `ഒരേ പേജിൽ ഡാറ്റ മാറുമ്പോൾ ngOnDestroy ഉം ngOnInit ഉം പ്രവർത്തിക്കില്ല. ആംഗുലർ കംപോണന്റ് റീയൂസ് ചെയ്യുന്നതാണ് കാരണം.`
          },
          professional: {
            en: `
              <p class="mb-3"><strong>Memory Leaks</strong> are the #1 performance killer in SPAs. If you subscribe to a global service (like a ChatService) in a component but forget to unsubscribe in <code>ngOnDestroy</code>, that subscription stays alive forever.</p>
              <p class="mb-3">If the user opens and closes that page 100 times, you now have 100 ghost subscriptions running in the background, eating RAM and CPU.</p>
              <p><strong>Solution:</strong> Use the <code>async</code> pipe or the <code>takeUntilDestroyed</code> operator.</p>
            `,
            hi: `मेमोरी लीक SPAs में #1 प्रदर्शन हत्यारा है। यदि आप सदस्यता लेते हैं लेकिन सदस्यता समाप्त करना भूल जाते हैं, तो वह हमेशा के लिए जीवित रहता है।`,
            ml: `മെമ്മറി ലീക്ക് ആണ് പ്രധാന വില്ലൻ. സബ്സ്ക്രിപ്ഷനുകൾ ക്ലീൻ ചെയ്തില്ലെങ്കിൽ അത് റാം ഉപയോഗിച്ചുകൊണ്ടിരിക്കും. async പൈപ്പ് ഉപയോഗിക്കുന്നത് നല്ലതാണ്.`
          }
        })
      }
    ];
  });

  readonly currentStep = computed(() => this.steps()[this._currentStepIndex()]);
  readonly totalSteps = computed(() => this.steps().length);
  readonly isFirst = computed(() => this._currentStepIndex() === 0);
  readonly isLast = computed(() => this._currentStepIndex() === this.steps().length - 1);
  
  // Computes current module listing based on steps
  readonly modules = computed(() => {
    const mods = new Map<string, TutorialStep[]>();
    this.steps().forEach(step => {
      if (!mods.has(step.module)) mods.set(step.module, []);
      mods.get(step.module)!.push(step);
    });
    return Array.from(mods.entries());
  });

  setLevel(level: Level) {
    // Always reset to step 0 when setting level explicitly from landing page
    this.currentLevel.set(level);
    this._currentStepIndex.set(0);
  }

  next() { if (!this.isLast()) this._currentStepIndex.update(i => i + 1); }
  prev() { if (!this.isFirst()) this._currentStepIndex.update(i => i - 1); }
  goTo(index: number) { 
    if (index >= 0 && index < this.steps().length) this._currentStepIndex.set(index); 
  }
}