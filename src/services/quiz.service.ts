import { Injectable, signal, computed } from '@angular/core';

export type QuestionType = 'mcq' | 'fill-blank' | 'code';
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface QuizQuestion {
  id: number;
  level: Level;
  type: QuestionType;
  question: string;
  codeContext?: string; // For code questions, show this context
  options?: string[]; // For MCQ
  correctAnswer: string | string[]; // String for Fill/Code, Array of strings (keywords) for Code fuzzy match
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  // --- STATE ---
  currentLevel = signal<Level>('beginner');
  currentQuestionIndex = signal(0);
  score = signal(0);
  quizState = signal<'intro' | 'active' | 'result'>('intro');
  userAnswers = signal<Map<number, string>>(new Map());
  showExplanation = signal(false);
  isCorrect = signal(false);

  // --- DATA REPOSITORY ---
  private allQuestions: QuizQuestion[] = [];

  constructor() {
    this.initializeQuestions();
  }

  // Base Set of Hand-Crafted Questions (High Quality & Unique)
  private initializeQuestions() {
    this.allQuestions = [
      // ===========================
      // 1. BEGINNER QUESTIONS
      // ===========================
      {
        id: 1, level: 'beginner', type: 'mcq',
        question: 'Which HTML tag acts as the placeholder for the active page content?',
        options: ['<app-root>', '<router-outlet>', '<ng-content>', '<div id="main">'],
        correctAnswer: '<router-outlet>',
        explanation: 'The <router-outlet> is the dynamic container where Angular inserts the component for the current URL.'
      },
      {
        id: 2, level: 'beginner', type: 'fill-blank',
        question: 'To link to the "/home" page without reloading, use the [?] directive instead of href.',
        correctAnswer: 'routerLink',
        explanation: 'Use routerLink="/path" to perform single-page navigation without a full browser refresh.'
      },
      {
        id: 3, level: 'beginner', type: 'code',
        question: 'Write the code to create a link to the "about" page.',
        codeContext: '<!-- template -->',
        correctAnswer: ['routerLink', '"/about"'],
        explanation: '<a routerLink="/about">About</a>'
      },
      {
        id: 4, level: 'beginner', type: 'mcq',
        question: 'Which directive allows you to style a link when its route is active?',
        options: ['ngClass', 'routerLinkActive', 'ngStyle', 'class.active'],
        correctAnswer: 'routerLinkActive',
        explanation: 'routerLinkActive adds a CSS class to the element when the linked route is currently active.'
      },
      {
        id: 5, level: 'beginner', type: 'mcq',
        question: 'What is a "Single Page Application"?',
        options: ['An app with only one component', 'An app that never reloads the browser', 'An app with no CSS', 'A mobile-only app'],
        correctAnswer: 'An app that never reloads the browser',
        explanation: 'SPAs rewrite the current page dynamically with new data from the web server, instead of the default method of the browser loading entire new pages.'
      },
      {
        id: 6, level: 'beginner', type: 'fill-blank',
        question: 'To redirect the empty path "" to "/home", we use the property pathMatch: "[?]".',
        correctAnswer: 'full',
        explanation: 'pathMatch: "full" ensures the redirect only happens when the entire URL is empty, not just matching the prefix.'
      },
      {
        id: 7, level: 'beginner', type: 'code',
        question: 'Navigate to the dashboard programmatically using the Router service.',
        codeContext: 'constructor(private router: Router) {} \n go() { ... }',
        correctAnswer: ['this.router.navigate', "['/dashboard']"],
        explanation: "this.router.navigate(['/dashboard']);"
      },
      {
        id: 8, level: 'beginner', type: 'mcq',
        question: 'Where do you typically define your application routes?',
        options: ['In the HTML', 'In the CSS', 'In a routes array (app.routes.ts)', 'In the index.html'],
        correctAnswer: 'In a routes array (app.routes.ts)',
        explanation: 'Routes are defined as an array of objects mapping paths to components.'
      },


      // ===========================
      // 2. INTERMEDIATE QUESTIONS
      // ===========================
      {
        id: 101, level: 'intermediate', type: 'mcq',
        question: 'How do you define a dynamic route parameter for a user ID?',
        options: ['path: "user/id"', 'path: "user/:id"', 'path: "user/{id}"', 'path: "user?id"'],
        correctAnswer: 'path: "user/:id"',
        explanation: 'The colon (:) denotes a dynamic parameter in the route definition.'
      },
      {
        id: 102, level: 'intermediate', type: 'fill-blank',
        question: 'To catch 404 errors (invalid URLs), define a route with path: "[?]".',
        correctAnswer: '**',
        explanation: 'The double asterisk (**) is the wildcard path that matches any URL.'
      },
      {
        id: 103, level: 'intermediate', type: 'code',
        question: 'Read the "id" parameter from the current route snapshot.',
        codeContext: 'constructor(private route: ActivatedRoute) {}',
        correctAnswer: ['this.route.snapshot.paramMap.get', "'id'"],
        explanation: "const id = this.route.snapshot.paramMap.get('id');"
      },
      {
        id: 104, level: 'intermediate', type: 'mcq',
        question: 'Which service gives you access to the *currently* loaded route details?',
        options: ['Router', 'ActivatedRoute', 'Location', 'PlatformRef'],
        correctAnswer: 'ActivatedRoute',
        explanation: 'ActivatedRoute contains the information about the route associated with the component loaded in an outlet.'
      },
      {
        id: 105, level: 'intermediate', type: 'mcq',
        question: 'What happens if you place the wildcard route (**) at the TOP of your routes array?',
        options: ['Nothing special', 'It matches every URL immediately', 'It is ignored', 'It causes a build error'],
        correctAnswer: 'It matches every URL immediately',
        explanation: 'The router matches routes in order. The wildcard matches everything, so it must be last.'
      },
      {
        id: 106, level: 'intermediate', type: 'fill-blank',
        question: 'To pass optional parameters like "?page=2", use the [?] property in navigation.',
        correctAnswer: 'queryParams',
        explanation: 'queryParams are used for optional key-value pairs at the end of the URL.'
      },
      {
        id: 107, level: 'intermediate', type: 'code',
        question: 'Create a link that opens a "chat" outlet in the sidebar.',
        codeContext: '<!-- HTML -->',
        correctAnswer: ['outlets', 'chat'],
        explanation: '<a [routerLink]="[{ outlets: { sidebar: "chat" } }]">Chat</a>'
      },
      {
        id: 108, level: 'intermediate', type: 'mcq',
        question: 'Which property in the Route object allows you to attach static read-only information?',
        options: ['data', 'params', 'static', 'info'],
        correctAnswer: 'data',
        explanation: 'The `data` property is used to store arbitrary read-only data (like page titles) for a route.'
      },


      // ===========================
      // 3. ADVANCED QUESTIONS
      // ===========================
      {
        id: 201, level: 'advanced', type: 'mcq',
        question: 'Why might ngOnInit NOT run when navigating from /user/1 to /user/2?',
        options: ['A bug in Angular', 'The component is reused', 'Change Detection is off', 'The Router is broken'],
        correctAnswer: 'The component is reused',
        explanation: 'By default, Angular reuses the component instance if the route config is the same, only the params change.'
      },
      {
        id: 202, level: 'advanced', type: 'code',
        question: 'Write a lazy loading route for "admin" that imports "./admin.routes".',
        codeContext: '// routes array',
        correctAnswer: ['path', "'admin'", 'loadChildren', 'import', "'./admin.routes'"],
        explanation: '{ path: "admin", loadChildren: () => import("./admin.routes") }'
      },
      {
        id: 203, level: 'advanced', type: 'mcq',
        question: 'Which guard checks if a user is allowed to leave the current page?',
        options: ['CanActivate', 'CanDeactivate', 'CanMatch', 'CanLoad'],
        correctAnswer: 'CanDeactivate',
        explanation: 'CanDeactivate is used to prevent navigation away from the current route (e.g., unsaved changes).'
      },
      {
        id: 204, level: 'advanced', type: 'fill-blank',
        question: 'To pre-fetch data before a route is activated, use a [?].',
        correctAnswer: 'Resolver',
        explanation: 'Resolvers allow you to fetch data before the router renders the component.'
      },
      {
        id: 205, level: 'advanced', type: 'code',
        question: 'Implement a CanActivateFn that checks if user is logged in.',
        codeContext: 'const authGuard: CanActivateFn = () => ...',
        correctAnswer: ['inject', 'AuthService', 'return', 'true'],
        explanation: 'return inject(AuthService).isLoggedIn() ? true : false;'
      },
      {
        id: 206, level: 'advanced', type: 'mcq',
        question: 'How do you navigate relative to the current route?',
        options: ['router.navigate(..., { relativeTo: this.route })', 'router.navigateRelative(...)', 'router.goBack()', 'Impossible'],
        correctAnswer: 'router.navigate(..., { relativeTo: this.route })',
        explanation: 'You must pass the current ActivatedRoute to the relativeTo property in NavigationExtras.'
      },
      {
        id: 207, level: 'advanced', type: 'mcq',
        question: 'What is the purpose of the "skipLocationChange" option?',
        options: ['It speeds up navigation', 'It navigates without updating the browser URL', 'It skips guards', 'It ignores 404s'],
        correctAnswer: 'It navigates without updating the browser URL',
        explanation: 'This is useful for intermediate states or flows where you do not want the user to bookmark the URL.'
      },
      {
        id: 208, level: 'advanced', type: 'fill-blank',
        question: 'The Router emits a stream of events accessible via Router.[?].',
        correctAnswer: 'events',
        explanation: 'You can subscribe to this.router.events to see NavigationStart, NavigationEnd, etc.'
      },


      // ===========================
      // 4. PROFESSIONAL QUESTIONS
      // ===========================
      {
        id: 301, level: 'professional', type: 'mcq',
        question: 'Which strategy allows you to detach a view and store it in memory instead of destroying it?',
        options: ['RouteReuseStrategy', 'ViewEncapsulation', 'ChangeDetectionStrategy', 'PreloadAllModules'],
        correctAnswer: 'RouteReuseStrategy',
        explanation: 'RouteReuseStrategy allows customization of when to detach/store and reattach route snapshots (e.g., for tabs).'
      },
      {
        id: 302, level: 'professional', type: 'code',
        question: 'Configure the router to scroll to the top on every navigation.',
        codeContext: 'provideRouter(routes, ...)',
        correctAnswer: ['withInMemoryScrolling', 'scrollPositionRestoration', "'top'"],
        explanation: "withInMemoryScrolling({ scrollPositionRestoration: 'top' })"
      },
      {
        id: 303, level: 'professional', type: 'mcq',
        question: 'What is a UrlTree?',
        options: ['A string of the URL', 'A parsed object representing the URL structure', 'A history of URLs', 'A map of all routes'],
        correctAnswer: 'A parsed object representing the URL structure',
        explanation: 'UrlTree handles the hierarchical structure of the URL, including secondary outlets and params, safer than strings.'
      },
      {
        id: 304, level: 'professional', type: 'fill-blank',
        question: 'To handle loading errors for lazy modules (e.g. network fail), subscribe to Router events and check for [?].',
        correctAnswer: 'RouteConfigLoadError',
        explanation: 'RouteConfigLoadError is emitted when a lazy loading module fails to download.'
      },
      {
        id: 305, level: 'professional', type: 'mcq',
        question: 'Difference between CanMatch and CanLoad?',
        options: ['No difference', 'CanMatch can run for eager routes and allows splitting path matches', 'CanLoad is newer', 'CanMatch is deprecated'],
        correctAnswer: 'CanMatch can run for eager routes and allows splitting path matches',
        explanation: 'CanMatch replaces CanLoad. It allows multiple routes with the same path, picking the first one where the guard returns true.'
      },
      {
        id: 306, level: 'professional', type: 'code',
        question: 'Manually create a UrlTree with query params.',
        codeContext: 'router.createUrlTree(...)',
        correctAnswer: ["['/path']", 'queryParams', "{ search: 'term' }"],
        explanation: "this.router.createUrlTree(['/path'], { queryParams: { search: 'term' } });"
      },
      {
        id: 307, level: 'professional', type: 'mcq',
        question: 'What is the TitleStrategy service used for?',
        options: ['Styling the title bar', 'Setting the document <title> based on route config', 'Managing h1 tags', 'Nothing'],
        correctAnswer: 'Setting the document <title> based on route config',
        explanation: 'Introduced in Angular 14, it automates setting the browser title from the route "title" property.'
      },
      {
        id: 308, level: 'professional', type: 'fill-blank',
        question: 'When using named outlets, the URL segment for the outlet is enclosed in [?].',
        correctAnswer: 'parentheses',
        explanation: 'e.g., /home(sidebar:chat) - The parentheses denote the secondary route branch.'
      }
    ];
  }

  // --- COMPUTED ---
  
  questionsForLevel = computed(() => {
    return this.allQuestions.filter(q => q.level === this.currentLevel());
  });

  currentQuestion = computed(() => {
    const questions = this.questionsForLevel();
    return questions[this.currentQuestionIndex()] || null;
  });

  progress = computed(() => {
    const total = this.questionsForLevel().length;
    if (total === 0) return 0;
    return ((this.currentQuestionIndex()) / total) * 100;
  });

  // --- ACTIONS ---

  startQuiz(level: Level) {
    this.currentLevel.set(level);
    this.currentQuestionIndex.set(0);
    this.score.set(0);
    this.quizState.set('active');
    this.userAnswers.update(m => { m.clear(); return new Map(m); });
    this.showExplanation.set(false);
  }

  submitAnswer(answer: string) {
    const q = this.currentQuestion();
    if (!q) return;

    let correct = false;

    // VALIDATION LOGIC
    if (q.type === 'mcq') {
      correct = answer === q.correctAnswer;
    } 
    else if (q.type === 'fill-blank') {
      correct = answer.toLowerCase().trim() === (q.correctAnswer as string).toLowerCase().trim();
    } 
    else if (q.type === 'code') {
      const requiredTokens = q.correctAnswer as string[];
      // Remove all whitespace and special chars for fuzzy matching
      const userCode = answer.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      
      correct = requiredTokens.every(token => {
        const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return userCode.includes(cleanToken);
      });
    }

    this.isCorrect.set(correct);
    if (correct) {
      this.score.update(s => s + 10);
    }

    this.showExplanation.set(true);
  }

  nextQuestion() {
    this.showExplanation.set(false);
    const nextIdx = this.currentQuestionIndex() + 1;
    if (nextIdx >= this.questionsForLevel().length) {
      this.quizState.set('result');
    } else {
      this.currentQuestionIndex.set(nextIdx);
    }
  }

  restart() {
    this.quizState.set('intro');
  }
}
