import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h1 class="text-2xl font-display font-bold text-primary mb-8">Dashboard</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-soft p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Noticias activas</p>
              <p class="text-2xl font-bold text-primary">{{ activeNewsCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-soft p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total noticias</p>
              <p class="text-2xl font-bold text-primary">{{ totalNewsCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-soft p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Horarios</p>
              <p class="text-2xl font-bold text-primary">{{ scheduleCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h2 class="text-lg font-semibold text-primary mb-4">Acciones rápidas</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            routerLink="/admin/hero"
            class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-100 hover:border-accent hover:bg-accent/5 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-600">Editar Hero</span>
          </a>

          <a 
            routerLink="/admin/news"
            class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-100 hover:border-accent hover:bg-accent/5 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-600">Gestionar Noticias</span>
          </a>

          <a 
            routerLink="/admin/schedule"
            class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-100 hover:border-accent hover:bg-accent/5 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-600">Editar Horarios</span>
          </a>

          <a 
            routerLink="/admin/contact"
            class="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-gray-100 hover:border-accent hover:bg-accent/5 transition-colors text-center"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm font-medium text-gray-600">Editar Contacto</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private contentService = inject(ContentService);

  activeNewsCount = computed(() => 
    this.contentService.site().news.filter(n => n.isActive).length
  );

  totalNewsCount = computed(() => 
    this.contentService.site().news.length
  );

  scheduleCount = computed(() => 
    this.contentService.site().schedule.length
  );
}