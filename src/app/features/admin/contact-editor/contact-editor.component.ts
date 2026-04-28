import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContentService } from '@app/core/services/content.service';

@Component({
  selector: 'app-contact-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-display font-bold text-primary">Editor de Contacto</h1>
        <a href="/" target="_blank" class="btn-secondary flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Ver sitio
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-6">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                formControlName="email"
                class="input-base"
                placeholder="info@tuempresa.com"
              >
              @if (form.get('email')?.touched && form.get('email')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">El email es obligatorio</p>
              }
              @if (form.get('email')?.touched && form.get('email')?.errors?.['email']) {
                <p class="mt-1 text-sm text-red-500">Introduce un email válido</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input 
                type="tel" 
                formControlName="phone"
                class="input-base"
                placeholder="+34 612 345 678"
              >
              @if (form.get('phone')?.touched && form.get('phone')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">El teléfono es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <input 
                type="text" 
                formControlName="address"
                class="input-base"
                placeholder="Calle Principal 123"
              >
              @if (form.get('address')?.touched && form.get('address')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">La dirección es obligatoria</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <input 
                type="text" 
                formControlName="city"
                class="input-base"
                placeholder="Madrid"
              >
              @if (form.get('city')?.touched && form.get('city')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">La ciudad es obligatoria</p>
              }
            </div>

            <div class="pt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-4">Redes sociales</h3>
              
              <div formArrayName="socialLinks">
                @for (link of socialLinks.controls; track $index; let i = $index) {
                  <div [formGroupName]="i" class="flex gap-4 mb-4">
                    <select formControlName="platform" class="input-base w-40">
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                    <input 
                      type="url" 
                      formControlName="url"
                      class="input-base flex-1"
                      placeholder="https://..."
                    >
                    <button 
                      type="button" 
                      (click)="removeSocialLink(i)"
                      class="text-gray-400 hover:text-red-500"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                }
              </div>
              
              <button 
                type="button" 
                (click)="addSocialLink()"
                class="text-sm text-accent hover:text-accent-dark"
              >
                + Añadir red social
              </button>
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
    </div>
  `
})
export class ContactEditorComponent {
  private contentService = inject(ContentService);
  private fb = inject(FormBuilder);

  contact = computed(() => this.contentService.site().contact);
  saving = signal(false);
  saved = signal(false);

  form = this.fb.group({
    email: [this.contact().email, [Validators.required, Validators.email]],
    phone: [this.contact().phone, Validators.required],
    address: [this.contact().address, Validators.required],
    city: [this.contact().city, Validators.required],
    socialLinks: this.fb.array(
      this.contact().socialLinks.map(link => 
        this.fb.group({
          platform: [link.platform],
          url: [link.url]
        })
      )
    )
  });

  get socialLinks() {
    return this.form.get('socialLinks') as any;
  }

  addSocialLink() {
    this.socialLinks.push(
      this.fb.group({
        platform: ['facebook'],
        url: ['']
      })
    );
  }

  removeSocialLink(index: number) {
    this.socialLinks.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.saving.set(true);
      const formValues = this.form.value;
      const socialLinksData = formValues.socialLinks || [];
      const validSocialLinks = socialLinksData
        .filter((l: any) => l && l.url)
        .map((l: any) => ({
          platform: l.platform || 'facebook',
          url: l.url || ''
        }));
      
      this.contentService.updateContact({
        email: formValues.email || '',
        phone: formValues.phone || '',
        address: formValues.address || '',
        city: formValues.city || '',
        socialLinks: validSocialLinks
      });
      
      setTimeout(() => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      }, 500);
    }
  }
}