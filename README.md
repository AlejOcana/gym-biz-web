# FitZone Gym - Business Website with Admin Panel

A modern, responsive business website for small businesses featuring an integrated content management system. Built with Angular 18+, Tailwind CSS, and localStorage persistence.

## Overview

This project demonstrates a pragmatic approach to building editable business websites without requiring a full CMS or backend infrastructure. Perfect for small businesses that need a professional online presence with easy content management.

## Problem Solved

Small business owners often struggle with:
- Expensive CMS platforms they don't fully utilize
- Static websites requiring developer help for updates
- Complex solutions that don't match their actual needs

This solution provides a professional website with an integrated, lightweight admin panel - no backend required for MVP.

## Technical Stack

- **Framework:** Angular 18+ (standalone components, Signals)
- **Styling:** Tailwind CSS 3
- **State Management:** Angular Signals with localStorage persistence
- **Forms:** Reactive Forms with validation
- **Routing:** Angular Router with lazy-loaded modules

## Architecture Highlights

- Clean separation between public site and admin panel
- Lazy-loaded routes for optimized bundle size
- Signal-based state management (pragmatic alternative to NgRx)
- Type-safe models with strict TypeScript
- Responsive mobile-first design

## Features

### Public Website
- Responsive hero section with editable image and text
- Services section (gym classes)
- News/updates section
- Class schedule table
- Pricing plans with highlighted popular option
- Contact form with validation
- Footer with business info

### Admin Panel
- Dashboard with site statistics
- Hero editor with live preview
- Full CRUD for news/updates
- Schedule editor
- Contact info editor
- Data reset to defaults

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# The app will be available at http://localhost:4200
```

## Admin Panel Access

1. Navigate to `/admin`
2. Click "Entrar al Admin" (demo access - no password required)
3. Edit content using the sidebar navigation
4. Click "Ver sitio" to preview changes on the public site

## Editing Content

### Hero Section
- Navigate to `/admin/hero`
- Update title, subtitle, image URL, CTA button
- See live preview on the right side

### News
- Navigate to `/admin/news`
- Add, edit, delete, or toggle news items
- Active news appears on the public site

### Schedule
- Navigate to `/admin/schedule`
- Add new class schedules
- Delete existing entries

### Contact
- Navigate to `/admin/contact`
- Update email, phone, address, city
- Manage social media links

## Resetting Demo Data

Click "Restablecer datos" in the admin sidebar footer to reset all content to defaults.

## Design Decisions

### Why localStorage for MVP?
- Demonstrates data persistence without backend complexity
- Users can test without any setup
- Architecturally ready for API migration in V2

### Why Signals over NgRx?
- App scope doesn't justify NgRx boilerplate
- Signals provide sufficient reactivity for this use case
- Demonstrates understanding of modern Angular patterns

### Why Tailwind over Material?
- More flexible styling control
- Smaller bundle than full Material
- Easier to achieve custom "modern/minimal" look

## Limitations (MVP)

- Single-device persistence (no cross-device sync)
- Images via URL only (no direct upload)
- Demo authentication (no real JWT)
- Single vertical (gym)

## Next Steps (V2)

- Real authentication with JWT
- Image upload to cloud storage
- Multi-language support
- Backend API integration
- Additional verticals (restaurant, salon)

## Project Structure

```
src/app/
├── core/
│   ├── services/          # ContentService, PersistenceService
│   ├── models/            # TypeScript interfaces
│   └── data/              # Default site data
├── shared/
│   └── components/       # Reusable components
├── features/
│   ├── public/           # Website pages
│   │   ├── components/    # Navbar, Footer
│   │   └── home/         # Home page sections
│   └── admin/            # Admin panel
│       ├── dashboard/
│       ├── hero-editor/
│       ├── news-editor/
│       ├── schedule-editor/
│       └── contact-editor/
└── app.routes.ts          # Main routing
```

## License

MIT