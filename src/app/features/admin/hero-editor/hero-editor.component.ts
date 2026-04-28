import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-hero-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-display font-bold text-primary">Editor de Hero</h1>
        <a href="/" target="_blank" class="btn-secondary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Ver sitio
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="bg-white rounded-xl shadow-soft p-6">
          <h2 class="text-lg font-semibold text-primary mb-6">Configuración</h2>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Título principal</label>
              <input 
                type="text" 
                formControlName="title"
                class="input-base"
                placeholder="Transforma tu cuerpo"
              >
              @if (form.get('title')?.touched && form.get('title')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">El título es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
              <textarea 
                formControlName="subtitle"
                rows="3"
                class="input-base resize-none"
                placeholder="Entrena con los mejores..."
              ></textarea>
              @if (form.get('subtitle')?.touched && form.get('subtitle')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">El subtítulo es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
              <input 
                type="url" 
                formControlName="imageUrl"
                class="input-base"
                placeholder="https://..."
              >
              @if (form.get('imageUrl')?.touched && form.get('imageUrl')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">La URL de imagen es obligatoria</p>
              }
              @if (form.get('imageUrl')?.touched && form.get('imageUrl')?.errors?.['pattern']) {
                <p class="mt-1 text-sm text-red-500">Introduce una URL válida</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Texto del botón</label>
              <input 
                type="text" 
                formControlName="ctaText"
                class="input-base"
                placeholder="¡Apúntate ahora!"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Enlace del botón</label>
              <input 
                type="text" 
                formControlName="ctaLink"
                class="input-base"
                placeholder="#contact"
              >
            </div>

            <button 
              type="submit" 
              class="btn-primary w-full"
              [disabled]="form.invalid || saving()"
            >
              @if (saving()) {
                Guardando...
              } @else {
                Guardar cambios
              }
            </button>

            @if (saved()) {
              <p class="text-green-600 text-center text-sm">¡Cambios guardados!</p>
            }
          </form>
        </div>

        <!-- Preview -->
        <div class="bg-white rounded-xl shadow-soft p-6">
          <h2 class="text-lg font-semibold text-primary mb-6">Vista previa</h2>
          
          <div class="relative h-[300px] rounded-lg overflow-hidden bg-gray-200">
            <img 
              [src]="form.get('imageUrl')?.value || hero().imageUrl"
              class="w-full h-full object-cover"
              (error)="onImageError($event)"
            >
            <div class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40"></div>
            <div class="absolute inset-0 flex items-center justify-center p-8 text-center text-white">
              <div>
                <h3 class="text-2xl font-display font-bold mb-2">
                  {{ form.get('title')?.value || hero().title }}
                </h3>
                <p class="opacity-90 text-sm">
                  {{ form.get('subtitle')?.value || hero().subtitle }}
                </p>
                @if (form.get('ctaText')?.value || hero().ctaText) {
                  <span class="inline-block mt-4 px-4 py-2 bg-accent rounded-lg text-sm font-medium">
                    {{ form.get('ctaText')?.value || hero().ctaText }}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HeroEditorComponent {
  private contentService = inject(ContentService);
  private fb = inject(FormBuilder);

  hero = computed(() => this.contentService.site().hero);
  saving = signal(false);
  saved = signal(false);

  form = this.fb.group({
    title: [this.hero().title, [Validators.required, Validators.maxLength(100)]],
    subtitle: [this.hero().subtitle, [Validators.required, Validators.maxLength(200)]],
    imageUrl: [this.hero().imageUrl, [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    ctaText: [this.hero().ctaText],
    ctaLink: [this.hero().ctaLink]
  });

  onSubmit() {
    if (this.form.valid) {
      this.saving.set(true);
      const values = this.form.value;
      this.contentService.updateHero({
        title: values.title || '',
        subtitle: values.subtitle || '',
        imageUrl: values.imageUrl || '',
        ctaText: values.ctaText || '',
        ctaLink: values.ctaLink || ''
      });
      
      setTimeout(() => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      }, 500);
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80';
  }
}