import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../../core/store';

export function AdminDashboard() {
  const { state } = useApp();
  const unread = state.messages.filter((m) => !m.isRead).length;
  const lastBooking = useMemo(() => [...state.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0], [state.bookings]);
  const totalCapacity = useMemo(() => state.site.schedule.reduce((a, b) => a + b.capacity, 0), [state.site.schedule]);
  const occupancy = state.bookings.length ? Math.min(100, Math.round((state.bookings.length / Math.max(totalCapacity, 1)) * 100)) : 0;

  const stats = [
    {
      k: 'Reservas totales',
      v: state.bookings.length,
      icon: (
        <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      ),
      trend: state.bookings.length ? `+${Math.min(state.bookings.length, 12)} esta semana` : 'Sin actividad aún',
      accent: true,
    },
    {
      k: 'Mensajes sin leer',
      v: unread,
      icon: (
        <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      trend: unread ? 'Requiere atención' : 'Todo al día',
      accent: !!unread,
    },
    {
      k: 'Clases / semana',
      v: state.site.schedule.length,
      icon: (
        <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      trend: `${[...new Set(state.site.schedule.map((s) => s.dayOfWeek))].length} días activos`,
      accent: false,
    },
    {
      k: 'Servicios',
      v: state.site.services.length,
      icon: (
        <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M9 7h6" /></svg>
      ),
      trend: `${state.site.trainers.length} entrenadores`,
      accent: false,
    },
  ];

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>Vista general premium · Control en tiempo real de tu centro.</p>
        </div>
        <span className="badge badge--accent" style={{ padding: '0.42rem 0.75rem', fontSize: '0.72rem' }}>
          última actualización: {new Date(state.site.lastUpdated).toLocaleString('es-ES')}
        </span>
      </div>

      <div className="stat-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.k}
            className="stat-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
          >
            <div className="stat-top">
              <div className="stat-icon" style={s.accent ? { background: 'rgba(233,69,96,0.12)', color: 'var(--accent)', borderColor: 'rgba(233,69,96,0.18)' } : undefined}>{s.icon}</div>
              <span className="badge" style={{ fontSize: '0.68rem', background: s.accent ? 'rgba(233,69,96,0.08)' : 'white', color: s.accent ? 'var(--accent)' : '#6b7280', borderColor: s.accent ? 'rgba(233,69,96,0.16)' : '#e5e7eb' }}>{s.trend}</span>
            </div>
            <div className="k">{s.k}</div>
            <div className="v">{s.v}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr', gap: '1rem' }} className="dashboard-grid">
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h2 className="card-title" style={{ marginBottom: 0 }}>Última reserva</h2>
            <span className="badge badge--success">{occupancy}% ocupación</span>
          </div>
          {lastBooking ? (
            <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', background: '#fdf2f4', border: '1px solid rgba(233,69,96,0.14)', borderRadius: '0.85rem', padding: '0.9rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'white', border: '1px solid #ffe4e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800 }}>{lastBooking.name.slice(0, 2).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>{lastBooking.name} · <span style={{ color: 'var(--accent)' }}>{lastBooking.className}</span></div>
                <div style={{ color: '#6b7280', fontSize: '0.84rem' }}>{lastBooking.time} · {new Date(lastBooking.createdAt).toLocaleString('es-ES')}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.78rem', fontFamily: 'ui-monospace, monospace' }}>{lastBooking.email}</div>
              </div>
              <span className="badge badge--accent">Nueva</span>
            </div>
          ) : (
            <div className="empty-state" style={{ background: '#f9fafb', borderRadius: '0.85rem', border: '1px dashed #e5e7eb' }}>
              <div className="empty-emoji">📋</div>
              <p>Aún no hay reservas. Se crean desde el horario público.</p>
            </div>
          )}
          <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: 'white' }}>Capacidad total: {totalCapacity} plazas</span>
            <span className="badge" style={{ background: 'white' }}>{state.site.pricing.length} planes activos</span>
            <span className="badge" style={{ background: 'white' }}>{state.site.news.filter((n) => n.isActive).length} novedades publicadas</span>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="card-title">Actividad reciente</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', padding: '0.7rem', background: unread ? '#fff7ed' : '#f9fafb', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: unread ? '#fdba74' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>{unread} mensajes sin leer</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{state.messages.length} totales en bandeja</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', padding: '0.7rem', background: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #f3f4f6' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{state.site.trainers.length}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>Equipo activo</div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>{state.site.trainers.map((t) => t.name).join(' · ')}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
              <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary), #2d2d44)', color: 'white', borderRadius: '0.75rem', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800 }}>{state.bookings.length}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>Reservas</div>
              </div>
              <div style={{ flex: 1, background: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>{state.site.schedule.length}</div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>Clases</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width: 880px){ .dashboard-grid{ grid-template-columns:1fr !important; } }`}</style>
    </>
  );
}

export function AdminBookings() {
  const { state } = useApp();
  const sorted = useMemo(() => [...state.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [state.bookings]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Reservas</h1>
          <p>Listado premium con estado y control de aforo.</p>
        </div>
        <span className="badge badge--accent" style={{ padding: '0.42rem 0.75rem' }}>{sorted.length} totales</span>
      </div>

      {sorted.length === 0 ? (
        <div className="admin-card empty-state">
          <div className="empty-emoji">🗓️</div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>Sin reservas todavía</h3>
          <p>Las reservas aparecerán aquí cuando los usuarios reserven desde el horario público.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrap" style={{ display: 'block' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Clase</th>
                    <th>Hora</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th style={{ textAlign: 'right' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', border: '1px solid rgba(233,69,96,0.16)' }}>{b.name.slice(0, 2).toUpperCase()}</div>
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{b.name}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{b.className}</td>
                      <td>
                        <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{b.time}</span>
                      </td>
                      <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.82rem', color: '#475569' }}>{b.email}</td>
                      <td style={{ color: '#6b7280', fontSize: '0.84rem' }}>{new Date(b.createdAt).toLocaleString('es-ES')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge--success">Confirmada</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards fallback */}
          <div style={{ display: 'none' }} className="bookings-mobile">
            {sorted.map((b) => (
              <div className="msg-card" key={b.id}>
                <div className="msg-head">
                  <span className="editor-item-title">{b.name}</span>
                  <span className="badge">{new Date(b.createdAt).toLocaleString('es-ES')}</span>
                </div>
                <p className="msg-body"><b>{b.className}</b> · {b.time}</p>
                <p className="msg-body mono" style={{ fontSize: '0.76rem' }}>{b.email}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

export function AdminMessages() {
  const { state, markRead } = useApp();
  const sorted = useMemo(() => [...state.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [state.messages]);
  const unreadCount = state.messages.filter((m) => !m.isRead).length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Mensajes</h1>
          <p>Bandeja de entrada del formulario de contacto.</p>
        </div>
        <span className="badge" style={{ background: unreadCount ? 'rgba(233,69,96,0.09)' : 'white', color: unreadCount ? 'var(--accent)' : '#6b7280', borderColor: unreadCount ? 'rgba(233,69,96,0.18)' : '#e5e7eb', padding: '0.42rem 0.75rem' }}>
          {unreadCount} sin leer · {state.messages.length} totales
        </span>
      </div>

      {sorted.length === 0 ? (
        <div className="admin-card empty-state">
          <div className="empty-emoji">💬</div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>Bandeja vacía</h3>
          <p>No hay mensajes. Llegan desde el formulario de contacto del sitio público.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map((m) => (
            <div key={m.id} className={`msg-card ${m.isRead ? '' : 'msg-card--unread'}`}>
              <div className="msg-head">
                <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: m.isRead ? '#f3f4f6' : 'var(--accent)', color: m.isRead ? '#6b7280' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem', border: m.isRead ? '1px solid #e5e7eb' : '1px solid var(--accent)' }}>{m.name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="editor-item-title" style={{ fontSize: '0.95rem', lineHeight: 1.1 }}>{m.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', fontFamily: 'ui-monospace, monospace' }}>{m.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <span className="badge" style={{ background: 'white', fontSize: '0.72rem' }}>{new Date(m.createdAt).toLocaleString('es-ES')}</span>
                  {!m.isRead ? <span className="badge badge--accent">Nuevo</span> : <span className="badge" style={{ background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' }}>Leído</span>}
                  {!m.isRead && (
                    <button type="button" className="icon-btn" onClick={() => markRead(m.id)}>
                      Marcar leído
                    </button>
                  )}
                </div>
              </div>
              <p className="msg-body" style={{ marginTop: '0.65rem', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.75rem', padding: '0.75rem 0.85rem' }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
