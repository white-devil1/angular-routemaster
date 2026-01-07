import { Injectable, signal } from '@angular/core';
import { Level } from './quiz.service';

export interface InterviewQA {
  id: number;
  level: Level;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  
  questions = signal<InterviewQA[]>([]);

  constructor() {
    this.generateQuestions();
  }

  // Resets the state of all questions (collapses them)
  reset() {
    this.questions.update(qs => qs.map(q => ({ ...q, isOpen: false })));
  }

  private generateQuestions() {
    const allQs: InterviewQA[] = [];
    let idCounter = 1;

    // ===========================
    // LEVEL 1: BEGINNER
    // ===========================
    const beginnerQs = [
      { q: 'What is a Single Page Application (SPA)?', a: 'An SPA is a web app that loads a single HTML page and dynamically updates that page as the user interacts with the app, without reloading the browser.' },
      { q: 'What is <router-outlet>?', a: 'It is a directive acting as a placeholder where Angular dynamically inserts the component matching the current route state.' },
      { q: 'What is the purpose of routerLink?', a: 'It allows navigation to a different route without triggering a full page reload, unlike the standard href attribute.' },
      { q: 'Where do you configure routes?', a: 'Routes are typically configured in a "routes" array which is then passed to provideRouter() or RouterModule.forRoot().' },
      { q: 'How do you handle a 404 page?', a: 'By adding a wildcard route { path: "**", component: NotFoundComponent } at the END of your routes array.' },
      { q: 'What is routerLinkActive?', a: 'It is a directive that adds a CSS class to an element when its linked route is currently active.' },
      { q: 'Can you have multiple router-outlets?', a: 'Yes, but only one primary outlet. Additional outlets must be named (e.g., name="sidebar").' },
      { q: 'What does pathMatch: "full" mean?', a: 'It tells the router to match the path only if the entire URL matches the defined path, essential for empty path redirects.' },
      { q: 'Difference between Router and ActivatedRoute?', a: 'Router is a global service for commands. ActivatedRoute is injected into a component to get details about the CURRENT route (params, data).' },
      { q: 'How do you navigate programmatically?', a: 'By injecting the Router service and calling this.router.navigate(["/path"]).' },
      { q: 'Why avoid href in Angular?', a: 'Because href triggers a full page reload, causing the application to restart and lose all current state/memory.' }
    ];
    beginnerQs.forEach(item => allQs.push({ id: idCounter++, level: 'beginner', question: item.q, answer: item.a, isOpen: false }));


    // ===========================
    // LEVEL 2: INTERMEDIATE
    // ===========================
    const interQs = [
      { q: 'How do you read a route parameter like :id?', a: 'Inject ActivatedRoute and use route.snapshot.paramMap.get("id") or subscribe to route.paramMap.' },
      { q: 'Difference between snapshot and observable params?', a: 'Snapshot is static and set only on init. Observables emit new values if the route param changes while the component is reused.' },
      { q: 'What are Query Parameters?', a: 'They are optional parameters at the end of a URL (e.g., ?page=1&sort=asc). Accessed via route.queryParams.' },
      { q: 'What is a Route Guard?', a: 'A mechanism to prevent users from navigating to or away from a route based on conditions (e.g., IsLoggedIn).' },
      { q: 'What is Lazy Loading?', a: 'A pattern where feature modules/components are loaded only when the user navigates to them, improving initial load time.' },
      { q: 'How do you define a lazy route?', a: 'Use the loadChildren property with a dynamic import: loadChildren: () => import("./...").' },
      { q: 'What is "Data" in a route definition?', a: 'Static read-only data passed to a route, often used for page titles or breadcrumbs. Accessed via route.data.' },
      { q: 'How do named outlets affect the URL?', a: 'They appear in parentheses, e.g., /home(sidebar:menu). This represents a secondary branch in the URL tree.' },
      { q: 'What is LocationStrategy?', a: 'It defines how the URL is stored. HashLocationStrategy uses #, PathLocationStrategy uses HTML5 history API.' },
      { q: 'How do you pass a fragment (anchor)?', a: 'Use the fragment property in NavigationExtras. It appears as #section-name at the end of the URL.' },
      { q: 'Can you inject ActivatedRoute in a Service?', a: 'Generally no, because ActivatedRoute is scoped to the component tree. You usually pass the params from the component to the service.' }
    ];
    interQs.forEach(item => allQs.push({ id: idCounter++, level: 'intermediate', question: item.q, answer: item.a, isOpen: false }));


    // ===========================
    // LEVEL 3: ADVANCED
    // ===========================
    const advQs = [
      { q: 'Explain the CanActivate guard.', a: 'It decides if a route can be activated. Runs before route load. If false, navigation cancels.' },
      { q: 'What is a Resolver?', a: 'A function that fetches data BEFORE the route is activated. The route waits for the resolver to complete.' },
      { q: 'Difference: CanActivate vs CanMatch?', a: 'CanActivate checks permission to enter a known route. CanMatch checks if the route config should even be matched/considered.' },
      { q: 'What is runGuardsAndResolvers?', a: 'Config option defining when guards/resolvers re-run (e.g., "always", "paramsChange").' },
      { q: 'How to implement "CanDeactivate"?', a: 'It checks if a user can leave the current route. Useful for preventing data loss on unsaved forms.' },
      { q: 'What are Child Routes?', a: 'Routes nested inside another route. They render inside the parent component\'s <router-outlet>.' },
      { q: 'How does Angular handle relative navigation?', a: 'Using the "relativeTo" property in NavigationExtras. You pass the current ActivatedRoute.' },
      { q: 'What is the router events stream?', a: 'An observable (router.events) emitting events like NavigationStart, NavigationEnd, etc.' },
      { q: 'How to debug routing errors?', a: 'Enable "enableTracing: true" in router config to see logs in console.' },
      { q: 'What is { skipLocationChange: true }?', a: 'Navigates to a view without updating the browser URL bar.' },
      { q: 'Are Resolvers run in parallel?', a: 'Yes, if a route has multiple resolvers, they run in parallel, and the route waits for all to complete.' }
    ];
    advQs.forEach(item => allQs.push({ id: idCounter++, level: 'advanced', question: item.q, answer: item.a, isOpen: false }));


    // ===========================
    // LEVEL 4: PROFESSIONAL
    // ===========================
    const profQs = [
      { q: 'Explain RouteReuseStrategy.', a: 'Determines if a component should be reused or destroyed. Custom strategies enable features like sticky tabs.' },
      { q: 'What is the UrlTree?', a: 'The internal data structure for the parsed URL. Handles serialization and param handling safely.' },
      { q: 'How does PreloadingStrategy work?', a: 'Runs in background after app stabilizes to fetch lazy modules. Can be customized.' },
      { q: 'Imperative vs Declarative routing?', a: 'Declarative = routerLink (template). Imperative = router.navigate (code). Declarative is better for SEO/Accessibility.' },
      { q: 'ViewContainerRef in RouterOutlet?', a: 'RouterOutlet uses ViewContainerRef to dynamically create/insert the component view into the DOM.' },
      { q: 'Secure routes at module level?', a: 'Use CanMatch guards on the lazy route. Prevents code chunk download if unauthorized.' },
      { q: 'What is TitleStrategy?', a: 'Service to automatically set document title based on route "title" property.' },
      { q: 'Auxiliary routes in UrlTree?', a: 'Stored as separate branches in UrlSegmentGroup children map, allowing independent state.' },
      { q: 'Performance of large route configs?', a: 'Large configs slow matching. Split into lazy modules to keep main tree small.' },
      { q: 'Scroll Position Restoration?', a: 'Config "scrollPositionRestoration" handles scrolling to top on nav or restoring position on back button.' },
      { q: 'Micro-frontend Routing?', a: 'Shell app handles top-level routing, delegating sub-paths to remote entry modules.' }
    ];
    profQs.forEach(item => allQs.push({ id: idCounter++, level: 'professional', question: item.q, answer: item.a, isOpen: false }));

    this.questions.set(allQs);
  }

  toggle(id: number) {
    this.questions.update(qs => qs.map(q => q.id === id ? { ...q, isOpen: !q.isOpen } : q));
  }
}
