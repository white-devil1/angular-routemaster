import { Injectable, signal, computed, inject } from '@angular/core';
import { LanguageService } from './language.service';

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface TutorialStep {
  id: number;
  module: string;
  title: string;
  content: string; // The explanation text
  codeSnippet: string; // The code to show in "View Code"
  focusArea: 'intro' | 'primary' | 'active' | 'params' | 'wildcard' | 'left' | 'right' | 'url';
}

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private langService = inject(LanguageService);
  
  private _currentStepIndex = signal(0);
  currentLevel = signal<Level>('beginner');

  // Helper to get content based on Level and Language
  private getContent(
    enBeginner: string, enPro: string, 
    hiBeginner: string, hiPro: string,
    mlBeginner: string, mlPro: string
  ): string {
    const lang = this.langService.currentLang();
    const level = this.currentLevel();
    const isPro = level === 'advanced' || level === 'professional';

    if (lang === 'hi') return isPro ? hiPro : hiBeginner;
    if (lang === 'ml') return isPro ? mlPro : mlBeginner;
    // Default English
    return isPro ? enPro : enBeginner;
  }

  readonly steps = computed<TutorialStep[]>(() => {
    const l = this.langService;
    const lvl = this.currentLevel();

    return [
      // --- STEP 1: INTRO ---
      {
        id: 1,
        module: 'Basics',
        title: l.get('Concept', 'संकल्पना', 'ആശയം'),
        focusArea: 'intro',
        codeSnippet: `<!-- app.component.html -->\n<router-outlet></router-outlet>`,
        content: this.getContent(
          // EN Beginner
          `👋 <strong>Hello Student!</strong><br>Imagine this screen is a <strong>Picture Frame</strong>. The Routing system is like a hand that changes the photo inside the frame without you having to buy a new frame.<br><br>The frame is called <code>&lt;router-outlet&gt;</code>.`,
          // EN Pro
          `<strong>Router Outlet Architecture</strong><br>The <code>RouterOutlet</code> directive acts as a dynamic placeholder in your template. It interacts with the <code>Router</code> service to instantiate components based on the current browser URL state.<br><br>It functions similarly to a slot in Web Components but is tied strictly to the routing configuration tree.`,
          
          // HI Beginner
          `👋 <strong>नमस्ते छात्र!</strong><br>कल्पना कीजिए कि यह स्क्रीन एक तस्वीर का फ्रेम है। राउटिंग वह हाथ है जो फ्रेम को बदले बिना उसके अंदर की फोटो बदल देता है।`,
          // HI Pro
          `<strong>राउटर आर्किटेक्चर</strong><br><code>RouterOutlet</code> आपके टेम्प्लेट में एक गतिशील प्लेसहोल्डर के रूप में कार्य करता है। यह ब्राउज़र URL स्थिति के आधार पर घटकों (components) को लोड करता है।`,

          // ML Beginner
          `👋 <strong>നമസ്കാരം!</strong><br>ഈ സ്ക്രീൻ ഒരു ഫോട്ടോ ഫ്രെയിം ആണെന്ന് കരുതുക. ഫ്രെയിം മാറ്റാതെ അതിനുള്ളിലെ ചിത്രം മാറ്റുന്നതിനെയാണ് റൗട്ടിംഗ് എന്ന് വിളിക്കുന്നത്.`,
          // ML Pro
          `<strong>റൗട്ടർ ആർക്കിടെക്ചർ</strong><br><code>RouterOutlet</code> എന്നത് ടെംപ്ലേറ്റിലെ ഒരു ഡൈനാമിക് പ്ലേസ്ഹോൾഡർ ആണ്. URL മാറുന്നതിനനുസരിച്ച് കംപോണന്റുകളെ ലോഡ് ചെയ്യാൻ ഇത് സഹായിക്കുന്നു.`
        )
      },

      // --- STEP 2: PRIMARY OUTLET ---
      {
        id: 2,
        module: 'Basics',
        title: 'Primary Outlet',
        focusArea: 'primary',
        codeSnippet: `const routes = [\n  { path: 'home', component: HomeComponent },\n  { path: 'dashboard', component: DashboardComponent }\n];`,
        content: this.getContent(
          `The <strong>Blue Box</strong> is the main frame. When you click "Home", the router finds the <strong>Home Card</strong> and puts it in the box.<br>👉 <strong>Try it:</strong> Click the navigation buttons in the center.`,
          `<strong>Default Outlet Configuration</strong><br>Un-named outlets are treated as 'primary'. When the router matches a URL segment (e.g., <code>/home</code>), it looks for the leaf node in the route config and instantiates the class into this DOM location.`,
          `नीला बॉक्स मुख्य फ्रेम है। जब आप "Home" पर क्लिक करते हैं, तो राउटर होम कार्ड ढूंढता है और उसे बॉक्स में डाल देता है।`,
          `अनाम आउटलेट्स को 'primary' माना जाता है। जब URL मैच होता है, तो राउटर उस जगह पर कंपोनेंट को रेंडर करता है।`,
          `നീല ബോക്സ് ആണ് പ്രധാന ഫ്രെയിം. നിങ്ങൾ "Home" ക്ലിക്ക് ചെയ്യുമ്പോൾ, റൗട്ടർ ആ പേജ് കണ്ടെത്തി ഇതിൽ കാണിക്കുന്നു.`,
          `പേരില്ലാത്ത ഔട്ട്ലെറ്റുകളെ 'primary' എന്ന് വിളിക്കുന്നു. URL മാറുമ്പോൾ അതിനനുസരിച്ചുള്ള കംപോണന്റ് ഇവിടെ വരുന്നു.`
        )
      },

      // --- STEP 3: ACTIVE LINKS ---
      {
        id: 3,
        module: 'Styling',
        title: 'RouterLinkActive',
        focusArea: 'active',
        codeSnippet: `<a routerLink="/settings"\n   routerLinkActive="active-class">\n  Settings\n</a>`,
        content: this.getContent(
          `How does the user know which button they clicked? Angular can light up the button automatically!<br>👉 <strong>Look:</strong> When you visit "Settings", the button turns purple.`,
          `<strong>Visual State Feedback</strong><br>The <code>RouterLinkActive</code> directive tracks the current router state. It applies a CSS class to the element whenever the linked route is active. This is crucial for UX accessibility.`,
          `उपयोगकर्ता को कैसे पता चलेगा कि उन्होंने कौन सा बटन क्लिक किया? एंगुलर बटन को स्वचालित रूप से हाइलाइट कर सकता है!`,
          `<code>RouterLinkActive</code> निर्देश वर्तमान राउटर स्थिति को ट्रैक करता है और सक्रिय होने पर CSS क्लास लागू करता है।`,
          `ഏത് ബട്ടണാണ് ക്ലിക്ക് ചെയ്തതെന്ന് എങ്ങനെ അറിയാം? ആംഗുലർ അത് തനിയെ കാണിച്ചുതരും. "Settings" ക്ലിക്ക് ചെയ്യുമ്പോൾ നിറം മാറുന്നത് ശ്രദ്ധിക്കുക.`,
          `<code>RouterLinkActive</code> ഉപയോഗിച്ച് നിലവിലെ പേജ് ഏതാണെന്ന് മനസിലാക്കി CSS ക്ലാസ് മാറ്റാൻ സാധിക്കും.`
        )
      },

      // --- STEP 4: PARAMS ---
      {
        id: 4,
        module: 'Dynamic Data',
        title: 'Route Parameters',
        focusArea: 'params',
        codeSnippet: `// Route Config\n{ path: 'user/:id', component: UserComponent }\n\n// Component\nthis.route.paramMap.subscribe(p => this.id = p.get('id'));`,
        content: this.getContent(
          `Imagine ID cards. The card looks the same, but the name and number change.<br>👉 <strong>Task:</strong> Click User 1 or 99. The URL changes to <code>/user/1</code>, and the box shows "1".`,
          `<strong>Parameterized Routing</strong><br>We define tokens like <code>:id</code> in the route path. These are extracted via <code>ActivatedRoute</code> service using Observables, allowing the same component instance to handle infinite variations of data.`,
          `ID कार्ड की कल्पना करें। कार्ड एक जैसा दिखता है, लेकिन नाम और नंबर बदल जाते हैं। URL में ID बदलती है।`,
          `हम रूट पथ में <code>:id</code> जैसे टोकन परिभाषित करते हैं। इन्हें <code>ActivatedRoute</code> सेवा के माध्यम से निकाला जाता है।`,
          `ID കാർഡുകൾ പോലെയാണിത്. കാർഡ് ഒന്നുതന്നെ, പക്ഷെ അതിലെ വിവരങ്ങൾ മാറും. ഇവിടെ URL-ൽ ID മാറുന്നു.`,
          `റൂട്ട് പാത്തിൽ <code>:id</code> ഉപയോഗിക്കുന്നു. <code>ActivatedRoute</code> വഴി ഈ വിവരങ്ങൾ എടുക്കാം.`
        )
      },

      // --- STEP 5: NAMED OUTLETS ---
      {
        id: 5,
        module: 'Advanced',
        title: 'Named Outlets',
        focusArea: 'left',
        codeSnippet: `<router-outlet name="left"></router-outlet>\n\n// Link\n[routerLink]="[{ outlets: { left: 'menu' } }]"\n// URL\n(left:menu)`,
        content: this.getContent(
          `We can have extra frames on the wall! The Green box is named "left".<br>We can change the picture in the Green box without touching the Blue box.`,
          `<strong>Auxiliary Routes</strong><br>Angular supports multiple outlets. Named outlets allow for independent navigation branches. This URL structure <code>(outlet:route)</code> uses parentheses to specify secondary segments.`,
          `हमारे पास दीवार पर अतिरिक्त फ्रेम हो सकते हैं! हरे बॉक्स का नाम "left" है। हम नीले बॉक्स को छुए बिना हरे बॉक्स में तस्वीर बदल सकते हैं।`,
          `एंगुलर कई आउटलेट्स का समर्थन करता है। नामित आउटलेट्स स्वतंत्र नेविगेशन शाखाओं की अनुमति देते हैं।`,
          `നമുക്ക് ഒന്നിലധികം ഫ്രെയിമുകൾ വെക്കാം. പച്ച ബോക്സിന്റെ പേര് "left" എന്നാണ്. നീല ബോക്സിനെ ബാധിക്കാതെ തന്നെ ഇതിലെ ചിത്രം മാറ്റാം.`,
          `ആംഗുലർ ഒന്നിലധികം ഔട്ട്ലെറ്റുകളെ സപ്പോർട്ട് ചെയ്യുന്നു. ഇതിനെ Auxiliary Routes എന്ന് വിളിക്കുന്നു.`
        )
      },

      // --- STEP 6: WILDCARD ---
      {
        id: 6,
        module: 'Errors',
        title: '404 Wildcard',
        focusArea: 'wildcard',
        codeSnippet: `// Must be the LAST route\n{ path: '**', component: NotFoundComponent }`,
        content: this.getContent(
          `What if someone gets lost? We need a "Lost & Found" page.<br>👉 <strong>Task:</strong> Click "Broken Link". The Router sees a strange URL and sends you to the Error Page.`,
          `<strong>Wildcard Strategy</strong><br>The <code>**</code> path matches <em>any</em> URL that hasn't been matched by previous rules. It functions as a catch-all fallback for error handling (404s).`,
          `अगर कोई खो जाए तो क्या होगा? हमें "Page Not Found" पेज चाहिए।`,
          `<code>**</code> पथ किसी भी ऐसे URL से मेल खाता है जो पिछले नियमों से मेल नहीं खाता है।`,
          `ആരെങ്കിലും വഴിതെറ്റിയാലോ? അതിനായി നമുക്കൊരു "Error Page" വേണം. തെറ്റായ URL ടൈപ്പ് ചെയ്താൽ ഇവിടെ എത്തും.`,
          `<code>**</code> പാത്ത് ഉപയോഗിച്ച് മാച്ച് ആവാത്ത എല്ലാ URL-കളെയും പിടിച്ചെടുക്കാം.`
        )
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
    this.currentLevel.set(level);
  }

  next() { if (!this.isLast()) this._currentStepIndex.update(i => i + 1); }
  prev() { if (!this.isFirst()) this._currentStepIndex.update(i => i - 1); }
  goTo(index: number) { 
    if (index >= 0 && index < this.steps().length) this._currentStepIndex.set(index); 
  }
}