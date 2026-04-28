import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="novedades" class="py-20 bg-white">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">Novedades</h2>
          <p class="section-subtitle mx-auto">
            Mantente informado de las últimas noticias y eventos
          </p>
        </div>

        @if (news().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (item of news(); track item.id) {
              <article class="card hover:shadow-hover">
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {{ item.publishedAt | date:'dd MMM yyyy' }}
                </div>
                <h3 class="text-xl font-display font-semibold text-primary mb-3">{{ item.title }}</h3>
                <p class="text-gray-600">{{ item.excerpt }}</p>
              </article>
            }
          </div>
        } @else {
          <div class="text-center text-gray-500 py-12">
            <p>No hay novedades disponibles</p>
          </div>
        }
      </div>
    </section>
  `
})
export class NewsComponent {
  private contentService = inject(ContentService);
  news = computed(() => this.contentService.activeNews());
}