import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../core/store';
import type { SiteContent } from '../../core/types';
import { DAY_NAMES } from '../../core/types';
import type { ServiceItem } from '../../core/types';
import { searchUnsplash, unsplashSearchUrl, picsumRandomUrl } from '../../core/unsplash';
import type { UnsplashPhoto } from '../../core/unsplash';

/* ── atoms ── */
function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function AreaField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  showCount,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
}) {
  return (
    <div className="field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ marginBottom: showCount ? 0 : '0.45rem' }}>{label}</label>
        {showCount && maxLength && (
          <span style={{ fontSize: '0.7rem', color: value.length > maxLength ? 'var(--accent)' : '#9ca3af', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <textarea className="textarea" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} />
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch-track" aria-hidden="true"><span className="switch-thumb" /></span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
}

function AddBtn({ label, onClick, accent, icon }: { label: string; onClick: () => void; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={accent ? 'btn btn-primary btn--sm' : 'btn btn--ghost btn--sm'}
      onClick={onClick}
      style={accent ? { borderRadius: '999px', padding: '0.62rem 1.25rem', fontWeight: 700, boxShadow: '0 8px 18px rgba(233,69,96,0.22)' } : { borderStyle: 'dashed', background: 'white', borderRadius: '999px' }}
    >
      {icon && <span style={{ display: 'inline-flex', marginRight: 6 }}>{icon}</span>}+ {label}
    </button>
  );
}

function StickyBar({ onReset }: { onReset: () => void }) {
  return (
    <div className="editor-sticky-bar">
      <div className="editor-sticky-bar__left">
        <span className="badge badge--success" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#16a34a', display: 'inline-block', boxShadow: '0 0 0 4px rgba(22,163,74,0.14)' }} /> Guardado automático
        </span>
        <span className="editor-sticky-bar__hint">Los cambios se guardan al instante</span>
      </div>
      <div className="editor-sticky-bar__right">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onReset}>Descartar</button>
        <button type="button" className="btn btn-primary btn--sm" style={{ borderRadius: '999px', padding: '0.58rem 1.2rem', fontWeight: 700 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Guardar ✓</button>
      </div>
    </div>
  );
}

function EmptyState({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="admin-card empty-state" style={{ borderStyle: 'dashed', background: 'linear-gradient(180deg, #fff, #fcfcfd)', borderColor: '#e5e7eb' }}>
      <div className="empty-emoji" style={{ fontSize: '2.2rem', width: 54, height: 54, borderRadius: 999, background: 'white', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', boxShadow: '0 6px 16px rgba(15,15,26,0.06)' }}>{emoji}</div>
      <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary)', margin: '0.4rem 0 0.2rem', letterSpacing: '-0.02em' }}>{title}</h3>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}

function serviceFallbackUrl(s: ServiceItem): string {
  if (s.imageUrl) return s.imageUrl;
  const seed = s.id || s.name.toLowerCase().replace(/\s+/g, '-');
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
}

/* ── main ── */
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
  const [activeDay, setActiveDay] = useState<number | 'all'>('all');
  const [trainerImages, setTrainerImages] = useState<Record<string, string>>({});
  const [pricingNewFeature, setPricingNewFeature] = useState<Record<string, string>>({});

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

  const containerVariants: any = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };
  const itemVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  if (section === 'hero') {
    return (
      <>
        {head}
        <motion.div className="admin-card" style={{ padding: '1.4rem' }} initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(233,69,96,0.16)' }}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4 4 4 6-10 2 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Poppins' }}>Hero principal</div>
              <div style={{ fontSize: '0.84rem', color: '#6b7280' }}>Título, subtítulo y llamada a la acción de la portada.</div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}><Field label="Título" value={site.hero.title} onChange={(v) => patch({ hero: { ...site.hero, title: v } })} /></motion.div>
          <motion.div variants={itemVariants}><AreaField label="Subtítulo" value={site.hero.subtitle} onChange={(v) => patch({ hero: { ...site.hero, subtitle: v } })} /></motion.div>
          <motion.div variants={itemVariants}><Field label="Texto del CTA" value={site.hero.ctaText} onChange={(v) => patch({ hero: { ...site.hero, ctaText: v } })} /></motion.div>
          <motion.div variants={itemVariants}><Field label="URL imagen hero (se ve con ken-burns en portada)" value={site.hero.imageUrl} onChange={(v) => patch({ hero: { ...site.hero, imageUrl: v } })} /></motion.div>
          <motion.div variants={itemVariants} style={{ marginTop: '0.75rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f9fafb', boxShadow: '0 8px 20px rgba(15,15,26,0.06)' }}>
            <img src={site.hero.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'} alt="preview hero" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          </motion.div>
          <motion.div variants={itemVariants}><StickyBar onReset={resetContent} /></motion.div>
        </motion.div>
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
        const photos = await searchUnsplash(s.name, 8);
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

    if (site.services.length === 0) {
      return (
        <>
          {head}
          <EmptyState emoji="🧩" title="Sin servicios" desc="Añade tu primer servicio para mostrarlo en la home con imagen 16:9." />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <AddBtn
              label="Añadir servicio"
              accent
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

    return (
      <>
        {head}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="services-editor-list"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
        >
          <AnimatePresence>
            {site.services
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((s) => {
                const previewUrl = serviceFallbackUrl(s);
                const ub = unsplashById[s.id] ?? { loading: false, photos: [], error: null, help: null };
                const isDragOver = dragOverId === s.id;
                const isSelected = (photoRegular: string) => s.imageUrl === photoRegular;
                return (
                  <motion.div
                    key={s.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ layout: { type: 'spring', stiffness: 340, damping: 30 } }}
                    className="editor-item editor-item--service"
                    style={{ padding: 0, overflow: 'hidden' }}
                    whileHover={{ y: -1 }}
                  >
                    <div className="editor-item-head" style={{ margin: 0, padding: '0.9rem 1rem', background: 'linear-gradient(180deg, #fcfcfd, #fff)', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: 28, height: 28, borderRadius: 999, background: 'white', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(15,15,26,0.06)' }}>✦</span>
                        <span className="editor-item-title">{s.name || 'Servicio sin nombre'}</span>
                        <span className="badge" style={{ fontSize: '0.66rem' }}>#{s.order}</span>
                      </div>
                      <div className="editor-actions">
                        <span className="badge" style={{ background: s.imageUrl ? 'rgba(233,69,96,0.08)' : 'white', color: s.imageUrl ? 'var(--accent)' : '#6b7280', borderColor: s.imageUrl ? 'rgba(233,69,96,0.16)' : '#e5e7eb', fontSize: '0.66rem' }}>{s.imageUrl ? 'Con imagen' : 'Fallback'}</span>
                        <button type="button" className="icon-btn icon-btn--danger" onClick={() => patch({ services: site.services.filter((x) => x.id !== s.id) })}>
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="service-editor-grid">
                      {/* left: preview */}
                      <div className="service-editor-preview-col">
                        <div
                          className={`upload-zone ${isDragOver ? 'upload-zone--over' : ''}`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverId(s.id);
                          }}
                          onDragLeave={() => setDragOverId(null)}
                          onDrop={(e) => handleDrop(e, s)}
                        >
                          <div className="preview-wrap">
                            <img
                              src={previewUrl}
                              alt={s.name}
                              className="preview-img"
                              style={{ borderRadius: '12px', height: '188px' }}
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
                            <div className="preview-badge">16:9</div>
                            {isDragOver && <div className="preview-drag-hint">Suelta para subir ✨</div>}
                          </div>
                          <div className="upload-zone__hint">
                            <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <strong>Arrastra una imagen</strong> o usa los botones
                          </div>
                          {s.imageAttribution && (
                            <p className="preview-attribution">{s.imageAttribution}</p>
                          )}
                          {!s.imageUrl && (
                            <p className="preview-fallback">Picsum fallback activo en portada</p>
                          )}
                        </div>

                        <div className="field" style={{ marginBottom: 0, marginTop: '0.7rem' }}>
                          <label>Subir imagen</label>
                          <label className="file-input-fake">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                handleFileUpload(s, file);
                                e.target.value = '';
                              }}
                            />
                            <span>Seleccionar archivo…</span>
                            <span className="file-input-btn">Examinar</span>
                          </label>
                          <p className="helper-text">Se guarda como data URL (demo local). Máx ~5 MB. Arrastra y suelta también funciona.</p>
                        </div>
                      </div>

                      {/* right: fields */}
                      <div className="service-editor-fields-col">
                        <Field label="Nombre" value={s.name} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, name: v } : x)) })} placeholder="Ej. Spinning" />
                        <AreaField label="Descripción" value={s.description} onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, description: v } : x)) })} placeholder="Describe el servicio…" />
                        <Field
                          label="URL de la imagen"
                          value={s.imageUrl ?? ''}
                          onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, imageUrl: v || undefined } : x)) })}
                          placeholder="https://…"
                        />
                        <Field
                          label="Orden"
                          type="number"
                          value={s.order}
                          onChange={(v) => patch({ services: site.services.map((x) => (x.id === s.id ? { ...x, order: Number(v) || 0 } : x)) })}
                        />

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.7rem' }}>
                          <button type="button" className="btn btn--ghost btn--sm" onClick={() => handleBuscarUnsplash(s)} disabled={ub.loading} style={{ borderRadius: '999px', borderColor: ub.loading ? '#e5e7eb' : 'var(--accent)', color: ub.loading ? '#9ca3af' : 'var(--accent)', background: ub.loading ? 'white' : 'rgba(233,69,96,0.06)', fontWeight: 600 }}>
                            {ub.loading ? 'Buscando…' : '⌕ Buscar en Unsplash'}
                          </button>
                          <button type="button" className="btn btn--ghost btn--sm" onClick={() => handlePicsumRandom(s)} style={{ borderRadius: '999px', fontWeight: 600 }}>
                            ↻ Picsum aleatorio
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
                          <div className="unsplash-panel">
                            <p className="unsplash-panel__title">Elige una imagen — 4 por fila</p>
                            <div className="unsplash-grid unsplash-grid--4">
                              {ub.photos.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleSelectPhoto(s, p)}
                                  title={`${p.alt} — ${p.photographer}`}
                                  className={`unsplash-thumb ${isSelected(p.regular) ? 'unsplash-thumb--selected' : ''}`}
                                >
                                  <img src={p.thumb} alt={p.alt} loading="lazy" />
                                  <span>{p.photographer}</span>
                                  {isSelected(p.regular) && <span className="unsplash-thumb__check">✓</span>}
                                </button>
                              ))}
                            </div>
                            <p className="helper-text">Se guardará la URL regular + atribución. Click para seleccionar.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.9rem' }}>
          <AddBtn
            label="Añadir servicio"
            accent
            icon={<svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
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
        <StickyBar onReset={resetContent} />
      </>
    );
  }

  if (section === 'schedule') {
    const grouped = useMemo(() => {
      const g: Record<number, typeof site.schedule> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
      site.schedule.forEach((s) => {
        g[s.dayOfWeek] = [...(g[s.dayOfWeek] ?? []), s];
      });
      Object.values(g).forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
      return g;
    }, [site.schedule]);

    const filteredSchedule = activeDay === 'all' ? site.schedule : grouped[activeDay as number] ?? [];
    const sortedFiltered = [...filteredSchedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time));

    return (
      <>
        {head}

        <div className="schedule-editor-toolbar">
          <div className="day-tabs schedule-editor-tabs" role="tablist">
            <button type="button" className={`day-tab ${activeDay === 'all' ? 'day-tab--on' : ''}`} onClick={() => setActiveDay('all')}>
              Todos <span className="badge" style={{ marginLeft: 6, fontSize: '0.65rem', padding: '0.1rem 0.4rem', background: activeDay === 'all' ? 'white' : '#f9fafb', color: activeDay === 'all' ? 'var(--accent)' : '#6b7280', borderColor: activeDay === 'all' ? 'white' : '#e5e7eb' }}>{site.schedule.length}</span>
            </button>
            {DAY_NAMES.map((name, idx) => {
              const dayNum = idx + 1;
              const count = grouped[dayNum]?.length ?? 0;
              return (
                <button
                  key={dayNum}
                  type="button"
                  role="tab"
                  aria-selected={activeDay === dayNum}
                  className={`day-tab ${activeDay === dayNum ? 'day-tab--on' : ''}`}
                  onClick={() => setActiveDay(dayNum)}
                >
                  {name} <span style={{ opacity: count ? 1 : 0.45, marginLeft: 4, fontWeight: 700 }}>· {count}</span>
                </button>
              );
            })}
          </div>
          <AddBtn
            label="Añadir clase"
            accent
            icon={<svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
            onClick={() =>
              patch({
                schedule: [
                  ...site.schedule,
                  { id: nextId('sch'), dayOfWeek: activeDay === 'all' ? 1 : (activeDay as number), className: 'Nueva clase', time: '10:00', instructor: '', duration: 45, capacity: 12 },
                ],
              })
            }
          />
        </div>

        {sortedFiltered.length === 0 ? (
          <EmptyState emoji="🗓️" title="Sin clases este día" desc={activeDay === 'all' ? 'Añade tu primera clase para llenar el horario.' : `No hay clases el ${DAY_NAMES[(activeDay as number) - 1]}. Pulsa Añadir clase.`} />
        ) : (
          <motion.div className="schedule-editor-grid" initial="hidden" animate="visible" variants={containerVariants}>
            {sortedFiltered.map((s) => {
              const instructorInitials = s.instructor
                ? s.instructor
                    .split(' ')
                    .map((w) => w[0] ?? '')
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : '—';
              const dayBadge = DAY_NAMES[s.dayOfWeek - 1];
              return (
                <motion.div key={s.id} variants={itemVariants} layout className="schedule-card" whileHover={{ y: -2 }}>
                  <div className="schedule-card__top">
                    <span className="time-pill">
                      <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {s.time}
                    </span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: '#f3f4f6' }}>{dayBadge}</span>
                    <span className="badge" style={{ fontSize: '0.65rem', background: s.capacity <= 6 ? '#fef2f2' : s.capacity <= 10 ? '#fffbeb' : '#f0fdf4', color: s.capacity <= 6 ? '#dc2626' : s.capacity <= 10 ? '#b45309' : '#15803d', borderColor: s.capacity <= 6 ? '#fecaca' : s.capacity <= 10 ? '#fde68a' : '#bbf7d0' }}>
                      {s.capacity} plazas
                    </span>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>{s.duration}′</span>
                    <button type="button" className="icon-btn icon-btn--danger" style={{ marginLeft: 'auto', padding: '0.28rem 0.6rem' }} onClick={() => patch({ schedule: site.schedule.filter((x) => x.id !== s.id) })}>
                      Eliminar
                    </button>
                  </div>

                  <div className="schedule-card__main">
                    <div className="schedule-card__avatar" aria-hidden="true">{instructorInitials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="schedule-card__class">{s.className || 'Clase sin nombre'}</div>
                      <div className="schedule-card__instructor">{s.instructor || 'Sin instructor'} · {s.duration} min · aforo {s.capacity}</div>
                    </div>
                  </div>

                  <div className="schedule-card__fields">
                    <Field
                      label="Día (1-7)"
                      type="number"
                      value={s.dayOfWeek}
                      onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, dayOfWeek: Math.min(Math.max(Number(v) || 1, 1), 7) } : x)) })}
                    />
                    <Field label="Hora" value={s.time} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, time: v } : x)) })} placeholder="09:00" />
                    <Field label="Clase" value={s.className} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, className: v } : x)) })} />
                    <Field label="Instructor" value={s.instructor} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, instructor: v } : x)) })} />
                    <Field label="Duración" type="number" value={s.duration} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, duration: Number(v) || 0 } : x)) })} />
                    <Field label="Aforo" type="number" value={s.capacity} onChange={(v) => patch({ schedule: site.schedule.map((x) => (x.id === s.id ? { ...x, capacity: Math.max(Number(v) || 1, 1) } : x)) })} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        <StickyBar onReset={resetContent} />
      </>
    );
  }

  if (section === 'pricing') {
    const sorted = [...site.pricing].sort((a, b) => a.order - b.order);
    return (
      <>
        {head}
        {sorted.length === 0 && <EmptyState emoji="💳" title="Sin planes" desc="Crea tu primer plan para mostrar la grilla de precios idéntica a la portada." />}
        <motion.div className="pricing-editor-grid" initial="hidden" animate="visible" variants={containerVariants}>
          {sorted.map((p) => (
            <motion.div key={p.id} variants={itemVariants} layout className={`price-card price-card--admin ${p.isPopular ? 'price-card--popular' : ''}`} whileHover={{ y: -4 }}>
              {p.isPopular && <div className="popular-tag">Popular</div>}
              <div className="editor-item-head" style={{ borderBottom: '1px solid #f3f4f6', marginBottom: '0.8rem', paddingBottom: '0.6rem' }}>
                <span className="editor-item-title" style={{ fontSize: '0.95rem' }}>{p.name || 'Nombre plan'}</span>
                <button type="button" className="icon-btn icon-btn--danger" onClick={() => patch({ pricing: site.pricing.filter((x) => x.id !== p.id) })}>
                  Eliminar
                </button>
              </div>

              {/* WYSIWYG preview matching home */}
              <div className="price-preview">
                <div className="price-name" style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{p.name || 'Nombre plan'}</div>
                <div className="price-amount" style={{ fontSize: '1.9rem', marginBottom: '0.6rem' }}>
                  {p.price}€ <small>/mes</small>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <span className="badge" style={{ fontSize: '0.66rem', background: p.isPopular ? 'rgba(233,69,96,0.09)' : 'white', color: p.isPopular ? 'var(--accent)' : '#9ca3af', borderColor: p.isPopular ? 'rgba(233,69,96,0.16)' : '#e5e7eb' }}>{p.isPopular ? 'Destacado en home' : 'Estándar'}</span>
                  <span className="badge" style={{ fontSize: '0.66rem' }}>Orden {p.order}</span>
                </div>
              </div>

              <Field label="Nombre del plan" value={p.name} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, name: v } : x)) })} placeholder="Completo" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 0.8rem' }}>
                <Field label="Precio €/mes" type="number" value={p.price} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, price: Number(v) || 0 } : x)) })} />
                <Field label="Orden" type="number" value={p.order} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, order: Number(v) || 0 } : x)) })} />
              </div>

              <div className="field">
                <label>Características (chips)</label>
                <div className="chip-list">
                  {p.features.map((f, idx) => (
                    <span key={`${f}-${idx}`} className="chip">
                      {f}
                      <button
                        type="button"
                        aria-label={`Eliminar ${f}`}
                        onClick={() => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, features: x.features.filter((_, i) => i !== idx) } : x)) })}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {p.features.length === 0 && <span className="helper-text">Sin características aún. Añade la primera.</span>}
                </div>
                <div className="chip-input-row">
                  <input
                    className="input"
                    placeholder="Añadir característica y pulsar Enter"
                    value={pricingNewFeature[p.id] ?? ''}
                    onChange={(e) => setPricingNewFeature((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (pricingNewFeature[p.id] ?? '').trim();
                        if (!val) return;
                        patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, features: [...x.features, val] } : x)) });
                        setPricingNewFeature((prev) => ({ ...prev, [p.id]: '' }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      const val = (pricingNewFeature[p.id] ?? '').trim();
                      if (!val) return;
                      patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, features: [...x.features, val] } : x)) });
                      setPricingNewFeature((prev) => ({ ...prev, [p.id]: '' }));
                    }}
                  >
                    Añadir
                  </button>
                </div>
                <p className="helper-text">Pulsa Enter para añadir. Cada chip se ve con ✓ en la portada.</p>
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: p.isPopular ? 'rgba(233,69,96,0.07)' : '#f9fafb', border: p.isPopular ? '1px solid rgba(233,69,96,0.18)' : '1px solid #f3f4f6', padding: '0.7rem 0.85rem', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: p.isPopular ? 'var(--accent)' : '#374151' }}>{p.isPopular ? '★ Plan destacado' : 'Plan normal'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{p.isPopular ? 'Con glow y escala en portada' : 'Actívalo para destacarlo'}</div>
                  </div>
                  <Switch checked={p.isPopular} onChange={(v) => patch({ pricing: site.pricing.map((x) => (x.id === p.id ? { ...x, isPopular: v } : x)) })} />
                </div>
              </div>

              <ul className="price-features" style={{ marginTop: '0.9rem', opacity: 0.96 }}>
                {p.features.map((f) => (
                  <li key={f}>
                    <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
                {p.features.length === 0 && <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin características</li>}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <AddBtn
            label="Añadir plan"
            accent
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
        <StickyBar onReset={resetContent} />
      </>
    );
  }

  if (section === 'trainers') {
    return (
      <>
        {head}
        {site.trainers.length === 0 && <EmptyState emoji="🏋️" title="Sin entrenadores" desc="Añade tu equipo para la grilla de 3 columnas de la portada." />}
        <motion.div className="trainers-editor-grid" initial="hidden" animate="visible" variants={containerVariants}>
          {site.trainers.map((t) => {
            const img = trainerImages[t.id];
            const handleFile = (file: File | null) => {
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setTrainerImages((prev) => ({ ...prev, [t.id]: reader.result as string }));
              reader.readAsDataURL(file);
            };
            const handleDropTrainer = (e: React.DragEvent) => {
              e.preventDefault();
              setDragOverId(null);
              const file = e.dataTransfer.files?.[0] ?? null;
              if (file && file.type.startsWith('image/')) handleFile(file);
            };
            const isDragOver = dragOverId === t.id;
            return (
              <motion.div key={t.id} variants={itemVariants} layout className="trainer-card trainer-card--admin" whileHover={{ y: -3 }}>
                <div className="editor-item-head" style={{ marginBottom: '0.7rem' }}>
                  <span className="editor-item-title">{t.name || 'Nuevo entrenador'}</span>
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => patch({ trainers: site.trainers.filter((x) => x.id !== t.id) })}>
                    Eliminar
                  </button>
                </div>

                <div className="trainer-admin-preview">
                  <div className="trainer-avatar trainer-avatar--lg">
                    {img ? <img src={img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '999px' }} /> : t.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="trainer-name">{t.name || 'Nombre'}</div>
                    <span className="badge badge--accent" style={{ marginTop: '0.25rem', fontSize: '0.68rem', letterSpacing: '0.06em' }}>{t.specialty || 'Especialidad'}</span>
                    <div style={{ fontSize: '0.74rem', color: '#9ca3af', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.initials} · preview idéntico al home</div>
                  </div>
                </div>

                <Field label="Nombre" value={t.name} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, name: v, initials: v.split(' ').map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase() } : x)) })} placeholder="María López" />
                <Field label="Especialidad" value={t.specialty} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, specialty: v } : x)) })} placeholder="Spinning · Cardio" />
                <Field label="Iniciales" value={t.initials} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, initials: v.slice(0, 2).toUpperCase() } : x)) })} />
                <AreaField label="Bio" value={t.bio} onChange={(v) => patch({ trainers: site.trainers.map((x) => (x.id === t.id ? { ...x, bio: v } : x)) })} placeholder="Breve biografía…" />

                <div className="field">
                  <label>Avatar imagen</label>
                  <div
                    className={`upload-zone upload-zone--compact ${isDragOver ? 'upload-zone--over' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOverId(t.id); }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={handleDropTrainer}
                  >
                    <div className="preview-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', justifyContent: 'center', padding: '0.2rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 999, overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '0.82rem', flexShrink: 0 }}>
                        {img ? <img src={img} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : t.initials}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>{img ? 'Imagen cargada' : 'Arrastra imagen aquí'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>o selecciona archivo abajo</div>
                      </div>
                    </div>
                    {isDragOver && <div style={{ marginTop: '0.4rem', fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>Suelta para subir ✨</div>}
                  </div>
                  <label className="file-input-fake" style={{ marginTop: '0.55rem' }}>
                    <input type="file" accept="image/*" onChange={(e) => { handleFile(e.target.files?.[0] ?? null); e.target.value = ''; }} />
                    <span>{img ? 'Cambiar imagen…' : 'Subir imagen…'}</span>
                    <span className="file-input-btn">Examinar</span>
                  </label>
                  {img && (
                    <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: '0.5rem', borderRadius: '999px' }} onClick={() => setTrainerImages((prev) => { const n = { ...prev }; delete n[t.id]; return n; })}>
                      Quitar imagen
                    </button>
                  )}
                  <p className="helper-text">Preview local — no se persiste en tipo (demo). Reusa el mismo upload-zone premium que Servicios.</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <AddBtn
            label="Añadir entrenador"
            accent
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
        <StickyBar onReset={resetContent} />
      </>
    );
  }

  if (section === 'news') {
    return (
      <>
        {head}
        {site.news.length === 0 && <EmptyState emoji="📰" title="Sin novedades" desc="Crea tu primera novedad para la grilla idéntica a la home." />}
        <motion.div className="news-editor-grid" initial="hidden" animate="visible" variants={containerVariants}>
          {site.news.map((n) => (
            <motion.div key={n.id} variants={itemVariants} layout className={`card news-card news-card--admin ${n.isActive ? 'news-card--active' : 'news-card--draft'}`} whileHover={{ y: -2 }}>
              <div className="editor-item-head" style={{ marginBottom: '0.6rem', paddingBottom: '0.6rem' }}>
                <span className={n.isActive ? 'badge badge--accent' : 'badge'} style={{ fontSize: '0.68rem', background: n.isActive ? 'rgba(233,69,96,0.08)' : 'white' }}>{n.isActive ? '● Publicada' : '○ Borrador'}</span>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <Switch checked={n.isActive} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, isActive: v } : x)) })} />
                  <button type="button" className="icon-btn icon-btn--danger" onClick={() => patch({ news: site.news.filter((x) => x.id !== n.id) })}>
                    Eliminar
                  </button>
                </div>
              </div>

              <Field label="Titular" value={n.title} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, title: v } : x)) })} placeholder="Título de la novedad" />
              <Field label="Entradilla" value={n.excerpt} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, excerpt: v } : x)) })} placeholder="Resumen corto…" />
              <AreaField
                label="Contenido"
                value={n.content}
                onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, content: v } : x)) })}
                placeholder="Contenido completo…"
                maxLength={600}
                showCount
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.8rem', alignItems: 'end' }}>
                <Field label="Fecha (YYYY-MM-DD)" value={n.publishedAt} onChange={(v) => patch({ news: site.news.map((x) => (x.id === n.id ? { ...x, publishedAt: v } : x)) })} placeholder="2024-07-15" />
                <div style={{ paddingBottom: '1rem', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}>{n.publishedAt || 'Sin fecha'}</div>
                  <div style={{ fontSize: '0.75rem', color: n.isActive ? 'var(--accent)' : '#9ca3af', fontWeight: 700 }}>{n.isActive ? 'Visible en home' : 'Oculta'}</div>
                </div>
              </div>

              <div className="news-admin-preview">
                <div className="news-date" style={{ marginBottom: '0.3rem' }}>
                  <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {n.publishedAt || '2024-01-01'}
                </div>
                <div className="news-title" style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{n.title || 'Título preview'}</div>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>{n.excerpt || 'Entradilla preview…'}</p>
                <div style={{ marginTop: '0.55rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className="badge" style={{ fontSize: '0.66rem' }}>{n.isActive ? 'Activa' : 'Borrador'}</span>
                  <span className="badge" style={{ fontSize: '0.66rem', background: n.content.length > 500 ? '#fef2f2' : '#f0fdf4', color: n.content.length > 500 ? '#b91c1c' : '#15803d', borderColor: n.content.length > 500 ? '#fecaca' : '#bbf7d0' }}>{n.content.length}/600</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <AddBtn
            label="Añadir noticia"
            accent
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
        <StickyBar onReset={resetContent} />
      </>
    );
  }

  if (section === 'contact') {
    return (
      <>
        {head}
        <motion.div className="admin-card" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(233,69,96,0.10)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(233,69,96,0.16)' }}>
              <svg width={18} height={18} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'Poppins' }}>Información de contacto</div>
              <div style={{ fontSize: '0.84rem', color: '#6b7280' }}>Se muestra en la sección Contacto y footer.</div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <Field label="Email" value={site.contact.email} onChange={(v) => patch({ contact: { ...site.contact, email: v } })} />
            <Field label="Teléfono" value={site.contact.phone} onChange={(v) => patch({ contact: { ...site.contact, phone: v } })} />
            <Field label="Dirección" value={site.contact.address} onChange={(v) => patch({ contact: { ...site.contact, address: v } })} />
            <Field label="Ciudad" value={site.contact.city} onChange={(v) => patch({ contact: { ...site.contact, city: v } })} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <AreaField
              label="Copyright (footer)"
              value={site.footer.copyright}
              onChange={(v) => patch({ footer: { copyright: v } })}
            />
          </motion.div>
          <motion.div variants={itemVariants}><StickyBar onReset={resetContent} /></motion.div>
        </motion.div>
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
