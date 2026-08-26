import { useMemo, useState } from 'react';
import { useApp } from '../core/store';
import { BOOKING_ERRORS, createBooking, seatsLeft } from '../core/booking';
import { DAY_NAMES, annualPrice } from '../core/types';
import type { ScheduleItem } from '../core/types';

const NAV = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#novedades', label: 'Novedades' },
  { href: '#horarios', label: 'Horarios' },
  { href: '#planes', label: 'Planes' },
  { href: '#entrenadores', label: 'Entrenadores' },
  { href: '#contacto', label: 'Contacto' },
];

const ICON_PATHS: Record<string, string> = {
  bike: 'M208 96a48 48 0 0 0-48-48h-24L96 88 64 48a32 32 0 0 0-28 8l-24 48a16 16 0 0 0 12 24h16l32 64-32 64H56a16 16 0 0 0-12-24l24-48a32 32 0 0 0 28-8l32 40h24a48 48 0 0 0 96 0ZM96 48l24 48H80Zm-8 80h32l16 32H80Zm56 0l-16 32h32Z',
  dumbbell: 'M224 88v72a8 8 0 0 1-8 8H168a8 8 0 0 1-8-8V88a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Zm-96 8v72a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V96a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Zm40-64a16 16 0 1 0 16 16 16 16 0 0 0-16-16Zm-112 0a16 16 0 1 0 16 16 16 16 0 0 0-16-16Z',
  lotus: 'M128 24a96 96 0 0 0-64 166.4 96 96 0 0 0 128 0A96 96 0 0 0 192 190.4 96 96 0 0 0 128 24Zm0 32a64 64 0 0 1 45.3 117.3A64 64 0 0 1 82.7 173.3 64 64 0 0 1 128 56Zm0 32a32 32 0 0 0-22.6 54.6A32 32 0 0 0 128 160a32 32 0 0 0 22.6-17.4A32 32 0 0 0 128 88Z',
  boxing: 'M240 56a8 8 0 0 1-8 8H208a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8Zm-48 0a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8Zm-96 0a8 8 0 0 1-8 8H72a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8Zm-48 0a8 8 0 0 1-8 8H8a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8ZM56 80a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8Zm-8 48h176a8 8 0 0 1 0 16H48a8 8 0 0 1 0-16Zm96 80a8 8 0 0 1-8 8H72a8 8 0 0 1 0-16h72a8 8 0 0 1 8 8Zm-32 0a8 8 0 0 1-8 8H56a8 8 0 0 1 0-16h40a8 8 0 0 1 8 8Zm112 0a8 8 0 0 1-8 8h-24a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8Z',
};

