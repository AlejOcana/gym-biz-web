import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-display font-bold text-primary">
              FitZone<span class="text-accent">.</span> Admin
            </h1>
            <p class="text-gray-500 mt-2">Inicia sesión para gestionar el sitio</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input 
                type="text" 
                formControlName="username"
                class="input-base"
                placeholder="Ingresa tu usuario"
              >
              @if (form.get('username')?.touched && form.get('username')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">El usuario es obligatorio</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                formControlName="password"
                class="input-base"
                placeholder="Ingresa tu contraseña"
              >
              @if (form.get('password')?.touched && form.get('password')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-500">La contraseña es obligatoria</p>
              }
            </div>

            @if (error()) {
              <div class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                {{ error() }}
              </div>
            }

            <button 
              type="submit" 
              class="btn-primary w-full"
              [disabled]="form.invalid || loading()"
            >
              @if (loading()) {
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <button 
              type="button"
              (click)="fillDemo()"
              class="w-full btn-outline text-sm"
            >
              Rellenar credenciales de demo
            </button>
          </div>

          <div class="mt-4 text-center">
            <a href="/" class="text-sm text-gray-500 hover:text-accent">
              ← Volver al sitio
            </a>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400 mt-4">
          Demo: usuario: admin, contraseña: admin123
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  fillDemo() {
    const demo = this.authService.fillDemoCredentials();
    this.form.patchValue({
      username: demo.username,
      password: demo.password
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);
      this.error.set(null);

      const { username, password } = this.form.value;
      
      setTimeout(() => {
        if (this.authService.login(username!, password!)) {
          this.router.navigate(['/admin']);
        } else {
          this.error.set('Usuario o contraseña incorrectos');
        }
        this.loading.set(false);
      }, 500);
    }
  }
}