# GymBiz — Site as a Service para gimnasios

> Landing page + panel de administración para pequeños gimnasios: el dueño edita todo el contenido, reserva clases y lee mensajes — sin tocar código y sin pagar agencia.

**Demo:** los datos viven en tu navegador. Edita desde el panel admin (`ADMIN` en la barra superior) y recarga: todo persiste.

- **Login demo:** `admin@fitzone.es` / `fitzone2024`

---

## El problema

Los gimnasios pequeños pagan 50-200 €/mes a agencias por cambiar un precio o una noticia. Los builders genéricos son demasiado complejos. GymBiz es un **site-as-a-service**: una landing profesional cuyo contenido se edita desde un panel de administración integrado.

## Funcionalidad

### Sitio público (español)
- Hero con CTA y estadísticas en vivo (disciplinas, clases/semana, entrenadores)
- Servicios, **horario con filtro por día y reserva de clases con aforo real** (las plazas se agotan de verdad)
- Precios con **toggle mensual/anual** (2 meses gratis)
- Entrenadores, noticias (publicadas / ocultas), contacto con formulario validado
- Tema claro/oscuro con detección del sistema, anti-flash y persistencia

### Panel de administración
- **Login** con sesión persistida (credenciales demo visibles en la pantalla de login)
- **Dashboard**: reservas totales, mensajes sin leer, última reserva
- **Reservas**: listado de todas las clases reservadas
- **Mensajes**: bandeja de entrada del formulario de contacto, marcar leído
- **Editores con auto-guardado**: Hero, Servicios, Horario (con aforo), Precios (features, plan destacado), Entrenadores, Noticias (publicar/ocultar), Contacto
- **Restaurar contenido** a los valores por defecto

## Ingeniería

| Decisión | Por qué |
|---|---|
| Reservas como lógica pura | `createBooking()` valida aforo, duplicados e input sin tocar React — 100% testeable |
| Contenido como dato | Todo el sitio se renderiza desde un objeto `SiteContent` tipado; editar = mutar el objeto |
| Persistencia en localStorage | Cero backend; el panel es usable al instante. La interfaz de persistencia es intercambiable por una API |
| Auto-guardado | Los editores escriben directamente en el store; "guardar" no existe porque no hace falta |
| Scrollbar usable | El spacer del horario es proporcional y limitado — sin thumbs sub-píxel |

## Stack

React 19 · TypeScript (strict) · Vite 8 · Motion · Zod-ready · Vitest (13 tests) · Playwright E2E · fuentes auto-hospedadas (Manrope, Inter, JetBrains Mono) · cero librerías de UI

## Arranque

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm test         # 13 unit tests
pnpm test:e2e     # Playwright E2E
pnpm build
```

## Estructura

```
src/
├── core/
│   ├── types.ts          # modelo de dominio + lógica de precios
│   ├── defaultSite.ts    # contenido por defecto (FitZone Gym, ES)
│   ├── booking.ts        # createBooking: aforo, duplicados, validación (puro)
│   ├── auth.ts           # demo auth del panel
│   └── store.tsx         # estado global + persistencia localStorage
├── pages/
│   ├── PublicSite.tsx    # landing completa con reservas
│   └── admin/            # login, shell, editores, operaciones
└── styles/global.css     # tokens (dark + light)
```

## v1 → v2

| | v1 (Angular 18) | v2 (React 19) |
|---|---|---|
| Reservas | No existían | Aforo real por clase + flujo completo |
| Mensajes | No existían | Formulario → bandeja del admin con no-leídos |
| Precios | Estáticos | Toggle mensual/anual |
| Entrenadores | No existían | Sección pública + CRUD |
| Tema | Solo oscuro | Claro/oscuro con anti-flash |
| Edición | Formularios por sección | Auto-guardado + restaurar contenido |

## License

MIT
