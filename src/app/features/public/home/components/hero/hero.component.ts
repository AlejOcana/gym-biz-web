import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          [src]="hero().imageUrl"
          [alt]="hero().title"
          class="w-full h-full object-cover"
          (error)="onImageError($event)"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container-custom text-center text-white px-4">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in">
          {{ hero().title }}
        </h1>
        <p class="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-slide-up">
          {{ hero().subtitle }}
        </p>
        <a
          [href]="hero().ctaLink"
          class="btn-primary text-lg px-8 py-4 inline-block animate-slide-up"
        >
          {{ hero().ctaText }}
        </a>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeroComponent {
  private contentService = inject(ContentService);
  hero = computed(() => this.contentService.site().hero);

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80';
  }
}