import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="horarios" class="py-20 bg-surface">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">Horarios</h2>
          <p class="section-subtitle mx-auto">
            Consulta nuestros horarios y encuentra la clase perfecta para ti
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[600px] bg-white rounded-xl shadow-soft overflow-hidden">
            <thead class="bg-primary text-white">
              <tr>
                <th class="px-6 py-4 text-left font-display">Día</th>
                <th class="px-6 py-4 text-left font-display">Clase</th>
                <th class="px-6 py-4 text-left font-display">Hora</th>
                <th class="px-6 py-4 text-left font-display">Instructor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of schedule(); track item.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-gray-800">{{ getDayName(item.dayOfWeek) }}</td>
                  <td class="px-6 py-4 font-medium text-primary">{{ item.className }}</td>
                  <td class="px-6 py-4 text-gray-600">{{ item.time }}</td>
                  <td class="px-6 py-4 text-gray-500">{{ item.instructor || '-' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `
})
export class ScheduleComponent {
  private contentService = inject(ContentService);
  schedule = computed(() => this.contentService.site().schedule);

  days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  getDayName(day: number): string {
    return this.days[day] || '';
  }
}