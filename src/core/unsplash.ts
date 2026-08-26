/** Unsplash helper — progressive enhancement with picsum fallback. */

export interface UnsplashPhoto {
  id: string;
  thumb: string;
  small: string;
  regular: string;
  alt: string;
  photographer: string;
  profile: string;
  html: string;
}

export function unsplashSearchUrl(query: string): string {
  return `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
}

interface UnsplashApiResponse {
  results: Array<{
    id: string;
    alt_description: string | null;
    description: string | null;
    urls: { raw: string; full: string; regular: string; small: string; thumb: string };
    links: { html: string };
    user: { name: string; links: { html: string } };
  }>;
}

/**
 * Search Unsplash for photos.
 * Reads `VITE_UNSPLASH_ACCESS_KEY` from env.
 * Throws "No key" if missing, or clear errors for 401/403.
 */
export async function searchUnsplash(query: string, perPage = 6): Promise<UnsplashPhoto[]> {
  const key = (import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined)?.trim();
  if (!key) throw new Error('No key');

  const url =
    `https://api.unsplash.com/search/photos` +
    `?query=${encodeURIComponent(query)}` +
    `&per_page=${perPage}` +
    `&orientation=landscape` +
    `&content_filter=high` +
    `&client_id=${encodeURIComponent(key)}`;

  let res: Response;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Error de red al contactar Unsplash');
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('Unsplash: clave inválida o no autorizada (401)');
    if (res.status === 403) throw new Error('Unsplash: acceso denegado / límite excedido (403)');
    throw new Error(`Unsplash error ${res.status}`);
  }

  const data = (await res.json()) as UnsplashApiResponse;
  return (data.results ?? []).map((r) => ({
    id: r.id,
    thumb: r.urls.thumb,
    small: r.urls.small,
    regular: r.urls.regular,
    alt: r.alt_description ?? r.description ?? query,
    photographer: r.user.name,
    profile: r.user.links.html,
    html: r.links.html,
  }));
}

/** Fallback picsum URL helpers */
export function picsumUrl(seed: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

export function picsumRandomUrl(seedBase: string, w = 800, h = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seedBase)}-${Date.now()}/${w}/${h}`;
}
