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
        <div className="logo" style={{ marginBottom: '1.2rem' }}>
          <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M14 32h8l4-10 8 20 5-10h11" fill="none" stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Fit<b>Zone</b> <span className="version mono">admin</span>
          </span>
        </div>
        <div className="field">
          <label htmlFor="ad-email">Email</label>
          <input id="ad-email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="ad-pass">Contraseña</label>
          <input id="ad-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        {error && <p className="field-error">Credenciales incorrectas.</p>}
        <button type="button" className="btn btn--primary" style={{ width: '100%', marginTop: '0.6rem' }} onClick={submit}>
          Entrar
        </button>
        <p className="login-hint">
          demo · {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
        </p>
        <BackToSite />
      </div>
    </div>
  );
}

function BackToSite() {
  const { setView } = useApp();
  return (
    <button type="button" className="admin-link" style={{ marginTop: '1rem' }} onClick={() => setView('public')}>
      ← Volver al sitio
    </button>
  );
}

export function AdminApp() {
  const { state, setAdminSection, logout, setView } = useApp();

  if (!isValidSession(state.session)) return <Login />;

  const unread = state.messages.filter((m) => !m.isRead).length;

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="logo">
          <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M14 32h8l4-10 8 20 5-10h11" fill="none" stroke="var(--accent)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Fit<b>Zone</b>
          </span>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`admin-nav-btn ${state.adminSection === s.id ? 'admin-nav-btn--on' : ''}`}
            onClick={() => setAdminSection(s.id)}
          >
            {s.label}
            {s.id === 'messages' && unread > 0 && <span className="count">{unread}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button type="button" className="admin-nav-btn" onClick={() => setView('public')}>
          Ver sitio ↗
        </button>
        <button type="button" className="admin-nav-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="admin-main">
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
