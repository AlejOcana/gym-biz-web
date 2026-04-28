import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ContentService } from '@app/core/services/content.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-white px-4 py-3 flex items-center justify-between">
      <button (click)="toggleSidebar()" class="p-2 hover:bg-primary-light rounded-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <span class="font-display font-bold">FitZone<span class="text-accent">.</span></span>
      <button (click)="logout()" class="p-2 hover:bg-primary-light rounded-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      </button>
    </div>

    <div class="flex min-h-screen bg-gray-100 pt-16 lg:pt-0">
      <!-- Sidebar Overlay (Mobile) -->
      @if (sidebarOpen()) {
        <div 
          class="lg:hidden fixed inset-0 bg-black/50 z-40"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Sidebar -->
      <aside 
        class="fixed inset-y-0 left-0 w-64 bg-primary text-white flex flex-col z-50 transition-transform duration-300 lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-primary-light flex items-center justify-between">
          <h1 class="text-xl font-display font-bold">
            FitZone<span class="text-accent">.</span> Admin
          </h1>
          <button (click)="toggleSidebar()" class="lg:hidden p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a 
            routerLink="/admin" 
            routerLinkActive="bg-primary-light text-white"
            [routerLinkActiveOptions]="{exact: true}"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </a>

          <a 
            routerLink="/admin/hero"
            routerLinkActive="bg-primary-light text-white"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Hero
          </a>

          <a 
            routerLink="/admin/news"
            routerLinkActive="bg-primary-light text-white"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            Noticias
          </a>

          <a 
            routerLink="/admin/schedule"
            routerLinkActive="bg-primary-light text-white"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Horarios
          </a>

          <a 
            routerLink="/admin/contact"
            routerLinkActive="bg-primary-light text-white"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Contacto
          </a>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-primary-light space-y-2">
          <a 
            href="/" 
            target="_blank"
            (click)="closeSidebarOnMobile()"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Ver sitio
          </a>
          
          <button 
            (click)="resetData()"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Restablecer datos
          </button>

          <button 
            (click)="logout()"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-primary-light hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 w-full p-4 lg:p-8 ml-0 lg:ml-64 min-h-screen overflow-x-hidden">
        <router-outlet />
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  private contentService = inject(ContentService);
  private router = inject(Router);
  private authService = inject(AuthService);
  sidebarOpen = signal(false);

  isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  resetData() {
    if (confirm('¿Estás seguro de que quieres restablecer los datos iniciales? Se perderán todos los cambios.')) {
      this.contentService.reset();
      this.router.navigate(['/admin']);
    }
  }
}