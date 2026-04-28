import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '@app/core/services/content.service';
import { IconComponent, IconName } from '@app/shared/components/ui/icon/icon.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section id="servicios" class="py-20 bg-surface">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-subtitle mx-auto">
            Entrena con los mejores profesionales y alcanza tus objetivos
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (service of services(); track service.id) {
            <div class="card text-center group">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                <app-icon [name]="getIcon(service.icon)" [size]="32" class="text-accent group-hover:text-white"></app-icon>
              </div>
              <h3 class="text-xl font-display font-semibold text-primary mb-3">{{ service.name }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesComponent {
  private contentService = inject(ContentService);
  services = computed(() => this.contentService.sortedServices());

  getIcon(iconName: string): IconName {
    const icons: IconName[] = ['bike', 'dumbbell', 'lotus', 'boxing'];
    return icons.includes(iconName as IconName) ? iconName as IconName : 'dumbbell';
  }
}