function ServiceIcon({ name }: { name: string }) {
  const d = ICON_PATHS[name] ?? ICON_PATHS.dumbbell;
  return (
    <svg viewBox="0 0 256 256" width={28} height={28} aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

function BookingModal({ session, onClose }: { session: ScheduleItem; onClose: () => void }) {
  const { state, addBooking } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = () => {
    const result = createBooking(session, state.bookings, { name, email });
    if (!result.ok || !result.booking) {
      setError(result.error ? BOOKING_ERRORS[result.error] : 'Error');
      return;
    }
    addBooking(result.booking);
    setDone(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '28rem' }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Reservar ${session.className}`}>
        {done ? (
          <>
            <div className="success-note">¡Reserva confirmada! Te esperamos el {DAY_NAMES[session.dayOfWeek - 1]} a las {session.time}.</div>
            <button type="button" className="btn btn-primary btn-block" onClick={onClose}>
              Hecho
            </button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 600, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              Reservar {session.className}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {DAY_NAMES[session.dayOfWeek - 1]} · {session.time} · {session.duration} min{session.instructor ? ` · ${session.instructor}` : ''}
            </p>
            <div className="field">
              <label htmlFor="bk-name">Nombre</label>
              <input id="bk-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="field">
              <label htmlFor="bk-email">Email</label>
              <input id="bk-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            {error && <p className="field-error">{error}</p>}
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit}>
                Confirmar reserva
              </button>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function PublicSite() {
  const { state, setView, addMessage } = useApp();
  const { site, bookings } = state;
  const [menuOpen, setMenuOpen] = useState(false);
  const [day, setDay] = useState<number>(1);
  const [bookingSession, setBookingSession] = useState<ScheduleItem | null>(null);
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const daysWithClasses = useMemo(() => [...new Set(site.schedule.map((s) => s.dayOfWeek))].sort((a, b) => a - b), [site.schedule]);
  const daySessions = useMemo(() => site.schedule.filter((s) => s.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time)), [site.schedule, day]);
  const activeNews = useMemo(() => site.news.filter((n) => n.isActive), [site.news]);

  const submitContact = () => {
    if (form.name.trim().length < 2 || !form.email.includes('@') || form.message.trim().length < 5) {
      setFormError('Completa tu nombre, un email válido y tu mensaje.');
      return;
    }
    addMessage({
      id: `msg_${Date.now().toString(36)}`,
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    });
    setFormSent(true);
    setForm({ name: '', email: '', message: '' });
    setFormError(null);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAVBAR */}
      <header className="topbar">
        <div className="container-custom topbar-inner">
          <a href="/" className="logo">
            FitZone<span>.</span>
          </a>

          <nav className="nav-links" aria-label="Secciones">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
            <button type="button" className="admin-link" onClick={() => setView('admin')}>
              Admin
            </button>
          </nav>

          <button type="button" className="mobile-menu-btn" aria-label="Abrir menú" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? (
              <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div className="container-custom">
            <div className="mobile-menu">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>
                  {n.label}
                </a>
              ))}
              <button type="button" className="admin-link" style={{ textAlign: 'left', padding: '0.5rem 0' }} onClick={() => setView('admin')}>
                Admin
              </button>
            </div>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>
        {/* HERO */}
        <section className="hero">
          <div className="hero-bg">
            <img
              src={site.hero.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80'}
              alt={site.hero.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80';
              }}
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content container-custom">
            <h1 className="animate-fade-in">{site.hero.title}</h1>
            <p className="animate-slide-up">{site.hero.subtitle}</p>
            <a href="#contacto" className="btn btn-primary animate-slide-up">
              {site.hero.ctaText}
            </a>
          </div>
          <div className="hero-scroll animate-bounce" aria-hidden="true">
            <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* SERVICES */}
        <section id="servicios" className="section">
          <div className="container-custom">
            <div className="section-head">
              <h2 className="section-title">Nuestros Servicios</h2>
              <p className="section-subtitle">Entrena con los mejores profesionales y alcanza tus objetivos</p>
            </div>
            <div className="services-grid">
              {[...site.services].sort((a, b) => a.order - b.order).map((s) => (
                <div className="service-card" key={s.id}>
                  <div className="service-icon">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWS */}
        {activeNews.length > 0 && (
          <section id="novedades" className="section">
            <div className="container-custom">
              <div className="section-head">
                <h2 className="section-title">Novedades</h2>
                <p className="section-subtitle">Mantente informado de las últimas noticias y eventos</p>
              </div>
              <div className="news-grid">
                {activeNews.map((n) => (
                  <article className="card" key={n.id}>
                    <div className="news-date">
                      <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {n.publishedAt}
                    </div>
                    <h3 className="news-title">{n.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{n.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SCHEDULE with booking */}
        <section id="horarios" className="section">
          <div className="container-custom">
            <div className="section-head">
              <h2 className="section-title">Horarios</h2>
              <p className="section-subtitle">Elige el día y reserva tu plaza — sin permanencia</p>
            </div>

            <div className="day-tabs" role="tablist" aria-label="Día de la semana">
              {daysWithClasses.map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={day === d}
                  className={`day-tab ${day === d ? 'day-tab--on' : ''}`}
                  onClick={() => setDay(d)}
                >
                  {DAY_NAMES[d - 1]}
                </button>
              ))}
            </div>

            <div className="schedule-wrap">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Hora</th>
                    <th>Instructor</th>
                    <th>Plazas</th>
                    <th style={{ textAlign: 'right' }}>Reserva</th>
                  </tr>
                </thead>
                <tbody>
                  {daySessions.map((s) => {
                    const left = seatsLeft(s, bookings);
                    const seatClass = left === 0 ? 'seats--full' : left <= 3 ? 'seats--low' : '';
                    return (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.className}</td>
                        <td style={{ color: '#4b5563' }}>{s.time} · {s.duration}′</td>
                        <td style={{ color: '#6b7280' }}>{s.instructor || '—'}</td>
                        <td>
                          <span className={`seats ${seatClass}`}>{left === 0 ? 'Completo' : `${left} libres`}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button type="button" className="btn btn-primary btn-sm" disabled={left === 0} onClick={() => setBookingSession(s)}>
                            Reservar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {daySessions.length === 0 && <p style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No hay clases este día.</p>}
            </div>

            {bookingSession && <BookingModal session={bookingSession} onClose={() => setBookingSession(null)} />}
          </div>
        </section>

        {/* PRICING */}
        <section id="planes" className="section">
          <div className="container-custom">
            <div className="section-head">
              <h2 className="section-title">Planes y Precios</h2>
              <p className="section-subtitle">Elige el plan que mejor se adapte a tus necesidades</p>
            </div>

            <div className="billing-toggle">
              <div className="billing-pill" role="group" aria-label="Periodo de facturación">
                <button type="button" className={`billing-opt ${billing === 'month' ? 'billing-opt--on' : ''}`} onClick={() => setBilling('month')}>
                  Mensual
                </button>
                <button type="button" className={`billing-opt ${billing === 'year' ? 'billing-opt--on' : ''}`} onClick={() => setBilling('year')}>
                  Anual
                </button>
              </div>
              {billing === 'year' && <span className="save-tag">2 MESES GRATIS</span>}
            </div>

            <div className="pricing-grid">
              {[...site.pricing]
                .sort((a, b) => a.order - b.order)
                .map((p) => {
                  const price = billing === 'year' ? annualPrice(p.price) : p.price;
                  return (
                    <div className={`price-card ${p.isPopular ? 'price-card--popular' : ''}`} key={p.id}>
                      {p.isPopular && <div className="popular-tag">Popular</div>}
                      <h3 className="price-name">{p.name}</h3>
                      <div className="price-amount">
                        {price}€ <small>/{billing === 'year' ? 'año' : 'mes'}</small>
                      </div>
                      <ul className="price-features">
                        {p.features.map((f) => (
                          <li key={f}>
                            <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <a href="#contacto" className={`btn ${p.isPopular ? 'btn-primary' : 'btn-outline'} btn-block`}>
                        Elegir Plan
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* TRAINERS */}
        <section id="entrenadores" className="section">
          <div className="container-custom">
            <div className="section-head">
              <h2 className="section-title">Nuestros Entrenadores</h2>
              <p className="section-subtitle">Profesionales certificados para guiarte</p>
            </div>
            <div className="trainers-grid">
              {site.trainers.map((t) => (
                <div className="trainer-card" key={t.id}>
                  <div className="trainer-avatar">{t.initials}</div>
                  <div className="trainer-name">{t.name}</div>
                  <div className="trainer-spec">{t.specialty}</div>
                  <p className="trainer-bio">{t.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contacto" className="section">
          <div className="container-custom">
            <div className="section-head">
              <h2 className="section-title">Contacto</h2>
              <p className="section-subtitle">¿Tienes alguna pregunta? Contáctanos y te responderemos ASAP</p>
            </div>
            <div className="contact-grid">
              <div className="card contact-info-card">
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                  Información de contacto
                </h3>
                <div className="contact-line">
                  <div className="contact-icon">
                    <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Email</p>
                    <p style={{ fontWeight: 500 }}>{site.contact.email}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <div className="contact-icon">
                    <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Teléfono</p>
                    <p style={{ fontWeight: 500 }}>{site.contact.phone}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <div className="contact-icon">
                    <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Dirección</p>
                    <p style={{ fontWeight: 500 }}>
                      {site.contact.address}, {site.contact.city}
                    </p>
                  </div>
                </div>
                <div className="socials">
                  {site.contact.socialLinks.map((s) => (
                    <a key={s.platform} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}>
                      <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {s.platform === 'facebook' ? (
                          <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" />
                        ) : (
                          <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84a6.16,6.16,0,1,0,6.16,6.16A6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm6.32-1.25a1.44,1.44,0,1,0-1.44,1.44A1.44,1.44,0,0,0,18.32,14.75Z" />
                        )}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 600, color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                  Envíanos un mensaje
                </h3>
                {formSent && <div className="success-note">¡Mensaje enviado correctamente! Te responderemos pronto.</div>}
                <div className="field">
                  <label htmlFor="ct-name">Nombre</label>
                  <input id="ct-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
                </div>
                <div className="field">
                  <label htmlFor="ct-email">Email</label>
                  <input id="ct-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" />
                </div>
                <div className="field">
                  <label htmlFor="ct-msg">Mensaje</label>
                  <textarea id="ct-msg" className="textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="¿En qué podemos ayudarte?" />
                </div>
                {formError && <p className="field-error">{formError}</p>}
                <button type="button" className="btn btn-primary btn-block" onClick={submitContact}>
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container-custom">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                FitZone<span>.</span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Tu centro de entrenamiento profesional. Alcanza tus objetivos con los mejores profesionales.
              </p>
            </div>
            <div>
              <h4>Enlaces rápidos</h4>
              <ul className="footer-links">
                <li>
                  <a href="#servicios">Servicios</a>
                </li>
                <li>
                  <a href="#horarios">Horarios</a>
                </li>
                <li>
                  <a href="#planes">Planes</a>
                </li>
                <li>
                  <a href="#contacto">Contacto</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul className="footer-links">
                <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{site.contact.email}</li>
                <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{site.contact.phone}</li>
                <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  {site.contact.address}, {site.contact.city}
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">{site.footer.copyright}</div>
        </div>
      </footer>
    </div>
  );
}
