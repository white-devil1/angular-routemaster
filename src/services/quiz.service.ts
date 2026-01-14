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
  quizState = signal<'intro' | 'active' | 'result'>('intro');
  showExplanation = signal(false);
  isCorrect = signal(false);
  submittedAnswers = signal<Map<number, {userAnswer: string, isCorrect: boolean}>>(new Map());

  // --- DATA REPOSITORY ---
  private allQuestions: QuizQuestion[] = [];

  constructor() {
    this.initializeQuestions();
  }

  // --- RESET FOR NEW SESSION ---
  reset() {
    this.quizState.set('intro');
    this.currentQuestionIndex.set(0);
    this.submittedAnswers.update(m => { m.clear(); return new Map(m); });
    this.showExplanation.set(false);
  }

  // Base Set of Hand-Crafted Questions (High Quality & Unique)
  private initializeQuestions() {
    this.allQuestions = [
      // ===========================
      // 1. BEGINNER QUESTIONS (25)
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
        codeContext: '<a ... >About</a>',
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
      { id: 9, level: 'beginner', type: 'mcq', question: 'What does SPA stand for?', options: ['Single Point of Access', 'Single Page Application', 'Software Purchase Agreement', 'System Protocol Analytics'], correctAnswer: 'Single Page Application', explanation: 'SPA stands for Single Page Application, a web application that interacts with the user by dynamically rewriting the current page rather than loading entire new pages from a server.' },
      { id: 10, level: 'beginner', type: 'fill-blank', question: 'The main configuration for the router is an array of [?].', correctAnswer: 'routes', explanation: 'The router is configured with an array of Route objects.' },
      { id: 11, level: 'beginner', type: 'mcq', question: 'Which of the following is NOT a benefit of using the Angular Router?', options: ['Faster navigation', 'Improved user experience', 'Automatic server-side rendering', 'State management between views'], correctAnswer: 'Automatic server-side rendering', explanation: 'The Angular Router provides client-side navigation. Server-side rendering (SSR) is a separate feature.' },
      { id: 12, level: 'beginner', type: 'code', question: 'What is the most basic route definition for a "home" path?', codeContext: "{ path: 'home', ... }", correctAnswer: ['component', 'HomeComponent'], explanation: "{ path: 'home', component: HomeComponent } is the most basic route definition." },
      { id: 13, level: 'beginner', type: 'mcq', question: 'What is the purpose of `pathMatch: "full"`?', options: ['To match the full domain name', 'To ensure the entire URL path matches', 'To load the component fully', 'To enable full-screen mode'], correctAnswer: 'To ensure the entire URL path matches', explanation: '`pathMatch: "full"` is used in redirects to ensure that the router only redirects if the entire URL matches the specified path.' },
      { id: 14, level: 'beginner', type: 'fill-blank', question: 'The component that contains the `<router-outlet>` is often called the [?] component.', correctAnswer: 'shell', explanation: 'The main application component holding the primary router outlet is often referred to as the app shell.' },
      { id: 15, level: 'beginner', type: 'mcq', question: 'To create a link, you should use:', options: ['<a href="/about">', '<button routerLink="/about">', '<a routerLink="/about">', '<div>/about</div>'], correctAnswer: '<a routerLink="/about">', explanation: 'The `routerLink` directive should be used on an anchor `<a>` tag for accessible navigation.' },
      { id: 16, level: 'beginner', type: 'code', question: 'Add a `title` to the "settings" route that says "My Settings".', codeContext: "{ path: 'settings', component: SettingsComponent, ... }", correctAnswer: ['title', "'My Settings'"], explanation: "{ path: 'settings', component: SettingsComponent, title: 'My Settings' }" },
      { id: 17, level: 'beginner', type: 'mcq', question: 'If you see the page flash white when clicking a link, what is likely the problem?', options: ['`routerLink` was used', 'The CSS is broken', 'An `href` was used instead of `routerLink`', 'The internet is slow'], correctAnswer: 'An `href` was used instead of `routerLink`', explanation: 'A white flash indicates a full page reload, which is caused by using a standard `href` for internal navigation.' },
      { id: 18, level: 'beginner', type: 'fill-blank', question: 'You inject the [?] service to navigate programmatically.', correctAnswer: 'Router', explanation: 'The `Router` service from `@angular/router` is used for programmatic navigation.' },
      { id: 19, level: 'beginner', type: 'mcq', question: 'What file is typically created to hold the routes array?', options: ['app.component.ts', 'app.routes.ts', 'main.ts', 'routes.json'], correctAnswer: 'app.routes.ts', explanation: 'In modern standalone Angular, `app.routes.ts` is the conventional file for defining routes.' },
      { id: 20, level: 'beginner', type: 'code', question: 'Create a redirect from an old path "profile" to "user/me".', codeContext: '{ ... }', correctAnswer: ["path: 'profile'", "redirectTo: 'user/me'", "pathMatch: 'full'"], explanation: "{ path: 'profile', redirectTo: 'user/me', pathMatch: 'full' }" },
      { id: 21, level: 'beginner', type: 'mcq', question: 'What does the `routerLinkActive` directive do?', options: ['It activates the route', 'It adds a CSS class when the link is active', 'It disables the link when active', 'It makes the link bigger'], correctAnswer: 'It adds a CSS class when the link is active', explanation: '`routerLinkActive` is used to toggle CSS classes on an element when its corresponding `routerLink` is active.' },
      { id: 22, level: 'beginner', type: 'fill-blank', question: 'The router is provided to the application using the [?] function.', correctAnswer: 'provideRouter', explanation: 'In standalone applications, `provideRouter(routes)` is used in the bootstrap process.' },
      { id: 23, level: 'beginner', type: 'mcq', question: 'A route object maps a `path` to a [?].', options: ['template', 'module', 'service', 'component'], correctAnswer: 'component', explanation: 'The most basic function of a route is to map a URL path to a component to be displayed.' },
      { id: 24, level: 'beginner', type: 'code', question: 'Add the `routerLinkActive` directive to a link to apply the class "active-link".', codeContext: '<a routerLink="/home" ... >Home</a>', correctAnswer: ['routerLinkActive', "'active-link'"], explanation: '<a routerLink="/home" routerLinkActive="active-link">Home</a>' },
      { id: 25, level: 'beginner', type: 'mcq', question: 'To use the router, you must import `provideRouter` from where?', options: ['@angular/core', '@angular/common', '@angular/router', '@angular/platform-browser'], correctAnswer: '@angular/router', explanation: 'All router-related APIs, including `provideRouter`, come from the `@angular/router` package.' },

      // ===========================
      // 2. INTERMEDIATE QUESTIONS (25)
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
        question: 'Create a link that opens a "chat" component in a named outlet called "sidebar".',
        codeContext: '<a ...>Chat</a>',
        correctAnswer: ['[routerLink]', "{ outlets: { sidebar: 'chat' } }"],
        explanation: '<a [routerLink]="[{ outlets: { sidebar: \'chat\' } }]">Chat</a>'
      },
      {
        id: 108, level: 'intermediate', type: 'mcq',
        question: 'Which property in the Route object allows you to attach static read-only information?',
        options: ['data', 'params', 'static', 'info'],
        correctAnswer: 'data',
        explanation: 'The `data` property is used to store arbitrary read-only data (like page titles or roles) for a route.'
      },
      { id: 109, level: 'intermediate', type: 'mcq', question: 'Why is it better to subscribe to `route.paramMap` instead of using the snapshot?', options: ["It's shorter to write", "The snapshot is often incorrect", "The component might be reused for the same route", "It has better performance"], correctAnswer: "The component might be reused for the same route", explanation: "If you navigate from /user/1 to /user/2, the component is reused. `ngOnInit` doesn't fire again, but the `paramMap` observable will emit the new ID." },
      { id: 110, level: 'intermediate', type: 'fill-blank', question: 'A function that runs before a route is activated is called a route [?].', correctAnswer: 'guard', explanation: 'Route Guards, like CanActivate, run before a route is activated to determine if navigation is allowed.' },
      { id: 111, level: 'intermediate', type: 'mcq', question: 'What is the purpose of a `CanActivate` guard?', options: ['To activate a component manually', 'To decide if a route can be activated', 'To check if a component can be deactivated', 'To load data before activation'], correctAnswer: 'To decide if a route can be activated', explanation: 'A `CanActivate` guard returns true, false, or a UrlTree to control access to a route, often used for authentication.' },
      { id: 112, level: 'intermediate', type: 'code', question: 'Define a route for a named outlet "popup" that loads `HelpComponent`.', codeContext: '{...}', correctAnswer: ["path: 'help'", "component: HelpComponent", "outlet: 'popup'"], explanation: "{ path: 'help', component: HelpComponent, outlet: 'popup' }" },
      { id: 113, level: 'intermediate', type: 'mcq', question: 'What is the primary benefit of lazy loading?', options: ['It makes the code easier to read', 'It reduces the initial bundle size', 'It speeds up the development server', 'It automatically adds security'], correctAnswer: 'It reduces the initial bundle size', explanation: 'Lazy loading splits the app into smaller chunks that are loaded on demand, leading to a faster initial load time.' },
      { id: 114, level: 'intermediate', type: 'fill-blank', question: 'In modern Angular, you use `loadComponent` instead of `loadChildren` for a single [?] component.', correctAnswer: 'standalone', explanation: '`loadChildren` is used for lazy-loading modules or a set of routes, while `loadComponent` is used for lazy-loading a single standalone component.' },
      { id: 115, level: 'intermediate', type: 'mcq', question: 'How do you clear a named outlet?', options: ["Set its path to 'empty'", "Navigate with the outlet set to `null`", "You cannot clear it, only replace it", "Use `router.clearOutlet('name')`"], correctAnswer: "Navigate with the outlet set to `null`", explanation: "To programmatically close a named outlet, you navigate and set its value to `null`, like `[{ outlets: { popup: null } }]`." },
      { id: 116, level: 'intermediate', type: 'code', question: 'Navigate to "/invoices" with a query parameter `status=paid`.', codeContext: 'this.router.navigate(...)', correctAnswer: ["['/invoices']", 'queryParams', "{ status: 'paid' }"], explanation: "this.router.navigate(['/invoices'], { queryParams: { status: 'paid' } });" },
      { id: 117, level: 'intermediate', type: 'mcq', question: 'What does `[routerLinkActiveOptions]="{exact: true}"` do?', options: ['It makes the link more accurate', 'It ensures the active class is applied only for an exact URL match', 'It forces an exact component match', 'It is required for all home links'], correctAnswer: 'It ensures the active class is applied only for an exact URL match', explanation: 'By default, `routerLinkActive` matches prefixes (e.g., "/" matches every route). `{exact: true}` prevents this for root-level links.' },
      { id: 118, level: 'intermediate', type: 'fill-blank', question: 'The part of the URL after a `#` is called the [?].', correctAnswer: 'fragment', explanation: 'The fragment is often used to link to a specific section of a page, and can be set during navigation with the `fragment` property.' },
      { id: 119, level: 'intermediate', type: 'mcq', question: 'Which router event fires right before navigation begins?', options: ['NavigationEnd', 'RoutesRecognized', 'NavigationStart', 'ActivationStart'], correctAnswer: 'NavigationStart', explanation: '`NavigationStart` is the first event in the navigation lifecycle.' },
      { id: 120, level: 'intermediate', type: 'code', question: 'Redirect a 404 wildcard path to the "/home" page.', codeContext: '{...}', correctAnswer: ["path: '**'", "redirectTo: 'home'"], explanation: "{ path: '**', redirectTo: 'home' }" },
      { id: 121, level: 'intermediate', type: 'mcq', question: 'How can you pass complex object data during navigation that does not appear in the URL?', options: ['Using the `data` property', 'Using queryParams', 'Using navigation `state`', 'It is not possible'], correctAnswer: 'Using navigation `state`', explanation: 'The `state` object in `NavigationExtras` allows you to pass temporary, complex data to the destination component via `history.state`.' },
      { id: 122, level: 'intermediate', type: 'fill-blank', question: 'A `CanDeactivate` guard is most commonly used to prevent users from losing [?] changes.', correctAnswer: 'unsaved', explanation: '`CanDeactivate` is perfect for checking a form\'s dirty state and prompting the user before they navigate away.' },
      { id: 123, level: 'intermediate', type: 'mcq', question: 'Nested `<router-outlet>` elements create what kind of routes?', options: ['Sibling routes', 'Child routes', 'Parent routes', 'Auxiliary routes'], correctAnswer: 'Child routes', explanation: 'A component loaded into an outlet can have its own `<router-outlet>` for its children, creating a hierarchy.' },
      { id: 124, level: 'intermediate', type: 'code', question: 'Define a child route "/settings" inside a "/user/:id" route.', codeContext: "{ path: 'user/:id', component: UserComponent, children: [ ... ] }", correctAnswer: ["{ path: 'settings', component: SettingsComponent }"], explanation: "The `children` property of a route definition takes another array of routes." },
      { id: 125, level: 'intermediate', type: 'mcq', question: 'The URL for a named outlet looks like:', options: ['/home/popup:chat', '/home?popup=chat', '/home/(popup:chat)', '/home#popup=chat'], correctAnswer: '/home/(popup:chat)', explanation: 'Auxiliary routes are serialized inside parentheses in the URL string.' },
      
      // ===========================
      // 3. ADVANCED QUESTIONS (25)
      // ===========================
      {
        id: 201, level: 'advanced', type: 'mcq',
        question: 'Why might ngOnInit NOT run when navigating from /user/1 to /user/2?',
        options: ['A bug in Angular', 'The component is reused', 'Change Detection is off', 'The Router is broken'],
        correctAnswer: 'The component is reused',
        explanation: 'By default, Angular reuses the component instance if the route config is the same, only the params change. This is a performance optimization.'
      },
      {
        id: 202, level: 'advanced', type: 'code',
        question: 'Write a lazy loading route for an "admin" feature that imports its routes from "./admin.routes".',
        codeContext: '// routes array',
        correctAnswer: ['path', "'admin'", 'loadChildren', 'import', "'./admin.routes'"],
        explanation: '{ path: "admin", loadChildren: () => import("./admin.routes") }'
      },
      {
        id: 203, level: 'advanced', type: 'mcq',
        question: 'Which guard checks if a user is allowed to leave the current page?',
        options: ['CanActivate', 'CanDeactivate', 'CanMatch', 'CanLoad'],
        correctAnswer: 'CanDeactivate',
        explanation: 'CanDeactivate is used to prevent navigation away from the current route (e.g., to warn about unsaved changes).'
      },
      {
        id: 204, level: 'advanced', type: 'fill-blank',
        question: 'To pre-fetch data before a route is activated, you should use a [?].',
        correctAnswer: 'Resolver',
        explanation: 'Resolvers are route guards that run before a route is activated, allowing you to fetch data that the component will need.'
      },
      {
        id: 205, level: 'advanced', type: 'code',
        question: 'Implement a functional CanActivateFn that redirects to "/login" if the user is not authenticated.',
        codeContext: 'const authGuard: CanActivateFn = () => ...',
        correctAnswer: ['inject', 'AuthService', 'isLoggedIn', 'inject(Router).createUrlTree', "['/login']"],
        explanation: "const router = inject(Router); return inject(AuthService).isLoggedIn() ? true : router.createUrlTree(['/login']);"
      },
      {
        id: 206, level: 'advanced', type: 'mcq',
        question: 'How do you navigate relative to the current route?',
        options: ['router.navigate(..., { relativeTo: this.route })', 'router.navigateRelative(...)', 'router.goBack()', 'It is not possible'],
        correctAnswer: 'router.navigate(..., { relativeTo: this.route })',
        explanation: 'You must pass the current ActivatedRoute to the `relativeTo` property in NavigationExtras to provide context for the relative navigation.'
      },
      {
        id: 207, level: 'advanced', type: 'mcq',
        question: 'What is the purpose of the "skipLocationChange" navigation option?',
        options: ['It speeds up navigation', 'It navigates without updating the browser URL', 'It skips guards and resolvers', 'It ignores 404 errors'],
        correctAnswer: 'It navigates without updating the browser URL',
        explanation: 'This is useful for intermediate states or flows (like in a wizard) where you do not want the user to be able to bookmark or share the URL.'
      },
      {
        id: 208, level: 'advanced', type: 'fill-blank',
        question: 'The Router emits a stream of navigation events accessible via `Router.[?]`.',
        correctAnswer: 'events',
        explanation: 'You can subscribe to `this.router.events` to react to the entire navigation lifecycle (NavigationStart, NavigationEnd, etc.).'
      },
      { id: 209, level: 'advanced', type: 'mcq', question: 'What is the difference between `redirectTo` and returning a `UrlTree` from a guard?', options: ['No difference', '`redirectTo` is for static redirects in the config, `UrlTree` is for dynamic redirects in code', '`UrlTree` is faster', '`redirectTo` is deprecated'], correctAnswer: '`redirectTo` is for static redirects in the config, `UrlTree` is for dynamic redirects in code', explanation: 'The `redirectTo` property in a route definition is static. Guards use `UrlTree` to perform conditional, programmatic redirects.' },
      { id: 210, level: 'advanced', type: 'fill-blank', question: 'To preserve query parameters during navigation, you can use the [?] property.', correctAnswer: 'queryParamsHandling', explanation: '`queryParamsHandling: "preserve"` or `"merge"` can be used to automatically carry over or merge query parameters to the next route.' },
      { id: 211, level: 'advanced', type: 'mcq', question: 'Which of these is NOT a valid router event?', options: ['NavigationStart', 'NavigationEnd', 'NavigationError', 'NavigationFinished'], correctAnswer: 'NavigationFinished', explanation: 'The main events are NavigationStart, NavigationEnd, NavigationCancel, and NavigationError.' },
      { id: 212, level: 'advanced', type: 'code', question: 'Write a route that uses a custom `data` property to set a page title.', codeContext: '{...}', correctAnswer: ["path: 'about'", "component: AboutComponent", "data: { title: 'About Us' }"], explanation: "The `data` property is a way to associate static data with a route, which can then be read from the `ActivatedRoute`." },
      { id: 213, level: 'advanced', type: 'mcq', question: 'What is a "matrix" URL parameter?', options: ['A parameter in the URL fragment', 'A parameter for a specific route segment, e.g., `/users;role=admin`', 'A type of query parameter', 'An encrypted parameter'], correctAnswer: 'A parameter for a specific route segment, e.g., `/users;role=admin`', explanation: 'Matrix parameters, separated by semicolons, are less common but allow for parameters to be tied to a specific segment of a URL path.' },
      { id: 214, level: 'advanced', type: 'fill-blank', question: 'To customize how the router reuses components, you can provide a custom [?].', correctAnswer: 'RouteReuseStrategy', explanation: '`RouteReuseStrategy` is an advanced feature allowing developers to define custom logic for when components should be detached/reattached instead of destroyed/recreated.' },
      { id: 215, level: 'advanced', type: 'mcq', question: 'What does a router `Resolver` function return?', options: ['boolean', 'UrlTree', 'A value or an Observable/Promise of a value', 'void'], correctAnswer: 'A value or an Observable/Promise of a value', explanation: 'A resolver function returns the data that should be available to the component. The router waits for the Observable or Promise to resolve before activating the route.' },
      { id: 216, level: 'advanced', type: 'code', question: 'Access the resolved data named "user" from the `ActivatedRoute`.', codeContext: 'ngOnInit() { ... }', correctAnswer: ['this.route.data.subscribe', 'data.user'], explanation: "this.route.data.subscribe(data => { const user = data['user']; });" },
      { id: 217, level: 'advanced', type: 'mcq', question: 'Which function is used to enable hash-based routing?', options: ['withRouting()', 'withHashLocation()', 'useHash: true', 'enableHash()'], correctAnswer: 'withHashLocation()', explanation: '`provideRouter(routes, withHashLocation())` is used to switch from the default PathLocationStrategy to the HashLocationStrategy.' },
      { id: 218, level: 'advanced', type: 'fill-blank', question: 'A [?] guard can prevent a lazy-loaded module from even being downloaded.', correctAnswer: 'CanMatch', explanation: 'A `CanMatch` guard runs before the code for a lazy route is fetched, making it efficient for feature-flagging entire sections of an app.' },
      { id: 219, level: 'advanced', type: 'mcq', question: 'Which router option helps with restoring scroll position on back/forward navigation?', options: ['scrollPositionRestoration', 'anchorScrolling', 'scrollOffset', 'restoreScroll'], correctAnswer: 'scrollPositionRestoration', explanation: '`scrollPositionRestoration: "enabled"` tells the router to restore the user\'s scroll position when they navigate with the browser\'s back and forward buttons.' },
      { id: 220, level: 'advanced', type: 'code', question: 'Write a lazy-loaded route for a single standalone component `ProfileComponent`.', codeContext: '{...}', correctAnswer: ["path: 'profile'", "loadComponent", "() => import('./profile.component').then(m => m.ProfileComponent)"], explanation: '`loadComponent` is used for lazy-loading individual standalone components.' },
      { id: 221, level: 'advanced', type: 'mcq', question: 'The router navigates imperatively. This means:', options: ['The URL must change', 'The process is optional', 'It happens step-by-step and can be cancelled', 'It cannot be controlled'], correctAnswer: 'It happens step-by-step and can be cancelled', explanation: 'The router goes through a series of steps (guards, resolvers), and if any step fails (e.g., a guard returns false), the entire navigation is cancelled.' },
      { id: 222, level: 'advanced', type: 'fill-blank', question: 'The router configuration option `onSameUrlNavigation` determines whether the router should [?] events when navigating to the current URL.', correctAnswer: 're-emit', explanation: '`onSameUrlNavigation: "reload"` can be used to force guards and resolvers to re-run even if the URL hasn\'t changed.' },
      { id: 223, level: 'advanced', type: 'mcq', question: 'What is the `resolve` property on a route definition used for?', options: ['To resolve component conflicts', 'To map data resolvers to the route', 'To resolve the component path', 'To fix routing errors'], correctAnswer: 'To map data resolvers to the route', explanation: 'The `resolve` property takes an object where keys are names and values are resolver functions.' },
      { id: 224, level: 'advanced', type: 'code', question: 'Navigate to the parent route programmatically.', codeContext: 'constructor(private router: Router, private route: ActivatedRoute) {}', correctAnswer: ["this.router.navigate(['../']", "relativeTo: this.route"], explanation: "this.router.navigate(['../'], { relativeTo: this.route }); uses relative navigation to go up one level in the route hierarchy." },
      { id: 225, level: 'advanced', type: 'mcq', question: 'What is the purpose of the `NavigationExtras` object?', options: ['To provide extra routes', 'To pass options that configure the navigation', 'To add extra components', 'To define extra outlets'], correctAnswer: 'To pass options that configure the navigation', explanation: '`NavigationExtras` is the second argument to `router.navigate` and includes options like `relativeTo`, `queryParams`, `state`, and `skipLocationChange`.' },

      // ===========================
      // 4. PROFESSIONAL QUESTIONS (25)
      // ===========================
      {
        id: 301, level: 'professional', type: 'mcq',
        question: 'Which strategy allows you to detach a view and store it in memory instead of destroying it?',
        options: ['RouteReuseStrategy', 'ViewEncapsulation', 'ChangeDetectionStrategy', 'PreloadAllModules'],
        correctAnswer: 'RouteReuseStrategy',
        explanation: '`RouteReuseStrategy` provides methods to customize when to detach/store and reattach route snapshots, which is ideal for things like tabbed interfaces.'
      },
      {
        id: 302, level: 'professional', type: 'code',
        question: 'Configure the router to scroll to the top on every navigation change.',
        codeContext: 'provideRouter(routes, ...)',
        correctAnswer: ['withInMemoryScrolling', 'scrollPositionRestoration', "'top'"],
        explanation: "The `withInMemoryScrolling` feature can be configured with `scrollPositionRestoration: 'top'` to ensure the user is at the top of the new page after navigation."
      },
      {
        id: 303, level: 'professional', type: 'mcq',
        question: 'What is a `UrlTree`?',
        options: ['A string representing the URL', 'A parsed, tree-like object representing the URL structure', 'A history of all visited URLs', 'A map of all possible application routes'],
        correctAnswer: 'A parsed, tree-like object representing the URL structure',
        explanation: 'The Angular Router uses the `UrlTree` as an immutable, structured representation of a URL, which is safer and more powerful to manipulate than raw strings.'
      },
      {
        id: 304, level: 'professional', type: 'fill-blank',
        question: 'To handle loading errors for lazy modules (e.g. network failure), you should filter for the [?] event.',
        correctAnswer: 'RouteConfigLoadError',
        explanation: '`RouteConfigLoadError` is emitted in the router events stream when a lazy-loaded module fails to download or parse, allowing for graceful error handling.'
      },
      {
        id: 305, level: 'professional', type: 'mcq',
        question: 'What is the key advantage of `CanMatch` over the deprecated `CanLoad`?',
        options: ['`CanMatch` is faster', '`CanMatch` allows the router to try other routes with the same path if it fails', '`CanLoad` only works for modules', 'There is no major advantage'],
        correctAnswer: '`CanMatch` allows the router to try other routes with the same path if it fails',
        explanation: 'If a `CanMatch` guard returns false, the router pretends the route doesn\'t exist and continues matching. This allows for multiple routes with the same path, selectable by different guard logic (e.g., user roles).'
      },
      {
        id: 306, level: 'professional', type: 'code',
        question: 'Manually create a `UrlTree` for "/search" with a query parameter `term=angular`.',
        codeContext: 'this.router.createUrlTree(...)',
        correctAnswer: ["['/search']", 'queryParams', "{ term: 'angular' }"],
        explanation: "The `createUrlTree` method is a powerful way to construct complex navigation targets programmatically without triggering navigation immediately."
      },
      {
        id: 307, level: 'professional', type: 'mcq',
        question: 'What is the `TitleStrategy` service used for?',
        options: ['Styling the application title bar', 'Updating the document `<title>` based on route configuration', 'Managing all `<h1>` tags in the application', 'A deprecated service for titles'],
        correctAnswer: 'Updating the document `<title>` based on route configuration',
        explanation: 'Introduced in Angular 14, `TitleStrategy` can be extended to automate how the browser tab title is updated on navigation, often using the `title` property of a route.'
      },
      {
        id: 308, level: 'professional', type: 'fill-blank',
        question: 'When using named outlets, the URL segment for the outlet is enclosed in [?].',
        correctAnswer: 'parentheses',
        explanation: 'e.g., `/home(sidebar:chat)`. The parentheses denote the secondary route branch in the URL serialization.'
      },
      { id: 309, level: 'professional', type: 'mcq', question: 'The `runGuardsAndResolvers` property on a route can be set to what?', options: ['`always` or `never`', '`paramsChange`, `paramsOrQueryParamsChange`, or `always`', '`true` or `false`', '`blocking` or `non-blocking`'], correctAnswer: '`paramsChange`, `paramsOrQueryParamsChange`, or `always`', explanation: 'This property controls when guards and resolvers re-run. The default is `paramsChange`, but `always` can force them to run on every navigation to that route.' },
      { id: 310, level: 'professional', type: 'fill-blank', question: 'The router uses a [?]-first search algorithm to match routes.', correctAnswer: 'depth', explanation: 'The router uses a depth-first search strategy when matching a URL against the route configuration.' },
      { id: 311, level: 'professional', type: 'mcq', question: 'What is the purpose of `provideRouter(routes, withPreloading(PreloadAllModules))`?', options: ['To load all modules before the app starts', 'To lazy-load all modules on the first navigation', 'To load the initial route, then preload all other lazy modules in the background', 'To disable lazy-loading entirely'], correctAnswer: 'To load the initial route, then preload all other lazy modules in the background', explanation: 'This strategy provides a good balance: fast initial load, followed by background preloading of other features so that subsequent navigation is instant.' },
      { id: 312, level: 'professional', type: 'code', question: 'Define a custom preloading strategy that only preloads routes with `data: { preload: true }`.', codeContext: 'class CustomPreload implements PreloadingStrategy { ... }', correctAnswer: ["preload(route: Route, fn: () => Observable<any>)", "route.data?.['preload']", "? fn() : of(null)"], explanation: 'A custom `PreloadingStrategy` gives fine-grained control over which modules are preloaded and when.' },
      { id: 313, level: 'professional', type: 'mcq', question: 'If a navigation is cancelled by a guard, which router event is emitted?', options: ['NavigationError', 'NavigationStopped', 'NavigationCancel', 'No event is emitted'], correctAnswer: 'NavigationCancel', explanation: '`NavigationCancel` is emitted when a guard returns `false` or a `UrlTree`, halting the current navigation.' },
      { id: 314, level: 'professional', type: 'fill-blank', question: 'A component can get access to its parent\'s `ActivatedRoute` by injecting it and accessing the [?] property.', correctAnswer: 'parent', explanation: '`this.route.parent` provides access to the parent route in a nested route hierarchy.' },
      { id: 315, level: 'professional', type: 'mcq', question: 'What does the router `errorHandler` configuration option do?', options: ['Catches all HTTP errors', 'Provides a function to handle errors during navigation or lazy-loading', 'Handles component template errors', 'Reports errors to an external service'], correctAnswer: 'Provides a function to handle errors during navigation or lazy-loading', explanation: 'This function is called when the router encounters an error (e.g., a guard throws an error) and allows for custom logging or recovery logic.' },
      { id: 316, level: 'professional', type: 'code', question: 'In a RouteReuseStrategy, which method determines if a future route should reattach a stored handle?', codeContext: 'shouldAttach(route: ActivatedRouteSnapshot): boolean { ... }', correctAnswer: ['return', "!!route.routeConfig && !!this.storedRoutes[route.routeConfig.path]"], explanation: 'The `shouldAttach` method checks if a previously stored route handle exists for the target route.' },
      { id: 317, level: 'professional', type: 'mcq', question: 'What is the `UrlSerializer` service used for?', options: ['To compress URLs', 'To parse a URL string into a `UrlTree` and vice-versa', 'To store URL history', 'To validate URL formats'], correctAnswer: 'To parse a URL string into a `UrlTree` and vice-versa', explanation: 'The `UrlSerializer` is a low-level service that handles the conversion between the browser\'s URL string and Angular\'s internal `UrlTree` representation.' },
      { id: 318, level: 'professional', type: 'fill-blank', question: 'The router outlet instantiates components using the [?] service.', correctAnswer: 'ViewContainerRef', explanation: 'Under the hood, `RouterOutlet` uses its `ViewContainerRef` to dynamically create and insert the routed component into the DOM.' },
      { id: 319, level: 'professional', type: 'mcq', question: 'Which of these is a valid reason to implement a custom `UrlHandlingStrategy`?', options: ['To change the color of the URL bar', 'To make the router ignore certain parts of the URL (e.g., for a legacy system integration)', 'To make URLs shorter', 'To improve SEO'], correctAnswer: 'To make the router ignore certain parts of the URL (e.g., for a legacy system integration)', explanation: '`UrlHandlingStrategy` is a very advanced feature that allows you to control which URLs Angular should process and which it should ignore completely.' },
      { id: 320, level: 'professional', type: 'code', question: 'Filter the router events stream to only get `NavigationEnd` events.', codeContext: 'this.router.events.pipe(...)', correctAnswer: ['filter', '(e): e is NavigationEnd => e instanceof NavigationEnd'], explanation: 'Using the `filter` operator with a type guard is the standard RxJS pattern for isolating specific router events.' },
      { id: 321, level: 'professional', type: 'mcq', question: 'Which routing feature helps in migrating AngularJS apps to Angular?', options: ['`UpgradeModule`', '`$route` service', 'HashLocationStrategy', 'The `UrlHandlingStrategy`'], correctAnswer: 'The `UrlHandlingStrategy`', explanation: 'A custom `UrlHandlingStrategy` can be implemented to let the Angular router and AngularJS `$route` service coexist by having Angular ignore AngularJS-specific routes.' },
      { id: 322, level: 'professional', type: 'fill-blank', question: 'The `children` property defines routes for a nested, primary outlet, while the `[?]` property defines routes for any outlet at the same level.', correctAnswer: 'loadChildren', explanation: 'This is a subtle point: `children` are for a nested primary outlet. `loadChildren` can define routes for any outlet, including named ones at the current level or below.' },
      { id: 323, level: 'professional', type: 'mcq', question: 'What happens when a resolver returns `EMPTY` (the RxJS constant)?', options: ['The navigation proceeds with no data', 'It throws an error', 'The navigation is cancelled', 'It waits indefinitely'], correctAnswer: 'The navigation is cancelled', explanation: 'If a resolver\'s observable completes without emitting a value, the router cancels the navigation.' },
      { id: 324, level: 'professional', 'type': 'code', question: 'Provide a custom router configuration to bind component inputs from route data and params.', 'codeContext': 'provideRouter(routes, ...)', 'correctAnswer': ['withComponentInputBinding()'], 'explanation': 'The `withComponentInputBinding()` feature simplifies components by allowing route parameters, query parameters, and data to be directly bound to component `@Input()` properties.' },
      { id: 325, level: 'professional', type: 'mcq', question: 'In a route path, what does `...` (three dots) signify?', options: ['A wildcard segment', 'An optional segment', 'It is not valid syntax', 'A placeholder for a matrix parameter'], correctAnswer: 'It is not valid syntax', explanation: 'The three-dot syntax is used for rest/spread operations in JavaScript/TypeScript, but it is not a valid path-matching syntax in the Angular Router configuration.' }
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

  // --- New Signals for Results Page ---
  totalQuestionsInLevel = computed(() => this.questionsForLevel().length);
  
  correctCount = computed(() => {
    const answers = this.submittedAnswers();
    if (answers.size === 0) return 0;
    // FIX: Rewritten with reduce to fix a type inference issue where `answer.isCorrect` was not found.
    return Array.from(answers.values()).reduce((count, answer) => count + (answer.isCorrect ? 1 : 0), 0);
  });

  incorrectCount = computed(() => {
      const totalAnswered = this.submittedAnswers().size;
      return totalAnswered - this.correctCount();
  });

  score = computed(() => this.correctCount() * 10);
  
  scorePercentage = computed(() => {
      const total = this.totalQuestionsInLevel();
      if (total === 0) return 0;
      return Math.round((this.correctCount() / total) * 100);
  });

  // --- ACTIONS ---

  startQuiz(level: Level) {
    this.currentLevel.set(level);
    this.currentQuestionIndex.set(0);
    this.quizState.set('active');
    this.submittedAnswers.update(m => { m.clear(); return new Map(m); });
    this.showExplanation.set(false);
  }

  submitAnswer(answer: string) {
    const q = this.currentQuestion();
    if (!q || this.showExplanation()) return;

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
    this.submittedAnswers.update(m => {
        m.set(q.id, { userAnswer: answer, isCorrect: correct });
        return new Map(m);
    });

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