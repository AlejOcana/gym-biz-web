import { useState } from 'react';
import { useApp } from '../../core/store';
import { DEMO_CREDENTIALS, isValidSession, login as doLogin } from '../../core/auth';
import { Editors } from './editors';
import { AdminBookings, AdminDashboard, AdminMessages } from './ops';

const SECTIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'bookings', label: 'Reservas' },
  { id: 'messages', label: 'Mensajes' },
  { id: 'hero', label: 'Hero' },
  { id: 'services', label: 'Servicios' },
  { id: 'schedule', label: 'Horario' },
  { id: 'pricing', label: 'Precios' },
  { id: 'trainers', label: 'Entrenadores' },
  { id: 'news', label: 'Noticias' },
  { id: 'contact', label: 'Contacto' },
] as const;

function NavIcon({ id }: { id: string }) {
  const common = { width: 17, height: 17, fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, viewBox: '0 0 24 24' } as const;
  if (id === 'dashboard')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    );
  if (id === 'bookings')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    );
  if (id === 'messages')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
  if (id === 'hero')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4 6-10 2 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" /></svg>
    );
  if (id === 'services')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M9 7h6" /></svg>
    );
  if (id === 'schedule')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    );
  if (id === 'pricing')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V6m0 8v2m-4-4H6m12 0h-2" /></svg>
    );
  if (id === 'trainers')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-2a3 3 0 00-3-3H10a3 3 0 00-3 3v2m8 0H9m4-10a3 3 0 100-6 3 3 0 000 6z" /></svg>
    );
  if (id === 'news')
    return (
      <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2V6a2 2 0 00-2-2z" /></svg>
    );
  return (
    <svg {...common} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  );
}

function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    const session = doLogin(email, password);
    if (!session) {
      setError(true);
      return;
    }
    login(session);
  };

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="logo" style={{ marginBottom: '1.1rem' }}>
          <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M14 32h8l4-10 8 20 5-10h11" fill="none" stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Fit<b>Zone</b> <span className="version mono">admin</span>
          </span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.1rem', lineHeight: 1.5 }}>Accede al panel premium para gestionar tu centro. Diseño claro, control total.</p>
        <div className="field">
          <label htmlFor="ad-email">Email</label>
          <input id="ad-email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" placeholder="admin@fitzone.es" />
        </div>
        <div className="field">
          <label htmlFor="ad-pass">Contraseña</label>
          <input id="ad-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
        </div>
        {error && <p className="field-error">Credenciales incorrectas.</p>}
        <button type="button" className="btn btn--primary" style={{ width: '100%', marginTop: '0.6rem', borderRadius: '0.7rem', padding: '0.8rem' }} onClick={submit}>
          Entrar al panel
        </button>
        <p className="login-hint">
          demo · <b>{DEMO_CREDENTIALS.email}</b> / <b>{DEMO_CREDENTIALS.password}</b>
        </p>
        <BackToSite />
      </div>
    </div>
  );
}

function BackToSite() {
  const { setView } = useApp();
  return (
    <button type="button" className="admin-ghost-btn" style={{ marginTop: '0.9rem', justifyContent: 'center' }} onClick={() => setView('public')}>
      ← Volver al sitio
    </button>
  );
}

export function AdminApp() {
  const { state, setAdminSection, logout, setView } = useApp();

  if (!isValidSession(state.session)) return <Login />;

  const unread = state.messages.filter((m) => !m.isRead).length;
  const opsSections = SECTIONS.slice(0, 3);
  const contentSections = SECTIONS.slice(3);

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="logo">
          <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M14 32h8l4-10 8 20 5-10h11" fill="none" stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Fit<b>Zone</b> <span className="version">admin</span>
          </span>
        </div>
        <div className="admin-nav-section">Gestión</div>
        {opsSections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`admin-nav-btn ${state.adminSection === s.id ? 'admin-nav-btn--on' : ''}`}
            onClick={() => setAdminSection(s.id)}
          >
            <NavIcon id={s.id} />
            {s.label}
            {s.id === 'messages' && unread > 0 && <span className="count">{unread}</span>}
          </button>
        ))}
        <div className="admin-nav-section">Contenido</div>
        {contentSections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`admin-nav-btn ${state.adminSection === s.id ? 'admin-nav-btn--on' : ''}`}
            onClick={() => setAdminSection(s.id)}
          >
            <NavIcon id={s.id} />
            {s.label}
          </button>
        ))}
        <div className="admin-side-bottom">
          <button type="button" className="admin-ghost-btn" onClick={() => setView('public')}>
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Ver sitio
          </button>
          <button type="button" className="admin-ghost-btn" onClick={logout}>
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-breadcrumb" aria-label="breadcrumb">
          <span>Admin</span>
          <span>›</span>
          <span>{SECTIONS.find((s) => s.id === state.adminSection)?.label ?? state.adminSection}</span>
        </div>
        {state.adminSection === 'dashboard' && <AdminDashboard />}
        {state.adminSection === 'bookings' && <AdminBookings />}
        {state.adminSection === 'messages' && <AdminMessages />}
        {state.adminSection === 'hero' && <Editors section="hero" />}
        {state.adminSection === 'services' && <Editors section="services" />}
        {state.adminSection === 'schedule' && <Editors section="schedule" />}
        {state.adminSection === 'pricing' && <Editors section="pricing" />}
        {state.adminSection === 'trainers' && <Editors section="trainers" />}
        {state.adminSection === 'news' && <Editors section="news" />}
        {state.adminSection === 'contact' && <Editors section="contact" />}
      </main>
    </div>
  );
}
