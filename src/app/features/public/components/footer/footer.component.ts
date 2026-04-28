import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../../core/services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-primary text-white py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <!-- Brand -->
          <div>
            <h3 class="text-xl font-display font-bold mb-4">
              FitZone<span class="text-accent">.</span>
            </h3>
            <p class="text-gray-400 text-sm">
              Tu centro de entrenamiento profesional. raggiungi i tuoi obiettivi con i migliori profesionales.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4">Enlaces rápidos</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#servicios" class="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#horarios" class="hover:text-white transition-colors">Horarios</a></li>
              <li><a href="#planes" class="hover:text-white transition-colors">Planes</a></li>
              <li><a href="#contacto" class="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-4">Contacto</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>{{ contact().email }}</li>
              <li>{{ contact().phone }}</li>
              <li>{{ contact().address }}, {{ contact().city }}</li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          {{ footer().copyright }}
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private contentService = inject(ContentService);
  contact = computed(() => this.contentService.site().contact);
  footer = computed(() => this.contentService.site().footer);
}