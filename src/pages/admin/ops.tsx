import { useApp } from '../../core/store';

export function AdminDashboard() {
  const { state } = useApp();
  const unread = state.messages.filter((m) => !m.isRead).length;
  const lastBooking = [...state.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  return (
    <>
      <div className="admin-head">
        <h1>Dashboard</h1>
        <span className="badge badge--accent">
          última actualización: {new Date(state.site.lastUpdated).toLocaleString('es-ES')}
        </span>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="k">Reservas</div>
          <div className="v">{state.bookings.length}</div>
        </div>
        <div className="stat-card">
          <div className="k">Mensajes sin leer</div>
          <div className="v">{unread}</div>
        </div>
        <div className="stat-card">
          <div className="k">Clases / semana</div>
          <div className="v">{state.site.schedule.length}</div>
        </div>
        <div className="stat-card">
          <div className="k">Servicios</div>
          <div className="v">{state.site.services.length}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Última reserva</h2>
        {lastBooking ? (
          <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>
            <b>{lastBooking.name}</b> reservó <b>{lastBooking.className}</b> ({lastBooking.time}) —{' '}
            {new Date(lastBooking.createdAt).toLocaleString('es-ES')}
          </p>
        ) : (
          <p className="hint">Aún no hay reservas. Se crean desde el horario público.</p>
        )}
      </div>
    </>
  );
}

export function AdminBookings() {
  const { state } = useApp();
  const sorted = [...state.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="admin-head">
        <h1>Reservas</h1>
        <span className="badge badge--accent">{sorted.length} totales</span>
      </div>
      {sorted.length === 0 && <p className="hint">No hay reservas todavía.</p>}
      {sorted.map((b) => (
        <div className="msg-card" key={b.id}>
          <div className="msg-head">
            <span className="editor-item-title">{b.name}</span>
            <span className="badge">{new Date(b.createdAt).toLocaleString('es-ES')}</span>
          </div>
          <p className="msg-body">
            <b>{b.className}</b> · {b.time}
          </p>
          <p className="msg-body mono" style={{ fontSize: '0.76rem' }}>
            {b.email} · {b.time}
          </p>
        </div>
      ))}
    </>
  );
}

export function AdminMessages() {
  const { state, markRead } = useApp();
  const sorted = [...state.messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <div className="admin-head">
        <h1>Mensajes</h1>
        <span className="badge badge--accent">
          {state.messages.filter((m) => !m.isRead).length} sin leer
        </span>
      </div>
      {sorted.length === 0 && <p className="hint">No hay mensajes. Llegan desde el formulario de contacto.</p>}
      {sorted.map((m) => (
        <div className={`msg-card ${m.isRead ? '' : 'msg-card--unread'}`} key={m.id}>
          <div className="msg-head">
            <span className="editor-item-title">{m.name}</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge">{new Date(m.createdAt).toLocaleString('es-ES')}</span>
              {!m.isRead && (
                <button type="button" className="icon-btn" onClick={() => markRead(m.id)}>
                  Marcar leído
                </button>
              )}
            </div>
          </div>
          <p className="msg-body mono" style={{ fontSize: '0.76rem' }}>
            {m.email}
          </p>
          <p className="msg-body" style={{ marginTop: '0.4rem' }}>
            {m.message}
          </p>
        </div>
      ))}
    </>
  );
}
