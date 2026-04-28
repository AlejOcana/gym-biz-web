import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type IconName = 'bike' | 'dumbbell' | 'lotus' | 'boxing';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.viewBox]="viewBox" class="w-6 h-6" [style.width.px]="size" [style.height.px]="size">
      <path [attr.d]="paths[name]" fill="currentColor"></path>
    </svg>
  `,
  styles: [`:host { display: inline-flex; }`]
})
export class IconComponent {
  @Input() name: IconName = 'bike';
  @Input() size: number = 24;

  get viewBox() { return '0 0 256 256'; }

  paths: Record<IconName, string> = {
    bike: 'M208 96a48 48 0 0 0-48-48h-24L96 88 64 48a32 32 0 0 0-28 8l-24 48a16 16 0 0 0 12 24h16l32 64-32 64H56a16 16 0 0 0-12-24l24-48a32 32 0 0 0 28-8l32 40h24a48 48 0 0 0 96 0ZM96 48l24 48H80Zm-8 80h32l16 32H80Zm56 0l-16 32h32Z',
    dumbbell: 'M224 88v72a8 8 0 0 1-8 8H168a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Zm-96 8v72a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V96a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Zm40-64a16 16 0 1 0 16 16 16 16 0 0 0-16-16Zm-112 0a16 16 0 1 0 16 16 16 16 0 0 0-16-16Z',
    lotus: 'M128 24a96 96 0 0 0-64 166.4 96 96 0 0 0 128 0A96 96 0 0 0 192 190.4 96 96 0 0 0 128 24Zm0 32a64 64 0 0 1 45.3 117.3A64 64 0 0 1 82.7 173.3 64 64 0 0 1 128 56Zm0 32a32 32 0 0 0-22.6 54.6A32 32 0 0 0 128 160a32 32 0 0 0 22.6-17.4A32 32 0 0 0 128 88Z',
    boxing: 'M240 56a8 8 0 0 1-8 8H208a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8Zm-48 0a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8Zm-96 0a8 8 0 0 1-8 8H72a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8Zm-48 0a8 8 0 0 1-8 8H8a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8ZM56 80a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8Zm-8 48h176a8 8 0 0 1 0 16H48a8 8 0 0 1 0-16Zm96 80a8 8 0 0 1-8 8H72a8 8 0 0 1 0-16h72a8 8 0 0 1 8 8Zm-32 0a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8Zm112 0a8 8 0 0 1-8 8h-24a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8Z'
  };
}