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
            en: `👋 <strong>Welcome, Student!</strong><br><br>Imagine your computer screen is a wall. On this wall, we hang a <strong>Magic Picture Frame</strong>. Unlike normal frames where you have to take the photo out to change it, this frame changes the photo automatically when you press a button on a remote control.<br><br>In our app, this frame is called the <code>&lt;router-outlet&gt;</code>. It is the designated spot where all the action happens.`,
            hi: `👋 <strong>स्वागत है!</strong><br><br>कल्पना कीजिए कि आपकी स्क्रीन एक दीवार है। इस दीवार पर हम एक <strong>जादुई फ्रेम</strong> लटकाते हैं। सामान्य फ्रेम के विपरीत, यह रिमोट का बटन दबाते ही तस्वीर बदल देता है।<br><br>हमारे ऐप में, इस फ्रेम को <code>&lt;router-outlet&gt;</code> कहा जाता है।`,
            ml: `👋 <strong>സ്വാഗതം!</strong><br><br>നിങ്ങളുടെ സ്ക്രീൻ ഒരു ചുവരാണെന്ന് കരുതുക. അതിൽ നമ്മൾ ഒരു <strong>മാജിക്കൽ ഫ്രെയിം</strong> തൂക്കുന്നു. റിമോട്ട് ഞെക്കിയാൽ ഇതിനുള്ളിലെ ചിത്രം തനിയെ മാറും. ആംഗുലറിൽ ഇതിനെ <code>&lt;router-outlet&gt;</code> എന്ന് വിളിക്കുന്നു.`
          },
          intermediate: {
            en: `In a traditional website (like Wikipedia), clicking a link downloads a completely new HTML file from the server. This makes the screen flash white. <br><br>In an <strong>Angular SPA (Single Page Application)</strong>, we never leave the first page. We just erase the middle section and draw new content there. The <code>&lt;router-outlet&gt;</code> acts as the placeholder that tells Angular: <em>"Please render the active page right here."</em>`,
            hi: `एक पारंपरिक वेबसाइट में, लिंक पर क्लिक करने से एक नया HTML पेज डाउनलोड होता है। <strong>Angular SPA</strong> में, हम कभी भी पहला पेज नहीं छोड़ते। हम बस बीच का हिस्सा मिटाते हैं और वहां नई सामग्री बनाते हैं।`,
            ml: `സാധാരണ വെബ്സൈറ്റുകളിൽ ഓരോ ക്ലിക്കിലും പുതിയ പേജ് ലോഡ് ആകും. എന്നാൽ <strong>Angular SPA</strong> യിൽ, മാറേണ്ട ഭാഗം മാത്രമേ അപ്ഡേറ്റ് ആകൂ. ഇതിനായി <code>&lt;router-outlet&gt;</code> ഉപയോഗിക്കുന്നു.`
          },
          advanced: {
            en: `The <code>RouterOutlet</code> is a structural directive exported by <code>RouterModule</code>. It behaves similarly to an <code>*ngIf</code>, but instead of a boolean condition, it listens to the <strong>Router Service</strong>.<br><br>When the browser URL changes, the Router performs a tree-matching algorithm to find the correct component class. The Outlet then dynamically instantiates that component and inserts its Host View into the DOM immediately after the outlet tag.`,
            hi: `<code>RouterOutlet</code> एक स्ट्रक्चरल डायरेक्टिव है। यह एक बूलियन स्थिति के बजाय <strong>Router Service</strong> को सुनता है। जब URL बदलता है, तो यह सही कंपोनेंट को ढूँढता है और उसे DOM में डालता है।`,
            ml: `<code>RouterOutlet</code> എന്നത് ഒരു ഡയറക്റ്റീവ് ആണ്. URL മാറുമ്പോൾ അതിനനുസരിച്ചുള്ള കംപോണന്റിനെ റൗട്ടർ കണ്ടെത്തുകയും, ഔട്ട്ലെറ്റ് അതിനെ DOM-ലേക്ക് ഇൻസേർട്ട് ചെയ്യുകയും ചെയ്യുന്നു.`
          },
          professional: {
            en: `Under the hood, <code>RouterOutlet</code> injects <code>ViewContainerRef</code> and <code>ComponentFactoryResolver</code>. It subscribes to the <code>activateEvents</code> of the <code>ChildrenOutletContexts</code>.<br><br>When a route is activated, the outlet clears its current view container and creates a new component instance from the resolved factory. It also hooks into the <code>ChangeDetectorRef</code> to mark the view for check. This architecture allows for advanced features like <strong>Route Reuse Strategies</strong>, where views are detached (stored in memory) rather than destroyed.`,
            hi: `आंतरिक रूप से, <code>RouterOutlet</code> <code>ViewContainerRef</code> का उपयोग करता है। जब कोई रूट सक्रिय होता है, तो यह वर्तमान दृश्य को साफ़ करता है और एक नया घटक बनाता है।`,
            ml: `<code>RouterOutlet</code> ഇന്റേണലായി <code>ViewContainerRef</code> ഉപയോഗിക്കുന്നു. റൂട്ട് മാറുമ്പോൾ നിലവിലെ വ്യൂ ക്ലിയർ ചെയ്ത് പുതിയത് റെൻഡർ ചെയ്യുന്നു. Route Reuse Strategy പോലുള്ള അഡ്വാൻസ്ഡ് ഫീച്ചറുകൾ ഇത് സാധ്യമാക്കുന്നു.`
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
          beginner: { en: 'The Map', hi: 'नक्शा', ml: 'ഭൂപടം' },
          intermediate: { en: 'Route Array', hi: 'रूट सूची', ml: 'റൂട്ട് അറേ' },
          advanced: { en: 'Route Definitions', hi: 'रूट परिभाषाएँ', ml: 'റൂട്ട് ഡെഫിനിഷൻസ്' },
          professional: { en: 'Tree Configuration', hi: 'ट्री विन्यास', ml: 'ട്രീ കോൺഫിഗറേഷൻ' }
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
            en: `A frame needs to know which photo to show. We give the computer a <strong>Map</strong>.<br><br>The Map says: "If the user goes to the <strong>/home</strong> address, show them the <strong>House Photo</strong>. If they go to <strong>/dashboard</strong>, show the <strong>Chart Photo</strong>."<br><br>👉 <strong>Look at the URL bar above.</strong> As you click buttons, watch the address change!`,
            hi: `कंप्यूटर को एक <strong>नक्शा</strong> चाहिए। नक्शा कहता है: "यदि उपयोगकर्ता <strong>/home</strong> पर जाता है, तो उसे घर की फोटो दिखाएं।"<br><br>👉 <strong>ऊपर URL बार देखें।</strong> बटन क्लिक करते ही पता बदलता है!`,
            ml: `ഏത് ചിത്രമാണ് കാണിക്കേണ്ടതെന്ന് കമ്പ്യൂട്ടറിന് മനസിലാകാൻ നമ്മൾ ഒരു <strong>മാപ്പ്</strong> നൽകുന്നു. URL <strong>/home</strong> ആണെങ്കിൽ വീടിന്റെ ചിത്രം കാണിക്കുക എന്ന് ഇതിൽ പറയുന്നു.`
          },
          intermediate: {
            en: `In Angular, this map is a JavaScript array called <code>Routes</code>. Each object in the array has a <code>path</code> (the URL part) and a <code>component</code> (the TypeScript class to load).<br><br>We pass this array to <code>provideRouter(routes)</code> in our main configuration file. Angular reads this list from top to bottom to find a match.`,
            hi: `एंगुलर में, यह नक्शा <code>Routes</code> नामक एक JavaScript एरे है। प्रत्येक ऑब्जेक्ट में एक <code>path</code> और एक <code>component</code> होता है।`,
            ml: `ആംഗുലറിൽ <code>Routes</code> അറേ ഉപയോഗിച്ചാണ് ഇത് ചെയ്യുന്നത്. ഓരോ ഒബ്ജക്റ്റിലും <code>path</code> ഉം <code>component</code> ഉം ഉണ്ടാകും.`
          },
          advanced: {
            en: `The <code>Routes</code> array defines the application's state tree. Key properties include:<br>• <code>path</code>: The URL segment to match.<br>• <code>component</code>: The view to render.<br>• <code>redirectTo</code>: For forwarding users (e.g., from empty <code>''</code> to <code>'home'</code>).<br>• <code>pathMatch</code>: Crucial for redirects. <code>'full'</code> means the entire remaining URL must match.`,
            hi: `<code>Routes</code> एरे एप्लिकेशन के स्टेट ट्री को परिभाषित करता है। प्रमुख गुणों में path, component, redirectTo, और pathMatch शामिल हैं।`,
            ml: `<code>Routes</code> അറേ ആപ്ലിക്കേഷന്റെ സ്റ്റേറ്റ് ട്രീ ഡിഫൈൻ ചെയ്യുന്നു. path, component, redirectTo എന്നിവയാണ് പ്രധാനപ്പെട്ടവ.`
          },
          professional: {
            en: `This configuration is static by default but can be manipulated dynamically. The Router parses this configuration into a tree of <code>ActivatedRoute</code> objects. <br><br>When matching, the router uses a Depth-First Search (DFS) strategy with a "First Match Wins" policy. This means the order of routes is critical—specific routes must be defined before generic wildcards.`,
            hi: `राउटर इस कॉन्फ़िगरेशन को <code>ActivatedRoute</code> ऑब्जेक्ट्स के पेड़ में पार्स करता है। मिलान करते समय, राउटर "फर्स्ट मैच विन्स" नीति के साथ डेप्थ-फर्स्ट सर्च (DFS) रणनीति का उपयोग करता है।`,
            ml: `റൗട്ടർ ഈ കോൺഫിഗറേഷനെ <code>ActivatedRoute</code> ഒബ്ജക്റ്റുകളുടെ ഒരു ട്രീ ആയി മാറ്റുന്നു. ആദ്യം മാച്ച് ആകുന്ന റൂട്ടാണ് എടുക്കുക (First Match Wins).`
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
          beginner: { en: 'Remote Control', hi: 'रिमोट कंट्रोल', ml: 'റിമോട്ട് കൺട്രോൾ' },
          intermediate: { en: 'Router Links', hi: 'राउटर लिंक', ml: 'റൗട്ടർ ലിങ്കുകൾ' },
          advanced: { en: 'The RouterLink Directive', hi: 'RouterLink डायरेक्टिव', ml: 'RouterLink ഡയറക്റ്റീവ്' },
          professional: { en: 'Declarative Navigation', hi: 'घोषणात्मक नेविगेशन', ml: 'ഡിക്ലറേറ്റീവ് നാവിഗേഷൻ' }
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
            en: `To change the picture, we need buttons. In a normal webpage, we use links (`+`<a>`+` tags). But in our Magic App, we don't want to reload the whole world.<br><br>So we use a special sticker on our buttons called <code>routerLink</code>. It tells the browser: "Don't reload! Just ask the Angular Router to change the frame."`,
            hi: `तस्वीर बदलने के लिए हमें बटन चाहिए। हम अपने बटनों पर <code>routerLink</code> नामक एक विशेष स्टिकर का उपयोग करते हैं। यह ब्राउज़र को बताता है: "रीलोड न करें! बस एंगुलर राउटर से फ्रेम बदलने के लिए कहें।"`,
            ml: `ചിത്രം മാറ്റാൻ നമ്മൾ <code>routerLink</code> ഉപയോഗിക്കുന്നു. പേജ് റീലോഡ് ചെയ്യാതെ തന്നെ ഫ്രെയിം മാറ്റാൻ ഇത് സഹായിക്കുന്നു.`
          },
          intermediate: {
            en: `Never use <code>href="/path"</code> in Angular! That triggers a full page refresh, which kills your app's memory and state. <br><br>Instead, use the <code>routerLink</code> directive. It intercepts the click event, prevents the default browser behavior, and tells the internal Router service to update the URL and view.`,
            hi: `एंगुलर में कभी भी <code>href="/path"</code> का उपयोग न करें! इसके बजाय, <code>routerLink</code> डायरेक्टिव का उपयोग करें। यह क्लिक इवेंट को रोकता है और आंतरिक राउटर को URL अपडेट करने के लिए कहता है।`,
            ml: `ആംഗുലറിൽ <code>href</code> ഉപയോഗിക്കരുത്. പകരം <code>routerLink</code> ഉപയോഗിക്കുക. ഇത് പേജ് റീലോഡ് ചെയ്യാതെ നോക്കുന്നു.`
          },
          advanced: {
            en: `<code>RouterLink</code> accepts an array of segments. <code>['/user', '1']</code> becomes <code>/user/1</code>. This is safer than string concatenation because Angular handles encoding special characters for you.<br><br>You can also navigate programmatically using <code>inject(Router).navigate([...])</code> inside your TypeScript functions.`,
            hi: `<code>RouterLink</code> सेगमेंट की एक सरणी स्वीकार करता है। <code>['/user', '1']</code> <code>/user/1</code> बन जाता है। आप TypeScript में <code>inject(Router).navigate([...])</code> का भी उपयोग कर सकते हैं।`,
            ml: `<code>RouterLink</code> ഒരു അറേ ആണ് സ്വീകരിക്കുന്നത്. കോഡിലൂടെ നാവിഗേറ്റ് ചെയ്യാൻ <code>inject(Router).navigate([...])</code> ഉപയോഗിക്കാം.`
          },
          professional: {
            en: `When you click a RouterLink, Angular executes a complex sequence: <br>1. <strong>UrlTree Creation</strong>: Merges commands with current params.<br>2. <strong>Recognition</strong>: Matches the new URL against config.<br>3. <strong>Guard Checks</strong>: Can we leave current? Can we enter next?<br>4. <strong>Resolve</strong>: Fetch data.<br>5. <strong>Activation</strong>: Update DOM.<br>Using <code>href</code> bypasses all of this logic.`,
            hi: `जब आप RouterLink पर क्लिक करते हैं, तो एंगुलर एक जटिल अनुक्रम निष्पादित करता है: UrlTree निर्माण, मान्यता, गार्ड चेक, रिज़ॉल्यूशन, और सक्रियण।`,
            ml: `RouterLink ക്ലിക്ക് ചെയ്യുമ്പോൾ ആംഗുലർ പല കാര്യങ്ങളും ചെയ്യുന്നു: URL നിർമ്മാണം, മാച്ചിംഗ്, ഗാർഡ് ചെക്കിംഗ്, ഡാറ്റ ഫെച്ചിംഗ്, എന്നിവ.`
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
          beginner: { en: 'Custom ID Cards', hi: 'कस्टम आईडी कार्ड', ml: 'ഐഡി കാർഡുകൾ' },
          intermediate: { en: 'Route Parameters', hi: 'रूट पैरामीटर', ml: 'റൂട്ട് പാരാമീറ്ററുകൾ' },
          advanced: { en: 'ActivatedRoute Service', hi: 'ActivatedRoute सर्विस', ml: 'ActivatedRoute സർവീസ്' },
          professional: { en: 'Observables vs Snapshots', hi: 'Observables बनाम Snapshots', ml: 'Observables vs Snapshots' }
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
            en: `Imagine we have 1,000 students. We don't want to make 1,000 different pages. We make ONE "ID Card Page" that has blank spaces.<br><br>When you visit <code>/user/1</code>, the URL passes the number "1" to the page. The page reads it and stamps "Student #1" on the card. Try clicking <strong>User 1</strong> and <strong>User 99</strong> below the main box.`,
            hi: `कल्पना कीजिए कि हमारे पास 1,000 छात्र हैं। हम 1,000 अलग-अलग पेज नहीं बनाना चाहते। हम एक "आईडी कार्ड पेज" बनाते हैं। जब आप <code>/user/1</code> पर जाते हैं, तो पेज "1" पढ़ता है और कार्ड पर "Student #1" मुहर लगाता है।`,
            ml: `നമുക്ക് 1000 കുട്ടികളുണ്ടെങ്കിൽ 1000 പേജ് ഉണ്ടാക്കാൻ കഴിയില്ല. പകരം നമ്മൾ ഒരു "ID Card Page" ഉണ്ടാക്കുന്നു. URL വഴി വരുന്ന നമ്പർ അനുസരിച്ച് ഇതിലെ വിവരങ്ങൾ മാറുന്നു.`
          },
          intermediate: {
            en: `We define a parameter in the route using a colon, like <code>:id</code>. This is a variable placeholder. <br><br>In the component, we can read this variable to fetch data from a database (like fetching user details based on ID).`,
            hi: `हम रूट में कोलन का उपयोग करके एक पैरामीटर परिभाषित करते हैं, जैसे <code>:id</code>। यह एक वेरिएबल प्लेसहोल्डर है।`,
            ml: `<code>:id</code> ഉപയോഗിച്ച് നമ്മൾ ഒരു വേരിയബിൾ ഡിഫൈൻ ചെയ്യുന്നു. ഈ വേരിയബിൾ ഉപയോഗിച്ച് ഡാറ്റാബേസിൽ നിന്ന് വിവരങ്ങൾ എടുക്കാം.`
          },
          advanced: {
            en: `To access the data, we inject the <code>ActivatedRoute</code> service. It provides a <code>paramMap</code>.<br><br>You might see <code>snapshot.paramMap</code>. This is dangerous! It only reads the ID once when the page loads. If the user clicks "Next User", the URL changes but the component stays the same, so the snapshot doesn't update.`,
            hi: `डेटा तक पहुंचने के लिए, हम <code>ActivatedRoute</code> सर्विस इंजेक्ट करते हैं। <code>snapshot</code> का उपयोग करना खतरनाक है क्योंकि यह केवल एक बार आईडी पढ़ता है।`,
            ml: `ഡാറ്റ എടുക്കാൻ <code>ActivatedRoute</code> സർവീസ് ഉപയോഗിക്കുന്നു. <code>snapshot</code> ഉപയോഗിക്കുന്നത് ശ്രദ്ധിച്ചു വേണം.`
          },
          professional: {
            en: `Angular uses a <strong>Route Reuse Strategy</strong>. If the config is the same (<code>/user/1</code> to <code>/user/2</code>), Angular keeps the DOM and component instance alive for performance.<br><br>Therefore, you <strong>MUST</strong> subscribe to the <code>paramMap</code> observable (or use Signals). This ensures your UI reacts to parameter changes without destroying and recreating the entire view.`,
            hi: `एंगुलर <strong>Route Reuse Strategy</strong> का उपयोग करता है। यदि कॉन्फ़िगरेशन समान है, तो एंगुलर प्रदर्शन के लिए DOM और घटक उदाहरण को जीवित रखता है।`,
            ml: `ആംഗുലർ <strong>Route Reuse Strategy</strong> ഉപയോഗിക്കുന്നു. ഒരേ പേജിൽ ഡാറ്റ മാറുമ്പോൾ കംപോണന്റ് റീയൂസ് ചെയ്യപ്പെടുന്നു. അതുകൊണ്ട് Observables ഉപയോഗിക്കുന്നതാണ് ഉചിതം.`
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
          beginner: { en: 'Glowing Buttons', hi: 'चमकते बटन', ml: 'തിളങ്ങുന്ന ബട്ടണുകൾ' },
          intermediate: { en: 'Active State', hi: 'सक्रिय स्थिति', ml: 'ആക്ടീവ് സ്റ്റേറ്റ്' },
          advanced: { en: 'RouterLinkActive', hi: 'RouterLinkActive', ml: 'RouterLinkActive' },
          professional: { en: 'Tree Inclusion Check', hi: 'ट्री समावेशन जांच', ml: 'ട്രീ ഇൻക്ലൂഷൻ ചെക്ക്' }
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
            en: `How does the user know which room they are in? The button on the remote control lights up!<br><br>Angular is smart. If you are looking at the <strong>Settings</strong> page, Angular automatically finds the "Settings" button and paints it purple. Click around and watch the buttons change color.`,
            hi: `उपयोगकर्ता को कैसे पता चलेगा कि वे किस कमरे में हैं? रिमोट का बटन जल उठता है! यदि आप सेटिंग्स पेज देख रहे हैं, तो एंगुलर स्वचालित रूप से "Settings" बटन को बैंगनी रंग देता है।`,
            ml: `നമ്മൾ ഏത് മുറിയിലാണെന്ന് എങ്ങനെ അറിയാം? റിമോട്ടിലെ ബട്ടൺ കത്തും. സെറ്റിംഗ്സ് പേജിലാണെങ്കിൽ സെറ്റിംഗ്സ് ബട്ടൺ നിറം മാറും.`
          },
          intermediate: {
            en: `This is crucial for User Experience (UX). We use the <code>routerLinkActive</code> directive. You simply tell it: "When this link is active, please add the class 'bg-blue-500'". Angular handles the checking for you automatically.`,
            hi: `यह यूजर एक्सपीरियंस (UX) के लिए महत्वपूर्ण है। हम <code>routerLinkActive</code> डायरेक्टिव का उपयोग करते हैं। आप बस इसे बताते हैं कि कौन सा क्लास जोड़ना है।`,
            ml: `യൂസർ എക്സ്പീരിയൻസിന് ഇത് വളരെ പ്രധാനമാണ്. <code>routerLinkActive</code> ഉപയോഗിച്ച് നമുക്ക് ഇഷ്ടമുള്ള CSS ക്ലാസ് ആഡ് ചെയ്യാം.`
          },
          advanced: {
            en: `By default, this check is "non-exact". If you link to <code>/user</code>, it will stay active even if you are at <code>/user/1/details</code>. This is usually what you want (parent menu stays active).<br><br>If you want exact matching (e.g., for a "Home" link that shouldn't glow when you are deep inside the app), use <code>[routerLinkActiveOptions]="{exact: true}"</code>.`,
            hi: `डिफ़ॉल्ट रूप से, यह जांच "गैर-सटीक" है। यदि आप <code>/user</code> से लिंक करते हैं, तो यह तब भी सक्रिय रहेगा जब आप <code>/user/1/details</code> पर होंगे। सटीक मिलान के लिए <code>{exact: true}</code> का उपयोग करें।`,
            ml: `സാധാരണയായി പേരന്റ് മെനു ആക്ടീവ് ആയിരിക്കാനാണ് നമ്മൾ ആഗ്രഹിക്കുന്നത്. എന്നാൽ കൃത്യമായ മാച്ചിംഗ് വേണമെങ്കിൽ <code>{exact: true}</code> ഉപയോഗിക്കാം.`
          },
          professional: {
            en: `The directive creates a <code>UrlTree</code> for the link and compares it to the router's current state. It performs a subset check. This is efficient, but be careful with heavy computations in templates. The directive re-evaluates on every navigation event.`,
            hi: `डायरेक्टिव लिंक के लिए एक <code>UrlTree</code> बनाता है और इसकी तुलना राउटर की वर्तमान स्थिति से करता है। यह एक सबसेट जांच करता है।`,
            ml: `ലിങ്കിനായി ഒരു <code>UrlTree</code> ഉണ്ടാക്കി നിലവിലെ സ്റ്റേറ്റുമായി താരതമ്യം ചെയ്യുന്നു. ഓരോ നാവിഗേഷനിലും ഇത് നടക്കുന്നു.`
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
          advanced: { en: 'Named Outlets', hi: 'नामित आउटलेट्स', ml: 'പേരുള്ള ഔട്ട്ലെറ്റുകൾ' },
          professional: { en: 'Auxiliary Route State', hi: 'सहायक रूट स्थिति', ml: 'ഓക്സിലിയറി റൂട്ട് സ്റ്റേറ്റ്' }
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
            en: `Look at the screen. We have a big Blue Box (Primary). But we also have a Green Box (Left) and a Red Box (Right).<br><br>We can change the picture in the Green Box <strong>without touching</strong> the Blue Box. It's like watching a movie on TV while playing a game in a small corner window. Try clicking the "Menu" or "Ads" buttons on the left.`,
            hi: `स्क्रीन देखें। हमारे पास एक बड़ा नीला बॉक्स है। लेकिन हमारे पास एक हरा बॉक्स और एक लाल बॉक्स भी है। हम नीले बॉक्स को छुए बिना हरे बॉक्स में तस्वीर बदल सकते हैं।`,
            ml: `നീല ബോക്സിനെ ബാധിക്കാതെ തന്നെ പച്ച ബോക്സിലെ ചിത്രം മാറ്റാം. ടിവിയിൽ സിനിമ കാണുമ്പോൾ ചെറിയ വിൻഡോയിൽ ഗെയിം കളിക്കുന്നത് പോലെയാണിത്.`
          },
          intermediate: {
            en: `Angular allows multiple <code>&lt;router-outlet&gt;</code> tags on one page. One is the "default" (unnamed). The others must have a <code>name</code> attribute (e.g., <code>name="left"</code>).<br><br>These are called <strong>Auxiliary Routes</strong>. They are perfect for sidebars, chat widgets, or modal popups that should have their own URL.`,
            hi: `एंगुलर एक पेज पर कई <code>&lt;router-outlet&gt;</code> टैग की अनुमति देता है। इन्हें <strong>सहायक मार्ग</strong> कहा जाता है। ये साइडबार या चैट विजेट के लिए एकदम सही हैं।`,
            ml: `ഒരേ പേജിൽ ഒന്നിലധികം ഔട്ട്ലെറ്റുകൾ വെക്കാം. ഇവയെ <strong>Auxiliary Routes</strong> എന്ന് വിളിക്കുന്നു. സൈഡ്ബാറുകൾക്കും ചാറ്റ് വിൻഡോകൾക്കും ഇത് നല്ലതാണ്.`
          },
          advanced: {
            en: `The URL for secondary outlets looks unique: <code>/home(left:menu)</code>. The part in parentheses tells Angular: "Keep the primary route at 'home', but ALSO load the 'menu' route into the 'left' outlet."<br><br>To close a secondary outlet, we navigate it to <code>null</code>.`,
            hi: `माध्यमिक आउटलेट्स के लिए URL अद्वितीय दिखता है: <code>/home(left:menu)</code>। कोष्ठक में भाग एंगुलर को बताता है: "प्राथमिक रूट को 'home' पर रखें, लेकिन 'left' आउटलेट में 'menu' रूट लोड करें।"`,
            ml: `സെക്കൻഡറി ഔട്ട്ലെറ്റുകൾക്കായി URL ൽ <code>/home(left:menu)</code> എന്ന് കാണാം. ഇതിനെ ക്ലോസ് ചെയ്യാൻ <code>null</code> ലേക്ക് നാവിഗേറ്റ് ചെയ്യുക.`
          },
          professional: {
            en: `This feature demonstrates the power of the <strong>UrlTree</strong> serializer. Angular serializes independent route branches into a single string. This ensures the <strong>Back Button</strong> works perfectly—if you open the menu, then click Back, the menu closes (the URL reverts to the previous state). State restoration is built-in.`,
            hi: `यह सुविधा <strong>UrlTree</strong> सीरियलाइज़र की शक्ति को प्रदर्शित करती है। यह सुनिश्चित करता है कि बैक बटन पूरी तरह से काम करता है।`,
            ml: `ഇത് <strong>UrlTree</strong> സീരിയലൈസറിന്റെ ശക്തി കാണിക്കുന്നു. ബാക്ക് ബട്ടൺ കൃത്യമായി പ്രവർത്തിക്കുന്നത് ഇതിലൂടെയാണ്.`
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
          intermediate: { en: '404 Error', hi: '404 त्रुटि', ml: '404 പിശക്' },
          advanced: { en: 'Wildcard Route', hi: 'वाइल्डकार्ड रूट', ml: 'വൈൽഡ്കാർഡ് റൂട്ട്' },
          professional: { en: 'Pattern Matching Fallback', hi: 'पैटर्न मिलान फ़ॉलबैक', ml: 'പാറ്റേൺ മാച്ചിംഗ് ഫോൾബാക്ക്' }
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
            en: `What happens if you try to go to a room that doesn't exist? Like <code>/magic-room</code>? <br><br>The app shouldn't crash. Instead, it sends you to the <strong>Lost & Found</strong> department. Try clicking the "Broken Link" in the center panel to see our 404 page.`,
            hi: `क्या होगा यदि आप किसी ऐसे कमरे में जाने का प्रयास करते हैं जो मौजूद नहीं है? ऐप क्रैश नहीं होना चाहिए। इसके बजाय, यह आपको <strong>Lost & Found</strong> विभाग में भेजता है।`,
            ml: `ഇല്ലാത്ത ഒരു മുറിയിലേക്ക് പോയാൽ എന്ത് സംഭവിക്കും? ആപ്ലിക്കേഷൻ ക്രാഷ് ആകില്ല. പകരം "Lost & Found" ലേക്ക് പോകും.`
          },
          intermediate: {
            en: `In web development, we call this a <strong>404 Not Found</strong>. We configure a special route with a path of <code>**</code> (two stars). <br><br>This means "Match Everything". Since Angular reads routes from top to bottom, if it hasn't found a match by the time it reaches the bottom, it uses this wildcard route.`,
            hi: `वेब विकास में, हम इसे <strong>404 Not Found</strong> कहते हैं। हम <code>**</code> के पथ के साथ एक विशेष रूट कॉन्फ़िगर करते हैं।`,
            ml: `ഇതിനെ <strong>404 Not Found</strong> എന്ന് വിളിക്കുന്നു. <code>**</code> എന്ന പാത്ത് ഉപയോഗിച്ചാണ് ഇത് സെറ്റ് ചെയ്യുന്നത്.`
          },
          advanced: {
            en: `Route order is critical. If you defined <code>{ path: '**', ... }</code> at the top of your array, it would match <code>/home</code> immediately (because <code>**</code> matches everything), and your users would never see the home page. Always place the wildcard <strong>LAST</strong>.`,
            hi: `रूट क्रम महत्वपूर्ण है। यदि आप अपनी सरणी के शीर्ष पर <code>**</code> परिभाषित करते हैं, तो यह तुरंत <code>/home</code> से मेल खाएगा। वाइल्डकार्ड को हमेशा अंत में रखें।`,
            ml: `റൂട്ടുകളുടെ ഓർഡർ വളരെ പ്രധാനമാണ്. വൈൽഡ്കാർഡ് ആദ്യം കൊടുത്താൽ ബാക്കിയുള്ളവ വർക്ക് ആകില്ല. അതുകൊണ്ട് എപ്പോഴും അവസാനം കൊടുക്കുക.`
          },
          professional: {
            en: `For enterprise apps, we often use a <code>CanActivate</code> guard on the wildcard route to log the 404 error to an analytics service before displaying the component. Alternatively, we might redirect to a landing page.`,
            hi: `एंटरप्राइज़ ऐप्स के लिए, हम अक्सर 404 त्रुटि को लॉग करने के लिए वाइल्डकार्ड रूट पर CanActivate गार्ड का उपयोग करते हैं।`,
            ml: `എന്റർപ്രൈസ് ആപ്പുകളിൽ 404 എററുകൾ ലോഗ് ചെയ്യാൻ നമ്മൾ വൈൽഡ്കാർഡ് റൂട്ടിൽ ഗാർഡുകൾ ഉപയോഗിക്കാറുണ്ട്.`
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
          beginner: { en: 'The Security Guard', hi: 'सुरक्षा गार्ड', ml: 'സെക്യൂരിറ്റി ഗാർഡ്' },
          intermediate: { en: 'Route Guards', hi: 'रूट गार्ड', ml: 'റൂട്ട് ഗാർഡുകൾ' },
          advanced: { en: 'CanActivateFn', hi: 'CanActivateFn', ml: 'CanActivateFn' },
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
            en: `Some rooms are private, like the Principal's Office. We put a <strong>Security Guard</strong> at the door.<br><br>Before the Router lets you enter the "Admin Page", the Guard checks: "Do you have a key?" If yes, you enter. If no, the Guard sends you back home.`,
            hi: `कुछ कमरे निजी होते हैं, जैसे प्रिंसिपल का कार्यालय। हम दरवाजे पर एक <strong>सुरक्षा गार्ड</strong> रखते हैं। प्रवेश करने से पहले, गार्ड जाँच करता है: "क्या आपके पास चाबी है?"`,
            ml: `ചില മുറികൾ പ്രൈവറ്റ് ആണ്. അവിടെ നമ്മൾ ഒരു സെക്യൂരിറ്റി ഗാർഡിനെ നിർത്തുന്നു. കീ ഉണ്ടെങ്കിൽ മാത്രമേ അകത്തേക്ക് കടത്തിവിടുള്ളൂ.`
          },
          intermediate: {
            en: `In Angular, these are called <strong>Guards</strong>. They are functions that run <em>before</em> the navigation finishes.<br><br>The most common one is <code>canActivate</code>. It returns <code>true</code> (allow) or <code>false</code> (block). If blocked, the page never loads.`,
            hi: `एंगुलर में, इन्हें <strong>Guards</strong> कहा जाता है। ये ऐसे फ़ंक्शन हैं जो नेविगेशन समाप्त होने से पहले चलते हैं। सबसे आम <code>canActivate</code> है।`,
            ml: `ഇതിനെ <strong>Guards</strong> എന്ന് വിളിക്കുന്നു. നാവിഗേഷൻ പൂർത്തിയാകുന്നതിന് മുൻപ് പ്രവർത്തിക്കുന്ന ഫംഗ്ഷനുകളാണിവ. <code>canActivate</code> ആണ് പ്രധാനം.`
          },
          advanced: {
            en: `Modern Angular uses <strong>Functional Guards</strong> (<code>CanActivateFn</code>). They are simpler than the old Class-based guards. You can inject services directly into the function.<br><br>A guard can also return a <code>UrlTree</code>. If it does, the router cancels the current navigation and redirects to that new URL (e.g., redirecting unauthenticated users to <code>/login</code>).`,
            hi: `आधुनिक एंगुलर <strong>Functional Guards</strong> का उपयोग करता है। एक गार्ड <code>UrlTree</code> भी लौटा सकता है।`,
            ml: `പുതിയ ആംഗുലറിൽ <strong>Functional Guards</strong> ആണ് ഉപയോഗിക്കുന്നത്. ഇതിന് <code>UrlTree</code> റിട്ടേൺ ചെയ്യാനും സാധിക്കും.`
          },
          professional: {
            en: `Guards execute in a specific order: <code>CanMatch</code> -> <code>CanLoad</code> -> <code>CanActivateChild</code> -> <code>CanActivate</code>. <br><br>Also, check out <code>CanDeactivate</code>. It runs when a user tries to <em>leave</em> a page. It's perfect for "You have unsaved changes!" warnings.`,
            hi: `गार्ड एक विशिष्ट क्रम में निष्पादित होते हैं। <code>CanDeactivate</code> भी देखें। यह तब चलता है जब कोई उपयोगकर्ता पेज छोड़ने का प्रयास करता है।`,
            ml: `ഗാർഡുകൾക്ക് ഒരു പ്രത്യേക ഓർഡർ ഉണ്ട്. പേജിൽ നിന്ന് പുറത്തുപോകുമ്പോൾ പ്രവർത്തിക്കുന്ന <code>CanDeactivate</code> ഉം ശ്രദ്ധിക്കുക.`
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
          beginner: { en: 'Loading Levels', hi: 'लेवल लोडिंग', ml: 'ലെവൽ ലോഡിംഗ്' },
          intermediate: { en: 'Lazy Loading', hi: 'लेज़ी लोडिंग', ml: 'ലേസി ലോഡിംഗ്' },
          advanced: { en: 'Code Splitting', hi: 'कोड स्प्लिटिंग', ml: 'കോഡ് स्प्लिटिंग' },
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
            en: `If you play a huge video game, it doesn't load all 100 levels at the start. It loads Level 1. When you beat it, it loads Level 2.<br><br>Angular does the same. It only downloads the code for the "Home Page" first. It downloads the "Settings Page" code <strong>only</strong> when you click the Settings button. This makes the app start very fast.`,
            hi: `यदि आप एक बड़ा वीडियो गेम खेलते हैं, तो यह शुरुआत में सभी 100 स्तरों को लोड नहीं करता है। एंगुलर भी ऐसा ही करता है। यह "सेटिंग्स पेज" कोड केवल तभी डाउनलोड करता है जब आप सेटिंग्स बटन पर क्लिक करते हैं।`,
            ml: `ഒരു വലിയ ഗെയിം കളിക്കുമ്പോൾ എല്ലാ ലെവലുകളും ആദ്യം തന്നെ ലോഡ് ആകില്ല. അതുപോലെ ആംഗുലറും ആവശ്യമായ പേജുകൾ മാത്രമേ ആദ്യം ലോഡ് ചെയ്യൂ. ഇതിനെ ലേസി ലോഡിംഗ് എന്ന് വിളിക്കുന്നു.`
          },
          intermediate: {
            en: `This technique is called <strong>Lazy Loading</strong>. Instead of one giant JavaScript file (<code>main.js</code>), the build process splits your code into many small chunks.<br><br>We use the <code>loadChildren</code> or <code>loadComponent</code> property in the route config instead of <code>component</code>.`,
            hi: `इस तकनीक को <strong>Lazy Loading</strong> कहा जाता है। एक विशाल जावास्क्रिप्ट फ़ाइल के बजाय, निर्माण प्रक्रिया आपके कोड को कई छोटे टुकड़ों में विभाजित करती है।`,
            ml: `ഇതിനെ <strong>Lazy Loading</strong> എന്ന് വിളിക്കുന്നു. വലിയ ഫയലുകൾക്ക് പകരം ചെറിയ ചങ്കുകളായി കോഡിനെ മാറ്റുന്നു.`
          },
          advanced: {
            en: `The syntax <code>import('./path')</code> uses dynamic imports, a modern JavaScript feature. It returns a Promise. Angular waits for the network request to finish, loads the class, and then renders the route.<br><br>While loading, the router hangs. You should usually implement a global Loading Indicator to show the user something is happening.`,
            hi: `सिंटैक्स <code>import('./path')</code> डायनामिक आयात का उपयोग करता है। यह एक प्रॉमिस लौटाता है। लोड करते समय, राउटर रुक जाता है।`,
            ml: `<code>import('./path')</code> എന്നത് ഡൈനാമിക് ഇമ്പോർട്ട് ആണ്. ഇത് ഒരു പ്രോമിസ് റിട്ടേൺ ചെയ്യുന്നു. ലോഡിംഗ് സമയത്ത് ഒരു ഇൻഡിക്കേറ്റർ കാണിക്കുന്നത് നല്ലതാണ്.`
          },
          professional: {
            en: `To optimize User Experience, we use <code>PreloadAllModules</code> or custom preloading strategies. This downloads the lazy chunks in the background <em>after</em> the main page renders, so the user gets instant navigation when they eventually click the link.`,
            hi: `उपयोगकर्ता अनुभव को अनुकूलित करने के लिए, हम PreloadAllModules का उपयोग करते हैं। यह पृष्ठभूमि में लेज़ी चंक्स डाउनलोड करता है।`,
            ml: `യൂസർ എക്സ്പീരിയൻസ് മെച്ചപ്പെടുത്താൻ PreloadAllModules ഉപയോഗിക്കുന്നു. ഇത് ബാക്ക്ഗ്രൗണ്ടിൽ ഫയലുകൾ ഡൗൺലോഡ് ചെയ്യുന്നു.`
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
          beginner: { en: 'Birth and Death', hi: 'जन्म और मृत्यु', ml: 'ജനനവും മരണവും' },
          intermediate: { en: 'Component Lifecycle', hi: 'घटक जीवनचक्र', ml: 'കംപോണന്റ് ലൈഫ്സൈക്കിൾ' },
          advanced: { en: 'OnInit vs OnDestroy', hi: 'OnInit बनाम OnDestroy', ml: 'OnInit vs OnDestroy' },
          professional: { en: 'Memory Management', hi: 'मेमोरी प्रबंधन', ml: 'മെമ്മറി മാനേജ്മെന്റ്' }
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
            en: `When the frame shows a new picture, that picture is "Born". When we switch to a different picture, the old one is "Destroyed".<br><br>Angular lets us run code at these moments. We can say "Hello" when a page opens and "Goodbye" when it closes.`,
            hi: `जब फ्रेम एक नई तस्वीर दिखाता है, तो वह तस्वीर "पैदा" होती है। जब हम दूसरी तस्वीर पर स्विच करते हैं, तो पुरानी "नष्ट" हो जाती है।`,
            ml: `ഒരു പുതിയ ചിത്രം വരുമ്പോൾ അത് "ജനിക്കുന്നു". മറ്റൊന്നിലേക്ക് മാറുമ്പോൾ പഴയത് "നശിക്കുന്നു". ഈ സമയങ്ങളിൽ നമുക്ക് കോഡ് റൺ ചെയ്യാം.`
          },
          intermediate: {
            en: `These are called <strong>Lifecycle Hooks</strong>. <br>• <code>ngOnInit</code> runs when the component enters the screen.<br>• <code>ngOnDestroy</code> runs when it leaves.<br><br>Use <code>ngOnDestroy</code> to clean up mess, like stopping timers or closing database connections, so your computer doesn't get slow.`,
            hi: `इन्हें <strong>Lifecycle Hooks</strong> कहा जाता है। <code>ngOnInit</code> तब चलता है जब घटक स्क्रीन में प्रवेश करता है। सफाई के लिए <code>ngOnDestroy</code> का उपयोग करें।`,
            ml: `ഇവയെ <strong>Lifecycle Hooks</strong> എന്ന് വിളിക്കുന്നു. <code>ngOnInit</code> കംപോണന്റ് വരുമ്പോഴും <code>ngOnDestroy</code> പോകുമ്പോഴും പ്രവർത്തിക്കുന്നു.`
          },
          advanced: {
            en: `A common trap for beginners: If you use the same component for two routes (like User 1 to User 2), <strong>ngOnDestroy does NOT run</strong>. The component is reused. <br><br>Always assume your component might stay alive while data changes around it.`,
            hi: `शुरुआती लोगों के लिए एक आम जाल: यदि आप दो रूट के लिए एक ही घटक का उपयोग करते हैं, तो <strong>ngOnDestroy</strong> नहीं चलता है। घटक का पुन: उपयोग किया जाता है।`,
            ml: `ഒരേ കംപോണന്റ് റീയൂസ് ചെയ്യുമ്പോൾ <code>ngOnDestroy</code> പ്രവർത്തിക്കില്ല എന്നത് ശ്രദ്ധിക്കുക.`
          },
          professional: {
            en: `In reactive programming (RxJS), manual subscription management is error-prone. We prefer using the <code>async</code> pipe in templates or <code>takeUntilDestroyed</code> operator in logic to automatically handle lifecycle cleanup.`,
            hi: `RxJS में, हम मैन्युअल सदस्यता से बचते हैं। हम स्वचालित सफाई के लिए async पाइप या takeUntilDestroyed का उपयोग करना पसंद करते हैं।`,
            ml: `RxJS ഉപയോഗിക്കുമ്പോൾ മെമ്മറി ലീക്ക് ഒഴിവാക്കാൻ async പൈപ്പ് അല്ലെങ്കിൽ takeUntilDestroyed ഉപയോഗിക്കുന്നു.`
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
