import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../core/store';
import { BOOKING_ERRORS, createBooking, seatsLeft } from '../core/booking';
import { DAY_NAMES, annualPrice } from '../core/types';
import type { ScheduleItem } from '../core/types';

const NAV = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#horario', label: 'Horario' },
  { href: '#precios', label: 'Precios' },
  { href: '#entrenadores', label: 'Entrenadores' },
  { href: '#contacto', label: 'Contacto' },
];

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark',
  );
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      onClick={() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset['theme'] = next;
        try {
          localStorage.setItem('gymbiz.theme', next);
        } catch { /* noop */ }
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', next === 'light' ? '#f7f9f0' : '#0c0f0a');
        setTheme(next);
      }}
    >
      {theme === 'dark' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

function BookingModal({
  session,
  onClose,
}: {
  session: ScheduleItem;
  onClose: () => void;
}) {
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
    <div className="login-wrap" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} onClick={onClose}>
      <div className="card login-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Reservar ${session.className}`}>
        {done ? (
          <>
            <div className="success-note">¡Reserva confirmada! Te esperamos el {DAY_NAMES[session.dayOfWeek - 1]} a las {session.time}.</div>
            <button type="button" className="btn btn--primary" style={{ width: '100%' }} onClick={onClose}>
              Hecho
            </button>
          </>
        ) : (
          <>
            <h3 className="card-title" style={{ marginBottom: '0.3rem' }}>
              Reservar {session.className}
            </h3>
            <p className="hint" style={{ marginBottom: '1rem' }}>
              {DAY_NAMES[session.dayOfWeek - 1]} · {session.time} · {session.duration} min
              {session.instructor ? ` · ${session.instructor}` : ''}
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
              <button type="button" className="btn btn--primary" style={{ flex: 1 }} onClick={submit}>
                Confirmar reserva
              </button>
              <button type="button" className="btn btn--ghost" onClick={onClose}>
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
  const [day, setDay] = useState<number>(new Date().getDay() || 7);
  const [bookingSession, setBookingSession] = useState<ScheduleItem | null>(null);
  const [billing, setBilling] = useState<'month' | 'year'>('month');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const daysWithClasses = useMemo(
    () => [...new Set(site.schedule.map((s) => s.dayOfWeek))].sort((a, b) => a - b),
    [site.schedule],
  );
  const daySessions = useMemo(
    () => site.schedule.filter((s) => s.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time)),
    [site.schedule, day],
  );
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
  };

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">
            <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M14 32h8l4-10 8 20 5-10h11" fill="none" stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>
              Fit<b>Zone</b>
            </span>
          </div>
          <nav className="nav-links" aria-label="Secciones">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="topbar-right">
            <ThemeToggle />
            <button type="button" className="admin-link" onClick={() => setView('admin')}>
              ADMIN
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            style={{ opacity: 1 }}
          >
            <span className="badge badge--accent">{site.contact.city} · Abierto 7 días</span>
            <h1 style={{ marginTop: '1rem' }}>
              {site.hero.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="accent">{site.hero.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="hero-sub">{site.hero.subtitle}</p>
            <div className="hero-ctas">
              <a href="#contacto" className="btn btn--primary">
                {site.hero.ctaText}
              </a>
              <a href="#horario" className="btn btn--ghost">
                Ver horario
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>{site.services.length}</b>
                <span>disciplinas</span>
              </div>
              <div className="hero-stat">
                <b>{site.schedule.length}</b>
                <span>clases / semana</span>
              </div>
              <div className="hero-stat">
                <b>{site.trainers.length}</b>
                <span>entrenadores</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section container" id="servicios">
        <div className="section-head">
          <span className="kicker">Servicios</span>
          <h2>Entrena a tu manera</h2>
        </div>
        <div className="services-grid">
          {site.services.map((s) => (
            <div className="service-card" key={s.id}>
              <div className="service-icon" aria-hidden="true">
                {s.icon === 'bike' ? '🚴' : s.icon === 'dumbbell' ? '🏋️' : s.icon === 'lotus' ? '🧘' : s.icon === 'boxing' ? '🥊' : '●'}
              </div>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCHEDULE + BOOKING */}
      <section className="section container" id="horario">
        <div className="section-head">
          <span className="kicker">Horario</span>
          <h2>Reserva tu clase</h2>
          <p>Elige el día y reserva tu plaza. Sin permanencia.</p>
        </div>
        <div className="day-tabs" role="tablist" aria-label="Día de la semana">
          {daysWithClasses.map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              className={`day-tab ${day === d ? 'day-tab--on' : ''}`}
              aria-selected={day === d}
              onClick={() => setDay(d)}
            >
              {DAY_NAMES[d - 1]}
            </button>
          ))}
        </div>
        <div>
          {daySessions.map((s) => {
            const left = seatsLeft(s, bookings);
            const seatClass = left === 0 ? 'seats--full' : left <= 3 ? 'seats--low' : '';
            return (
              <div className="session-row" key={s.id}>
                <span className="session-time">{s.time}</span>
                <div>
                  <div className="session-name">{s.className}</div>
                  <div className="session-meta">
                    {s.duration} min{s.instructor ? ` · ${s.instructor}` : ''}
                  </div>
                </div>
                <div className="session-right">
                  <span className={`seats ${seatClass}`}>
                    {left === 0 ? 'Completo' : `${left} plazas libres`}
                  </span>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    disabled={left === 0}
                    onClick={() => setBookingSession(s)}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            );
          })}
          {daySessions.length === 0 && <p className="hint">No hay clases este día.</p>}
        </div>

        <AnimatePresence>
          {bookingSession && (
            <BookingModal session={bookingSession} onClose={() => setBookingSession(null)} />
          )}
        </AnimatePresence>
      </section>

      {/* PRICING */}
      <section className="section container" id="precios">
        <div className="section-head">
          <span className="kicker">Precios</span>
          <h2>Sin permanencia</h2>
        </div>
        <div className="billing-toggle">
          <div className="billing-pill" role="group" aria-label="Periodo de facturación">
            <button
              type="button"
              className={`billing-opt ${billing === 'month' ? 'billing-opt--on' : ''}`}
              onClick={() => setBilling('month')}
            >
              Mensual
            </button>
            <button
              type="button"
              className={`billing-opt ${billing === 'year' ? 'billing-opt--on' : ''}`}
              onClick={() => setBilling('year')}
            >
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
                  {p.isPopular && <span className="popular-tag">Más popular</span>}
                  <span className="price-name">{p.name}</span>
                  <div className="price-amount">
                    {price} €<small>/{billing === 'year' ? 'año' : 'mes'}</small>
                  </div>
                  <ul className="price-features">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <a href="#contacto" className={`btn ${p.isPopular ? 'btn--primary' : 'btn--ghost'}`}>
                    Empezar ahora
                  </a>
                </div>
              );
            })}
        </div>
      </section>

      {/* TRAINERS */}
      <section className="section container" id="entrenadores">
        <div className="section-head">
          <span className="kicker">Entrenadores</span>
          <h2>Conoce al equipo</h2>
        </div>
        <div className="services-grid">
          {site.trainers.map((t) => (
            <div className="trainer-card" key={t.id}>
              <div className="trainer-avatar">{t.initials}</div>
              <div className="trainer-name">{t.name}</div>
              <div className="trainer-spec">{t.specialty}</div>
              <p className="trainer-bio">{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      {activeNews.length > 0 && (
        <section className="section container" id="noticias">
          <div className="section-head">
            <span className="kicker">Novedades</span>
            <h2>Noticias del gym</h2>
          </div>
          <div className="news-grid">
            {activeNews.map((n) => (
              <article className="card" key={n.id}>
                <span className="news-date">{n.publishedAt}</span>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-excerpt">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="section container" id="contacto">
        <div className="section-head">
          <span className="kicker">Contacto</span>
          <h2>Ven a conocernos</h2>
        </div>
        <div className="contact-grid">
          <div className="card">
            <div className="contact-line">
              <span className="k">EMAIL</span>
              <span>{site.contact.email}</span>
            </div>
            <div className="contact-line">
              <span className="k">TELÉFONO</span>
              <span>{site.contact.phone}</span>
            </div>
            <div className="contact-line">
              <span className="k">DIRECCIÓN</span>
              <span>
                {site.contact.address}, {site.contact.city}
              </span>
            </div>
            <div className="socials">
              {site.contact.socialLinks.map((s) => (
                <a key={s.platform} href={s.url} target="_blank" rel="noreferrer">
                  {s.platform} ↗
                </a>
              ))}
            </div>
          </div>
          <div className="card">
            {formSent ? (
              <div className="success-note">
                Mensaje enviado. Te respondemos en menos de 24 h.
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="ct-name">Nombre</label>
              <input id="ct-name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="ct-email">Email</label>
              <input id="ct-email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="ct-msg">Mensaje</label>
              <textarea id="ct-msg" className="textarea" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            {formError && <p className="field-error">{formError}</p>}
            <button type="button" className="btn btn--primary" onClick={submitContact}>
              Enviar mensaje
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>{site.footer.copyright}</span>
          <span className="mono">GymBiz v2 — site as a service</span>
        </div>
      </footer>
    </>
  );
}
