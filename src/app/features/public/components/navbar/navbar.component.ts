import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-soft">
      <div class="container-custom">
        <div class="flex items-center justify-between h-16 md:h-20">
          <!-- Logo -->
          <a href="/" class="text-2xl font-display font-bold text-primary">
            FitZone<span class="text-accent">.</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-8">
            <a href="#servicios" class="text-gray-600 hover:text-primary transition-colors font-medium">Servicios</a>
            <a href="#novedades" class="text-gray-600 hover:text-primary transition-colors font-medium">Novedades</a>
            <a href="#horarios" class="text-gray-600 hover:text-primary transition-colors font-medium">Horarios</a>
            <a href="#planes" class="text-gray-600 hover:text-primary transition-colors font-medium">Planes</a>
            <a href="#contacto" class="text-gray-600 hover:text-primary transition-colors font-medium">Contacto</a>
            <a href="/admin" class="text-gray-400 hover:text-accent transition-colors text-sm">Admin</a>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            class="md:hidden p-2 text-gray-600 hover:text-primary"
            (click)="toggleMenu()"
          >
            @if (isMenuOpen()) {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            } @else {
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            }
          </button>
        </div>

        <!-- Mobile Menu -->
        @if (isMenuOpen()) {
          <div class="md:hidden py-4 border-t border-gray-100">
            <div class="flex flex-col gap-4">
              <a href="#servicios" class="text-gray-600 hover:text-primary transition-colors font-medium py-2" (click)="closeMenu()">Servicios</a>
              <a href="#novedades" class="text-gray-600 hover:text-primary transition-colors font-medium py-2" (click)="closeMenu()">Novedades</a>
              <a href="#horarios" class="text-gray-600 hover:text-primary transition-colors font-medium py-2" (click)="closeMenu()">Horarios</a>
              <a href="#planes" class="text-gray-600 hover:text-primary transition-colors font-medium py-2" (click)="closeMenu()">Planes</a>
              <a href="#contacto" class="text-gray-600 hover:text-primary transition-colors font-medium py-2" (click)="closeMenu()">Contacto</a>
              <a href="/admin" class="text-gray-400 hover:text-accent transition-colors text-sm py-2">Admin</a>
            </div>
          </div>
        }
      </div>
    </nav>
  `
})
export class NavbarComponent {
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}