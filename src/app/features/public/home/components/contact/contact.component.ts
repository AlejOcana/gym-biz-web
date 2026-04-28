import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="contacto" class="py-20 bg-surface">
      <div class="container-custom">
        <div class="text-center mb-16">
          <h2 class="section-title">Contacto</h2>
          <p class="section-subtitle mx-auto">
            ¿Tienes alguna pregunta? Contáctanos y te responderemos ASAP
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div class="space-y-8">
            <div class="card">
              <h3 class="text-xl font-display font-semibold text-primary mb-6">Información de contacto</h3>
              
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium text-gray-800">{{ contact().email }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Teléfono</p>
                    <p class="font-medium text-gray-800">{{ contact().phone }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Dirección</p>
                    <p class="font-medium text-gray-800">{{ contact().address }}, {{ contact().city }}</p>
                  </div>
                </div>
              </div>

              <!-- Social Links -->
              <div class="mt-8 pt-6 border-t border-gray-100">
                <div class="flex gap-4">
                  @for (link of contact().socialLinks; track link.platform) {
                    <a 
                      [href]="link.url" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-light transition-colors"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        @if (link.platform === 'facebook') {
                          <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                        }
                        @if (link.platform === 'instagram') {
                          <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84a6.16,6.16,0,1,0,6.16,6.16A6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm6.32-1.25a1.44,1.44,0,1,0-1.44,1.44A1.44,1.44,0,0,0,18.32,14.75Z"/>
                        }
                      </svg>
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="card">
            <h3 class="text-xl font-display font-semibold text-primary mb-6">Envíanos un mensaje</h3>
            
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  class="input-base"
                  placeholder="Tu nombre"
                >
                @if (form.get('name')?.touched && form.get('name')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-500">El nombre es obligatorio</p>
                }
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  class="input-base"
                  placeholder="tu@email.com"
                >
                @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-500">El email es obligatorio</p>
                }
                @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                  <p class="mt-1 text-sm text-red-500">Introduce un email válido</p>
                }
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea 
                  id="message" 
                  formControlName="message"
                  rows="4"
                  class="input-base resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                ></textarea>
                @if (form.get('message')?.touched && form.get('message')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-500">El mensaje es obligatorio</p>
                }
              </div>

              @if (submitted()) {
                <div class="p-4 bg-green-50 text-green-700 rounded-lg">
                  ¡Mensaje enviado correctamente! Te responderemos pronto.
                </div>
              }

              <button 
                type="submit" 
                class="btn-primary w-full"
                [disabled]="form.invalid"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ContactComponent {
  private contentService = inject(ContentService);
  private fb = inject(FormBuilder);
  
  contact = computed(() => this.contentService.site().contact);
  submitted = signal(false);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.maxLength(500)]]
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.submitted.set(true);
      this.form.reset();
      setTimeout(() => this.submitted.set(false), 5000);
    }
  }
}