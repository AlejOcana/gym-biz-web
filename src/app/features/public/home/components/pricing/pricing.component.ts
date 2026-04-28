import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="planes" class="py-20 bg-white">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">Planes y Precios</h2>
          <p class="section-subtitle mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          @for (plan of pricing(); track plan.id) {
            <div 
              class="card text-center relative"
              [class.ring-2]="plan.isPopular"
              [class.ring-accent]="plan.isPopular"
              [class.scale-105]="plan.isPopular"
              [class.z-10]="plan.isPopular"
            >
              @if (plan.isPopular) {
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              }
              
              <h3 class="text-xl font-display font-semibold text-primary mb-2">{{ plan.name }}</h3>
              <div class="mb-6">
                <span class="text-4xl font-display font-bold text-primary">{{ plan.price }}€</span>
                <span class="text-gray-500">/{{ plan.period === 'month' ? 'mes' : plan.period }}</span>
              </div>
              
              <ul class="space-y-3 mb-8 text-left">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-center gap-2 text-gray-600">
                    <svg class="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ feature }}
                  </li>
                }
              </ul>

              <button 
                class="w-full py-3 rounded-lg font-medium transition-colors"
                [class.btn-primary]="!plan.isPopular"
                [class.bg-accent]="plan.isPopular"
                [class.text-white]="plan.isPopular"
                [class.hover:bg-accent-dark]="plan.isPopular"
              >
                Elegir Plan
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class PricingComponent {
  private contentService = inject(ContentService);
  pricing = computed(() => this.contentService.sortedPricing());
}