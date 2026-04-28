import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '@app/features/public/components/navbar/navbar.component';
import { FooterComponent } from '@app/features/public/components/footer/footer.component';
import { HeroComponent } from '@app/features/public/home/components/hero/hero.component';
import { ServicesComponent } from '@app/features/public/home/components/services/services.component';
import { NewsComponent } from '@app/features/public/home/components/news/news.component';
import { ScheduleComponent } from '@app/features/public/home/components/schedule/schedule.component';
import { PricingComponent } from '@app/features/public/home/components/pricing/pricing.component';
import { ContactComponent } from '@app/features/public/home/components/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    ServicesComponent,
    NewsComponent,
    ScheduleComponent,
    PricingComponent,
    ContactComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col no-select">
      <app-navbar />
      
      <main class="flex-1">
        <app-hero />
        <app-services />
        <app-news />
        <app-schedule />
        <app-pricing />
        <app-contact />
      </main>
      
      <app-footer />
    </div>
  `
})
export class HomeComponent {}