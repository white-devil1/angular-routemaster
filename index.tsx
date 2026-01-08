import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';

// 1. Primary Page Components
import { HomePageComponent, DashboardPageComponent, SettingsPageComponent, UserPageComponent, NotFoundComponent } from './src/components/pages.component';

// 2. Side Components
import { MenuSidebarComponent, HelpSidebarComponent, AdsSidebarComponent, NotesSidebarComponent } from './src/components/side-components';

// 3. New Modules
import { QuizComponent } from './src/components/quiz.component';
import { InterviewComponent } from './src/components/interview.component';

const routes: Routes = [
  // REDIRECT: If path is empty, go to 'home'
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // PRIMARY ROUTES
  { path: 'home', component: HomePageComponent, title: 'Home' },
  { path: 'dashboard', component: DashboardPageComponent, title: 'Dashboard' },
  { path: 'settings', component: SettingsPageComponent, title: 'Settings' },
  { path: 'user/:id', component: UserPageComponent, title: 'User Profile' },
  
  // NEW EXAM ROUTES
  { path: 'quiz', component: QuizComponent, title: 'Exam' },
  { path: 'interview', component: InterviewComponent, title: 'Interview Questions' },

  // LEFT OUTLET ROUTES
  { path: 'menu', component: MenuSidebarComponent, outlet: 'left' },
  { path: 'ads', component: AdsSidebarComponent, outlet: 'left' },

  // RIGHT OUTLET ROUTES
  { path: 'help', component: HelpSidebarComponent, outlet: 'right' },
  { path: 'notes', component: NotesSidebarComponent, outlet: 'right' },

  // WILDCARD ROUTE (Must be last)
  // Matches anything that hasn't been matched above
  { path: '**', component: NotFoundComponent, title: 'Not Found' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
