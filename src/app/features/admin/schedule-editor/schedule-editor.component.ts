import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@app/core/services/content.service';
import { ScheduleItem } from '@app/core/models/site.models';

@Component({
  selector: 'app-schedule-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-display font-bold text-primary">Editor de Horarios</h1>
        <a href="/" target="_blank" class="btn-secondary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Ver sitio
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-6">
        <!-- Add Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-600 mb-4">Añadir nuevo horario</h3>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <select formControlName="dayOfWeek" class="input-base">
                <option [value]="1">Lunes</option>
                <option [value]="2">Martes</option>
                <option [value]="3">Miércoles</option>
                <option [value]="4">Jueves</option>
                <option [value]="5">Viernes</option>
                <option [value]="6">Sábado</option>
                <option [value]="0">Domingo</option>
              </select>
            </div>
            <div>
              <input 
                type="text" 
                formControlName="className"
                class="input-base"
                placeholder="Clase"
              >
            </div>
            <div>
              <input 
                type="time" 
                formControlName="time"
                class="input-base"
              >
            </div>
            <div>
              <input 
                type="text" 
                formControlName="instructor"
                class="input-base"
                placeholder="Instructor"
              >
            </div>
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="form.invalid"
            >
              Añadir
            </button>
          </div>
        </form>

        <!-- Schedule Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Día</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Clase</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Hora</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Instructor</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of schedule(); track item.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-800">{{ getDayName(item.dayOfWeek) }}</td>
                  <td class="px-4 py-3 font-medium text-primary">{{ item.className }}</td>
                  <td class="px-4 py-3 text-gray-600">{{ item.time }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ item.instructor || '-' }}</td>
                  <td class="px-4 py-3 text-right">
                    <button 
                      (click)="deleteSchedule(item)"
                      class="text-gray-400 hover:text-red-500"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ScheduleEditorComponent {
  private contentService = inject(ContentService);
  private fb = inject(FormBuilder);

  schedule = computed(() => this.contentService.site().schedule);

  days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  form = this.fb.group({
    dayOfWeek: [1, Validators.required],
    className: ['', Validators.required],
    time: ['', Validators.required],
    instructor: ['']
  });

  getDayName(day: number): string {
    return this.days[day] || '';
  }

  onSubmit() {
    if (this.form.valid) {
      const newSchedule: ScheduleItem = {
        ...this.form.value,
        id: crypto.randomUUID(),
        duration: 45
      } as ScheduleItem;
      
      this.contentService.updateSchedule([...this.schedule(), newSchedule]);
      this.form.reset({ dayOfWeek: 1, time: '' });
    }
  }

  deleteSchedule(item: ScheduleItem) {
    this.contentService.updateSchedule(
      this.schedule().filter(s => s.id !== item.id)
    );
  }
}