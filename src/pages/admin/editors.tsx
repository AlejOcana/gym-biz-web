import { useApp } from '../../core/store';
import type { SiteContent } from '../../core/types';
import { DAY_NAMES } from '../../core/types';

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function AreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea className="textarea" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="editor-item">
      <div className="editor-item-head">
        <span className="editor-item-title">{title}</span>
        <div className="editor-actions">
          <button type="button" className="icon-btn icon-btn--danger" onClick={onRemove}>
            Eliminar
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={onClick}>
      + {label}
    </button>
  );
}

export function Editors({ section }: { section: string }) {
  const { state, updateSite, resetContent } = useApp();
  const site = state.site;

  const patch = (partial: Partial<SiteContent>) =>
    updateSite({ ...site, ...partial, lastUpdated: new Date().toISOString() });

  const nextId = (prefix: string) =>
    `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 100)}`;

  const head = (
    <div className="admin-head">
      <h1>{TITLES[section] ?? section}</h1>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <span className="badge">guardado automático</span>
        <button type="button" className="btn btn--danger btn--sm" onClick={resetContent}>
          Restaurar contenido
        </button>
      </div>
    </div>
  );

  if (section === 'hero') {
    return (
      <>
        {head}
        <div className="card">
          <Field label="Título" value={site.hero.title} onChange={(v) => patch({ hero: { ...site.hero, title: v } })} />
          <AreaField label="Subtítulo" value={site.hero.subtitle} onChange={(v) => patch({ hero: { ...site.hero, subtitle: v } })} />
          <Field label="Texto del CTA" value={site.hero.ctaText} onChange={(v) => patch({ hero: { ...site.hero, ctaText: v } })} />
        </div>
      </>
    );
  }

  if (section === 'services') {
    return (
      <>
        {head}
        {site.services.map((s) => (
          <ItemCard
            key={s.id}
            title={s.name}
            onRemove={() => patch({ services: site.services.filter((x) => x.id !== s.id) })}
          >
            <Field label="Nombre" value={s.name} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, name: v } : x)) })} />
            <AreaField label="Descripción" value={s.description} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, description: v } : x)) })} />
          </ItemCard>
        ))}
        <AddBtn
          label="Añadir servicio"
          onClick={() =>
            patch({
              services: [
                ...site.services,
                { id: nextId('s'), name: 'Nuevo servicio', description: '', icon: 'other', order: site.services.length + 1 },
              ],
            })
          }
        />
      </>
    );
  }

  if (section === 'schedule') {
    const byDay = [...site.schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time));
    return (
      <>
        {head}
        {byDay.map((s) => (
          <ItemCard
            key={s.id}
            title={`${DAY_NAMES[s.dayOfWeek - 1]} · ${s.time} · ${s.className}`}
            onRemove={() => patch({ schedule: site.schedule.filter((x) => x.id !== s.id) })}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))', gap: '0 1rem' }}>
              <Field
                label="Día"
                type="number"
                value={s.dayOfWeek}
                onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, dayOfWeek: Math.min(Math.max(Number(v) || 1, 1), 7) } : x)) })}
              />
              <Field label="Hora" value={s.time} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, time: v } : x)) })} />
              <Field label="Clase" value={s.className} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, className: v } : x)) })} />
              <Field label="Instructor" value={s.instructor} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, instructor: v } : x)) })} />
              <Field label="Duración (min)" type="number" value={s.duration} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, duration: Number(v) || 0 } : x)) })} />
              <Field label="Aforo" type="number" value={s.capacity} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, capacity: Math.max(Number(v) || 1, 1) } : x)) })} />
            </div>
          </ItemCard>
        ))}
        <AddBtn
          label="Añadir clase"
          onClick={() =>
            patch({
              schedule: [
                ...site.schedule,
                { id: nextId('sch'), dayOfWeek: 1, className: 'Nueva clase', time: '10:00', instructor: '', duration: 45, capacity: 12 },
              ],
            })
          }
        />
      </>
    );
  }

  if (section === 'pricing') {
    return (
      <>
        {head}
        {[...site.pricing].sort((a, b) => a.order - b.order).map((p) => (
          <ItemCard
            key={p.id}
            title={p.name}
            onRemove={() => patch({ pricing: site.pricing.filter((x) => x.id !== p.id) })}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 1rem' }}>
              <Field label="Nombre" value={p.name} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, name: v } : x)) })} />
              <Field label="Precio €/mes" type="number" value={p.price} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, price: Number(v) || 0 } : x)) })} />
              <Field label="Orden" type="number" value={p.order} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, order: Number(v) || 0 } : x)) })} />
            </div>
            <AreaField
              label="Características (una por línea)"
              value={p.features.join('\n')}
              onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, features: v.split('\n').filter((f) => f.trim()) } : x)) })}
            />
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.84rem' }}>
              <input
                type="checkbox"
                checked={p.isPopular}
                onChange={(e) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, isPopular: e.target.checked } : x)) })}
              />
              Plan destacado
            </label>
          </ItemCard>
        ))}
        <AddBtn
          label="Añadir plan"
          onClick={() =>
            patch({
              pricing: [
                ...site.pricing,
                { id: nextId('p'), name: 'Nuevo plan', price: 39, features: ['Característica 1'], isPopular: false, order: site.pricing.length + 1 },
              ],
            })
          }
        />
      </>
    );
  }

  if (section === 'trainers') {
    return (
      <>
        {head}
        {site.trainers.map((t) => (
          <ItemCard key={t.id} title={t.name} onRemove={() => patch({ trainers: site.trainers.filter((x) => x.id !== t.id) })}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 8rem', gap: '0 1rem' }}>
              <Field label="Nombre" value={t.name} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, name: v, initials: v.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase() } : x)) })} />
              <Field label="Especialidad" value={t.specialty} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, specialty: v } : x)) })} />
              <Field label="Iniciales" value={t.initials} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, initials: v.slice(0, 2).toUpperCase() } : x)) })} />
            </div>
            <AreaField label="Bio" value={t.bio} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, bio: v } : x)) })} />
          </ItemCard>
        ))}
        <AddBtn
          label="Añadir entrenador"
          onClick={() =>
            patch({
              trainers: [
                ...site.trainers,
                { id: nextId('t'), name: 'Nuevo entrenador', specialty: '', bio: '', initials: 'NE' },
              ],
            })
          }
        />
      </>
    );
  }

  if (section === 'news') {
    return (
      <>
        {head}
        {site.news.map((n) => (
          <ItemCard key={n.id} title={n.title} onRemove={() => patch({ news: site.news.filter((x) => x.id !== n.id) })}>
            <Field label="Titular" value={n.title} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, title: v } : x)) })} />
            <Field label="Entradilla" value={n.excerpt} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, excerpt: v } : x)) })} />
            <AreaField label="Contenido" value={n.content} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, content: v } : x)) })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <Field label="Fecha (YYYY-MM-DD)" value={n.publishedAt} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, publishedAt: v } : x)) })} />
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.84rem', paddingTop: '1.4rem' }}>
                <input type="checkbox" checked={n.isActive} onChange={(e) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, isActive: e.target.checked } : x)) })} />
                Publicada
              </label>
            </div>
          </ItemCard>
        ))}
        <AddBtn
          label="Añadir noticia"
          onClick={() =>
            patch({
              news: [
                ...site.news,
                {
                  id: nextId('n'),
                  title: 'Nueva noticia',
                  content: '',
                  excerpt: '',
                  publishedAt: new Date().toISOString().slice(0, 10),
                  isActive: true,
                },
              ],
            })
          }
        />
      </>
    );
  }

  if (section === 'contact') {
    return (
      <>
        {head}
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <Field label="Email" value={site.contact.email} onChange={(v) => patch({ contact: { ...site.contact, email: v } })} />
            <Field label="Teléfono" value={site.contact.phone} onChange={(v) => patch({ contact: { ...site.contact, phone: v } })} />
            <Field label="Dirección" value={site.contact.address} onChange={(v) => patch({ contact: { ...site.contact, address: v } })} />
            <Field label="Ciudad" value={site.contact.city} onChange={(v) => patch({ contact: { ...site.contact, city: v } })} />
          </div>
          <AreaField
            label="Copyright"
            value={site.footer.copyright}
            onChange={(v) => patch({ footer: { copyright: v } })}
          />
        </div>
      </>
    );
  }

  return null;
}

const TITLES: Record<string, string> = {
  hero: 'Hero',
  services: 'Servicios',
  schedule: 'Horario de clases',
  pricing: 'Planes y precios',
  trainers: 'Entrenadores',
  news: 'Noticias',
  contact: 'Contacto',
};
