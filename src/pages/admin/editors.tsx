import { useState } from 'react';
import { useApp } from '../../core/store';
import type { SiteContent } from '../../core/types';
import { DAY_NAMES } from '../../core/types';
import type { ServiceItem } from '../../core/types';
import { searchUnsplash, unsplashSearchUrl, picsumRandomUrl } from '../../core/unsplash';
import type { UnsplashPhoto } from '../../core/unsplash';

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
    <button type="button" className="btn btn--ghost btn--sm" onClick={onClick} style={{ borderStyle: 'dashed', background: 'white' }}>
      + {label}
    </button>
  );
}

function serviceFallbackUrl(s: ServiceItem): string {
  if (s.imageUrl) return s.imageUrl;
  const seed = s.id || s.name.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
}

export function Editors({ section }: { section: string }) {
  const { state, updateSite, resetContent } = useApp();
  const site = state.site;

  const patch = (partial: Partial<SiteContent>) =>
    updateSite({ ...site, ...partial, lastUpdated: new Date().toISOString() });

  const nextId = (prefix: string) =>
    `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 100)}`;

  const [unsplashById, setUnsplashById] = useState<
    Record<string, { loading: boolean; photos: UnsplashPhoto[]; error: string | null; help: string | null }>
  >({});

  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const head = (
    <div className="admin-head">
      <div>
        <h1>{TITLES[section] ?? section}</h1>
        <p style={{ margin: 0 }}>{SUBTITLES[section] ?? 'Edita el contenido con guardado automático.'}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <span className="badge" style={{ background: 'white' }}>guardado automático</span>
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
        <div className="admin-card" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(233,69,96,0.16)' }}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4 4 4 6-10 2 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Poppins' }}>Hero principal</div>
              <div style={{ fontSize: '0.84rem', color: '#6b7280' }}>Título, subtítulo y llamada a la acción de la portada.</div>
            </div>
          </div>
          <Field label="Título" value={site.hero.title} onChange={(v) => patch({ hero: { ...site.hero, title: v } })} />
          <AreaField label="Subtítulo" value={site.hero.subtitle} onChange={(v) => patch({ hero: { ...site.hero, subtitle: v } })} />
          <Field label="Texto del CTA" value={site.hero.ctaText} onChange={(v) => patch({ hero: { ...site.hero, ctaText: v } })} />
          <Field label="URL imagen hero (se ve con ken-burns en portada)" value={site.hero.imageUrl} onChange={(v) => patch({ hero: { ...site.hero, imageUrl: v } })} />
          <div style={{ marginTop: '0.75rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <img src={site.hero.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'} alt="preview hero" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          </div>
        </div>
      </>
    );
  }

  if (section === 'services') {
    const handleBuscarUnsplash = async (s: ServiceItem) => {
      const key = (import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined)?.trim();
      if (!key) {
        window.open(unsplashSearchUrl(s.name), '_blank', 'noopener,noreferrer');
        setUnsplashById((prev) => ({
          ...prev,
          [s.id]: { loading: false, photos: [], error: null, help: 'Se abrió Unsplash — copia la URL de la imagen y pégala abajo.' },
        }));
        return;
      }
      setUnsplashById((prev) => ({ ...prev, [s.id]: { loading: true, photos: [], error: null, help: null } }));
      try {
        const photos = await searchUnsplash(s.name, 6);
        setUnsplashById((prev) => ({
          ...prev,
          [s.id]: {
            loading: false,
            photos,
            error: photos.length === 0 ? 'Sin resultados para esa búsqueda.' : null,
            help: null,
          },
        }));
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error al buscar en Unsplash';
        if (msg === 'No key') {
          window.open(unsplashSearchUrl(s.name), '_blank', 'noopener,noreferrer');
          setUnsplashById((prev) => ({
            ...prev,
            [s.id]: { loading: false, photos: [], error: null, help: 'Se abrió Unsplash — copia la URL de la imagen y pégala abajo.' },
          }));
        } else {
          setUnsplashById((prev) => ({
            ...prev,
            [s.id]: { loading: false, photos: [], error: msg, help: null },
          }));
        }
      }
    };

    const handlePicsumRandom = (s: ServiceItem) => {
      const url = picsumRandomUrl(s.name || s.id);
      patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: url, imageAttribution: undefined } : x)) });
      setUnsplashById((prev) => ({ ...prev, [s.id]: { loading: false, photos: [], error: null, help: null } }));
    };

    const handleSelectPhoto = (s: ServiceItem, photo: UnsplashPhoto) => {
      patch({
        services: site.services.map((x) =>
          x.id === s.id
            ? { ...x, imageUrl: photo.regular, imageAttribution: `Foto de ${photo.photographer} en Unsplash` }
            : x,
        ),
      });
    };

    const handleFileUpload = (s: ServiceItem, file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: result } : x)) });
      };
      reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent, s: ServiceItem) => {
      e.preventDefault();
      setDragOverId(null);
      const file = e.dataTransfer.files?.[0] ?? null;
      if (file && file.type.startsWith('image/')) handleFileUpload(s, file);
    };

    return (
      <>
        {head}
        {site.services.map((s) => {
          const previewUrl = serviceFallbackUrl(s);
          const ub = unsplashById[s.id] ?? { loading: false, photos: [], error: null, help: null };
          const isDragOver = dragOverId === s.id;
          return (
            <ItemCard
              key={s.id}
              title={s.name}
              onRemove={() => patch({ services: site.services.filter((x) => x.id !== s.id) })}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0 1rem' }}>
                <Field label="Nombre" value={s.name} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, name: v } : x)) })} />
                <AreaField label="Descripción" value={s.description} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, description: v } : x)) })} />
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151' }}>Imagen</span>
                  <span className="badge" style={{ fontSize: '0.68rem' }}>16:9 · zoom on hover en portada</span>
                </div>

                <div
                  className={`upload-zone ${isDragOver ? 'upload-zone--over' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverId(s.id);
                  }}
                  onDragLeave={() => setDragOverId(null)}
                  onDrop={(e) => handleDrop(e, s)}
                  style={{ marginBottom: '0.85rem' }}
                >
                  <div className="preview-wrap" style={{ display: 'block' }}>
                    <img
                      src={previewUrl}
                      alt={s.name}
                      className="preview-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(s.id)}/800/600`;
                      }}
                    />
                    {s.imageUrl && (
                      <button
                        type="button"
                        className="preview-remove"
                        aria-label="Quitar imagen"
                        onClick={() => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: undefined, imageAttribution: undefined } : x)) })}
                        title="Quitar imagen"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '0.7rem', fontSize: '0.82rem', color: '#6b7280' }}>
                    Arrastra una imagen aquí o usa los controles inferiores.
                  </div>
                  {s.imageAttribution && (
                    <p style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '0.4rem' }}>{s.imageAttribution}</p>
                  )}
                  {!s.imageUrl && (
                    <p style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.3rem' }}>Sin imagen personalizada — usando Picsum fallback en portada.</p>
                  )}
                </div>

                <Field
                  label="URL de la imagen"
                  value={s.imageUrl ?? ''}
                  onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: v || undefined } : x)) })}
                />

                <div className="field">
                  <label>Subir imagen</label>
                  <input
                    className="input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      handleFileUpload(s, file);
                      e.target.value = '';
                    }}
                  />
                  <p style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.35rem' }}>Se guarda como data URL (demo local). Máx ~5 MB recomendado.</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleBuscarUnsplash(s)} disabled={ub.loading} style={{ borderRadius: '999px' }}>
                    {ub.loading ? 'Buscando…' : 'Buscar en Unsplash'}
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => handlePicsumRandom(s)} style={{ borderRadius: '999px' }}>
                    Usar Picsum aleatorio
                  </button>
                  {s.imageUrl && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: undefined, imageAttribution: undefined } : x)) })}
                    >
                      Quitar imagen
                    </button>
                  )}
                </div>

                {ub.help && (
                  <div className="success-note" style={{ marginTop: '0.7rem' }}>
                    {ub.help}
                  </div>
                )}
                {ub.error && <p className="field-error" style={{ marginTop: '0.7rem' }}>{ub.error}</p>}

                {ub.photos.length > 0 && (
                  <div style={{ marginTop: '0.9rem', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.85rem', padding: '0.75rem' }}>
                    <p style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600, marginBottom: '0.55rem' }}>Elige una imagen:</p>
                    <div className="unsplash-grid">
                      {ub.photos.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectPhoto(s, p)}
                          title={`${p.alt} — ${p.photographer}`}
                          className="unsplash-thumb"
                        >
                          <img src={p.thumb} alt={p.alt} loading="lazy" />
                          <span>{p.photographer}</span>
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      Imágenes de Unsplash — se guardará la URL regular + atribución.
                    </p>
                  </div>
                )}
              </div>
            </ItemCard>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
          <AddBtn
            label="Añadir servicio"
            onClick={() => {
              const id = nextId('s');
              patch({
                services: [
                  ...site.services,
                  {
                    id,
                    name: 'Nuevo servicio',
                    description: '',
                    icon: 'other',
                    order: site.services.length + 1,
                    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(id)}/800/600`,
                  },
                ],
              });
            }}
          />
        </div>
      </>
    );
  }

  if (section === 'schedule') {
    const byDay = [...site.schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time));
    return (
      <>
        {head}
        <div style={{ marginBottom: '0.8rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge--accent">{byDay.length} clases totales</span>
          <span className="badge">{[...new Set(byDay.map((s) => s.dayOfWeek))].length} días con clases</span>
        </div>
        {byDay.map((s) => (
          <ItemCard
            key={s.id}
            title={`${DAY_NAMES[s.dayOfWeek - 1]} · ${s.time} · ${s.className}`}
            onRemove={() => patch({ schedule: site.schedule.filter((x) => x.id !== s.id) })}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9.5rem, 1fr))', gap: '0 1rem' }}>
              <Field
                label="Día (1-7)"
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
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
        </div>
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
            <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.88rem', background: p.isPopular ? 'rgba(233,69,96,0.06)' : '#f9fafb', border: p.isPopular ? '1px solid rgba(233,69,96,0.14)' : '1px solid #f3f4f6', padding: '0.65rem 0.8rem', borderRadius: '0.7rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={p.isPopular}
                onChange={(e) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, isPopular: e.target.checked } : x)) })}
                style={{ accentColor: 'var(--accent)' }}
              />
              <span style={{ fontWeight: 600, color: p.isPopular ? 'var(--accent)' : '#374151' }}>{p.isPopular ? '★ Plan destacado (pulse en portada)' : 'Marcar como plan destacado'}</span>
            </label>
          </ItemCard>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
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
        </div>
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
            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.7rem', color: '#6b7280', fontSize: '0.84rem' }}>
              <span style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '1px solid rgba(233,69,96,0.16)' }}>{t.initials}</span>
              Vista previa avatar
            </div>
          </ItemCard>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
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
        </div>
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
              <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.88rem', paddingTop: '1.2rem', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '0.7rem', padding: '0.65rem 0.8rem', marginTop: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={n.isActive} onChange={(e) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, isActive: e.target.checked } : x)) })} style={{ accentColor: 'var(--accent)' }} />
                <span style={{ fontWeight: 600 }}>{n.isActive ? 'Publicada · visible en portada' : 'Borrador · no visible'}</span>
              </label>
            </div>
          </ItemCard>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
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
        </div>
      </>
    );
  }

  if (section === 'contact') {
    return (
      <>
        {head}
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(233,69,96,0.16)' }}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Poppins' }}>Información de contacto</div>
              <div style={{ fontSize: '0.84rem', color: '#6b7280' }}>Se muestra en la sección Contacto y footer.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <Field label="Email" value={site.contact.email} onChange={(v) => patch({ contact: { ...site.contact, email: v } })} />
            <Field label="Teléfono" value={site.contact.phone} onChange={(v) => patch({ contact: { ...site.contact, phone: v } })} />
            <Field label="Dirección" value={site.contact.address} onChange={(v) => patch({ contact: { ...site.contact, address: v } })} />
            <Field label="Ciudad" value={site.contact.city} onChange={(v) => patch({ contact: { ...site.contact, city: v } })} />
          </div>
          <AreaField
            label="Copyright (footer)"
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

const SUBTITLES: Record<string, string> = {
  hero: 'Portada con efecto ken-burns y stagger elegante.',
  services: 'Gestiona imágenes 16:9, subida local y Unsplash premium.',
  schedule: 'Clases, aforo y horarios con vista de calendario.',
  pricing: 'Planes destacados con glow sutil en portada.',
  trainers: 'Equipo humano · avatares y especialidades.',
  news: 'Novedades visibles en el home cuando están activas.',
  contact: 'Datos de contacto y footer.',
};
