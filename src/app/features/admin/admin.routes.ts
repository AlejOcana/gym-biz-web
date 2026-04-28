import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { authGuard } from '@app/core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'hero',
        loadComponent: () => import('./hero-editor/hero-editor.component')
          .then(m => m.HeroEditorComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('./news-editor/news-editor.component')
          .then(m => m.NewsEditorComponent)
      },
      {
        path: 'schedule',
        loadComponent: () => import('./schedule-editor/schedule-editor.component')
          .then(m => m.ScheduleEditorComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact-editor/contact-editor.component')
          .then(m => m.ContactEditorComponent)
      }
    ]
  }
];