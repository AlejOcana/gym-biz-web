import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

const EMOJI: Record<string, string> = {
  bike: '🚴',
  dumbbell: '🏋️',
  lotus: '🧘',
  boxing: '🥊',
};

function ServiceIcon({ name }: { name: string }) {
  return <span aria-hidden="true" style={{ fontSize: '1.6rem', lineHeight: 1 }}>{EMOJI[name] ?? '●'}</span>;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(m.matches);
    onChange();
    m.addEventListener?.('change', onChange);
    return () => m.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="card"
        style={{ width: '100%', maxWidth: '28rem' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Reservar ${session.className}`}
      >
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
      </motion.div>
    </motion.div>
  );
}

function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="section-head">
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
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
  const [scrollY, setScrollY] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  const daysWithClasses = useMemo(() => [...new Set(site.schedule.map((s) => s.dayOfWeek))].sort((a, b) => a - b), [site.schedule]);
  const daySessions = useMemo(() => site.schedule.filter((s) => s.dayOfWeek === day).sort((a, b) => a.time.localeCompare(b.time)), [site.schedule, day]);
  const activeNews = useMemo(() => site.news.filter((n) => n.isActive), [site.news]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ensure active day exists
  useEffect(() => {
    if (daysWithClasses.length && !daysWithClasses.includes(day)) setDay(daysWithClasses[0]);
  }, [daysWithClasses, day]);

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

  // reveal variants
  const containerVars: any = prefersReduced
    ? undefined
    : {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
      };
  const itemVars: any = prefersReduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
      };
  const itemAltVars: any = prefersReduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 16, x: -8 },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
      };

  const heroScrollOpacity = Math.max(0, 1 - scrollY / 180);

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
          <div className="hero-bg" style={{ overflow: 'hidden' }}>
            <motion.img
              src={site.hero.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80'}
              alt={site.hero.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80';
              }}
              initial={prefersReduced ? undefined : { scale: 1 }}
              animate={prefersReduced ? undefined : { scale: 1.05 }}
              transition={prefersReduced ? undefined : { duration: 8, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }}
            />
            <div className="hero-overlay" />
          </div>
          <motion.div
            className="hero-content container-custom"
            initial={prefersReduced ? undefined : 'hidden'}
            animate={prefersReduced ? undefined : 'visible'}
            variants={
              prefersReduced
                ? undefined
                : {
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
                  }
            }
          >
            <motion.h1
              variants={
                prefersReduced
                  ? undefined
                  : { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
              }
            >
              {site.hero.title}
            </motion.h1>
            <motion.p
              variants={
                prefersReduced
                  ? undefined
                  : { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } }
              }
            >
              {site.hero.subtitle}
            </motion.p>
            <motion.div
              variants={
                prefersReduced
                  ? undefined
                  : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
              }
            >
              <motion.a
                href="#contacto"
                className="btn btn-primary hero-cta"
                whileHover={prefersReduced ? undefined : { y: -3, scale: 1.02 }}
                whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              >
                {site.hero.ctaText}
              </motion.a>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-scroll"
            aria-hidden="true"
            style={{ opacity: heroScrollOpacity }}
            animate={prefersReduced ? undefined : { y: [0, -8, 0] }}
            transition={prefersReduced ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        {/* SERVICES */}
        <motion.section
          id="servicios"
          className="section"
          initial={prefersReduced ? undefined : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={prefersReduced ? undefined : { once: true, amount: 0.15 }}
          variants={containerVars}
        >
          <div className="container-custom">
            <motion.div variants={itemVars}>
              <SectionHead title="Nuestros Servicios" subtitle="Entrena con los mejores profesionales y alcanza tus objetivos" />
            </motion.div>
            <motion.div className="services-grid" variants={containerVars}>
              {[...site.services]
                .sort((a, b) => a.order - b.order)
                .map((s, idx) => {
                  const seed = s.id || s.name.toLowerCase().replace(/\s+/g, '-');
                  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
                  const imgSrc = s.imageUrl || fallback;
                  const vars = idx % 2 === 0 ? itemVars : itemAltVars;
                  return (
                    <motion.div
                      key={s.id}
                      className="service-card service-card--with-image"
                      variants={vars}
                      whileHover={prefersReduced ? undefined : { y: -4 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                    >
                      <div className="service-img-wrap">
                        <img
                          src={imgSrc}
                          alt={s.name}
                          loading="lazy"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            if (t.src !== fallback) t.src = fallback;
                          }}
                        />
                        <div className="service-img-gradient" aria-hidden="true" />
                        <div className="service-icon service-icon--over">
                          <ServiceIcon name={s.icon} />
                        </div>
                      </div>
                      <div className="service-body">
                        <h3>{s.name}</h3>
                        <p>{s.description}</p>
                        {s.imageAttribution && <p className="service-attr">{s.imageAttribution}</p>}
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </div>
        </motion.section>

        {/* NEWS */}
        {activeNews.length > 0 && (
          <motion.section
            id="novedades"
            className="section"
            initial={prefersReduced ? undefined : 'hidden'}
            whileInView={prefersReduced ? undefined : 'visible'}
            viewport={prefersReduced ? undefined : { once: true, amount: 0.12 }}
            variants={containerVars}
          >
            <div className="container-custom">
              <motion.div variants={itemVars}>
                <SectionHead title="Novedades" subtitle="Mantente informado de las últimas noticias y eventos" />
              </motion.div>
              <motion.div className="news-grid" variants={containerVars}>
                {activeNews.map((n) => (
                  <motion.article
                    key={n.id}
                    className="card news-card"
                    variants={itemVars}
                    whileHover={prefersReduced ? undefined : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <div className="news-date">
                      <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {n.publishedAt}
                    </div>
                    <h3 className="news-title">{n.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{n.excerpt}</p>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* SCHEDULE with booking */}
        <motion.section
          id="horarios"
          className="section"
          initial={prefersReduced ? undefined : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={prefersReduced ? undefined : { once: true, amount: 0.1 }}
          variants={containerVars}
        >
          <div className="container-custom">
            <motion.div variants={itemVars}>
              <SectionHead title="Horarios" subtitle="Elige el día y reserva tu plaza — sin permanencia" />
            </motion.div>

            <motion.div className="day-tabs" role="tablist" aria-label="Día de la semana" variants={itemVars}>
              {daysWithClasses.map((d) => (
                <motion.button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={day === d}
                  className={`day-tab ${day === d ? 'day-tab--on' : ''}`}
                  onClick={() => setDay(d)}
                  whileHover={prefersReduced ? undefined : { y: -1 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                >
                  {DAY_NAMES[d - 1]}
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVars}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={day}
                  initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
                  animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
                  transition={prefersReduced ? undefined : { duration: 0.28, ease: 'easeOut' }}
                  className="schedule-wrap"
                >
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
                          <motion.tr
                            key={s.id}
                            initial={prefersReduced ? undefined : { opacity: 0 }}
                            animate={prefersReduced ? undefined : { opacity: 1 }}
                            transition={prefersReduced ? undefined : { duration: 0.2 }}
                            whileHover={prefersReduced ? undefined : { backgroundColor: '#f9fafb' }}
                          >
                            <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.className}</td>
                            <td style={{ color: '#4b5563' }}>
                              {s.time} · {s.duration}′
                            </td>
                            <td style={{ color: '#6b7280' }}>{s.instructor || '—'}</td>
                            <td>
                              <span className={`seats ${seatClass}`}>{left === 0 ? 'Completo' : `${left} libres`}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <motion.button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={left === 0}
                                onClick={() => setBookingSession(s)}
                                whileHover={prefersReduced || left === 0 ? undefined : { y: -1, scale: 1.03 }}
                                whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                              >
                                Reservar
                              </motion.button>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {daySessions.length === 0 && <p style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No hay clases este día.</p>}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>{bookingSession && <BookingModal session={bookingSession} onClose={() => setBookingSession(null)} />}</AnimatePresence>
          </div>
        </motion.section>

        {/* PRICING */}
        <motion.section
          id="planes"
          className="section"
          initial={prefersReduced ? undefined : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={prefersReduced ? undefined : { once: true, amount: 0.12 }}
          variants={containerVars}
        >
          <div className="container-custom">
            <motion.div variants={itemVars}>
              <SectionHead title="Planes y Precios" subtitle="Elige el plan que mejor se adapte a tus necesidades" />
            </motion.div>

            <motion.div className="billing-toggle" variants={itemVars}>
              <div className="billing-pill" role="group" aria-label="Periodo de facturación">
                <button type="button" className={`billing-opt ${billing === 'month' ? 'billing-opt--on' : ''}`} onClick={() => setBilling('month')}>
                  Mensual
                </button>
                <button type="button" className={`billing-opt ${billing === 'year' ? 'billing-opt--on' : ''}`} onClick={() => setBilling('year')}>
                  Anual
                </button>
              </div>
              {billing === 'year' && <span className="save-tag">2 MESES GRATIS</span>}
            </motion.div>

            <motion.div className="pricing-grid" variants={containerVars}>
              {[...site.pricing]
                .sort((a, b) => a.order - b.order)
                .map((p) => {
                  const price = billing === 'year' ? annualPrice(p.price) : p.price;
                  return (
                    <motion.div
                      key={p.id}
                      className={`price-card ${p.isPopular ? 'price-card--popular' : ''}`}
                      variants={itemVars}
                      whileHover={prefersReduced ? undefined : { y: -6, scale: p.isPopular ? 1.03 : 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {p.isPopular && <div className="popular-tag">Popular</div>}
                      <h3 className="price-name">{p.name}</h3>
                      <div className="price-amount">
                        {price}€ <small>/{billing === 'year' ? 'año' : 'mes'}</small>
                      </div>
                      <ul className="price-features">
                        {p.features.map((f, i) => (
                          <motion.li
                            key={f}
                            initial={prefersReduced ? undefined : { opacity: 0, x: -6 }}
                            whileInView={prefersReduced ? undefined : { opacity: 1, x: 0 }}
                            viewport={prefersReduced ? undefined : { once: true }}
                            transition={prefersReduced ? undefined : { delay: i * 0.05, duration: 0.32 }}
                          >
                            <motion.svg
                              width={20}
                              height={20}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              initial={prefersReduced ? undefined : { scale: 0.6 }}
                              whileInView={prefersReduced ? undefined : { scale: 1 }}
                              viewport={prefersReduced ? undefined : { once: true }}
                              transition={prefersReduced ? undefined : { type: 'spring', stiffness: 400, damping: 14, delay: i * 0.05 + 0.1 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </motion.svg>
                            {f}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.a
                        href="#contacto"
                        className={`btn ${p.isPopular ? 'btn-primary' : 'btn-outline'} btn-block`}
                        whileHover={prefersReduced ? undefined : { y: -2 }}
                        whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                      >
                        Elegir Plan
                      </motion.a>
                    </motion.div>
                  );
                })}
            </motion.div>
          </div>
        </motion.section>

        {/* TRAINERS */}
        <motion.section
          id="entrenadores"
          className="section"
          initial={prefersReduced ? undefined : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={prefersReduced ? undefined : { once: true, amount: 0.12 }}
          variants={containerVars}
        >
          <div className="container-custom">
            <motion.div variants={itemVars}>
              <SectionHead title="Nuestros Entrenadores" subtitle="Profesionales certificados para guiarte" />
            </motion.div>
            <motion.div className="trainers-grid" variants={containerVars}>
              {site.trainers.map((t) => (
                <motion.div
                  key={t.id}
                  className="trainer-card"
                  variants={itemVars}
                  whileHover={prefersReduced ? undefined : { y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="trainer-avatar"
                    whileHover={prefersReduced ? undefined : { scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                  >
                    {t.initials}
                  </motion.div>
                  <div className="trainer-name">{t.name}</div>
                  <div className="trainer-spec">{t.specialty}</div>
                  <p className="trainer-bio">{t.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CONTACT */}
        <motion.section
          id="contacto"
          className="section"
          initial={prefersReduced ? undefined : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={prefersReduced ? undefined : { once: true, amount: 0.12 }}
          variants={containerVars}
        >
          <div className="container-custom">
            <motion.div variants={itemVars}>
              <SectionHead title="Contacto" subtitle="¿Tienes alguna pregunta? Contáctanos y te responderemos ASAP" />
            </motion.div>
            <motion.div className="contact-grid" variants={containerVars}>
              <motion.div className="card contact-info-card" variants={itemVars} whileHover={prefersReduced ? undefined : { y: -2 }} transition={{ duration: 0.2 }}>
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
                    <motion.a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.platform}
                      whileHover={prefersReduced ? undefined : { y: -3, scale: 1.08 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    >
                      <svg width={20} height={20} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {s.platform === 'facebook' ? (
                          <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z" />
                        ) : (
                          <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84a6.16,6.16,0,1,0,6.16,6.16A6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16Zm6.32-1.25a1.44,1.44,0,1,0-1.44,1.44A1.44,1.44,0,0,0,18.32,14.75Z" />
                        )}
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div className="card" variants={itemVars} whileHover={prefersReduced ? undefined : { y: -2 }} transition={{ duration: 0.2 }}>
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
                <motion.button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={submitContact}
                  whileHover={prefersReduced ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={prefersReduced ? undefined : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  Enviar Mensaje
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
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
