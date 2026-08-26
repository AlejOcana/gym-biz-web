/** App store: site content, bookings, messages, auth session — persisted to localStorage. */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_SITE } from './defaultSite';
import type {
  AdminSession,
  Booking,
  ContactMessage,
  SiteContent,
} from './types';

export type View = 'public' | 'admin';

interface State {
  view: View;
  adminSection: string;
  session: AdminSession | null;
  site: SiteContent;
  bookings: Booking[];
  messages: ContactMessage[];
  hydrated: boolean;
}

type Action =
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SET_ADMIN_SECTION'; section: string }
  | { type: 'LOGIN'; session: AdminSession }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_SITE'; site: SiteContent }
  | { type: 'ADD_BOOKING'; booking: Booking }
  | { type: 'ADD_MESSAGE'; message: ContactMessage }
  | { type: 'MARK_READ'; id: string }
  | { type: 'HYDRATE'; payload: Partial<State> }
  | { type: 'RESET_CONTENT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'SET_ADMIN_SECTION':
      return { ...state, adminSection: action.section };
    case 'LOGIN':
      return { ...state, session: action.session, view: 'admin', adminSection: 'dashboard' };
    case 'LOGOUT':
      return { ...state, session: null, view: 'public' };
    case 'UPDATE_SITE':
      return { ...state, site: action.site };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.booking] };
    case 'ADD_MESSAGE':
      return { ...state, messages: [action.message, ...state.messages] };
    case 'MARK_READ':
      return {
        ...state,
        messages: state.messages.map((m) => (m.id === action.id ? { ...m, isRead: true } : m)),
      };
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true };
    case 'RESET_CONTENT':
      return { ...state, site: { ...DEFAULT_SITE, lastUpdated: new Date().toISOString() } };
    default:
      return state;
  }
}

const LS_SITE = 'gymbiz.site.v2';
const LS_BOOKINGS = 'gymbiz.bookings.v2';
const LS_MESSAGES = 'gymbiz.messages.v2';
const LS_SESSION = 'gymbiz.session.v2';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

interface AppContextValue {
  state: State;
  setView: (view: View) => void;
  setAdminSection: (section: string) => void;
  login: (session: AdminSession) => void;
  logout: () => void;
  updateSite: (site: SiteContent) => void;
  addBooking: (booking: Booking) => void;
  addMessage: (message: ContactMessage) => void;
  markRead: (id: string) => void;
  resetContent: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    view: 'public',
    adminSection: 'dashboard',
    session: null,
    site: DEFAULT_SITE,
    bookings: [],
    messages: [],
    hydrated: false,
  });

  useEffect(() => {
    dispatch({
      type: 'HYDRATE',
      payload: {
        site: loadJson<SiteContent>(LS_SITE, DEFAULT_SITE),
        bookings: loadJson<Booking[]>(LS_BOOKINGS, []),
        messages: loadJson<ContactMessage[]>(LS_MESSAGES, []),
        session: loadJson<AdminSession | null>(LS_SESSION, null),
      },
    });
  }, []);

  useEffect(() => {
    if (state.hydrated) saveJson(LS_SITE, state.site);
  }, [state.site, state.hydrated]);

  useEffect(() => {
    if (state.hydrated) saveJson(LS_BOOKINGS, state.bookings);
  }, [state.bookings, state.hydrated]);

  useEffect(() => {
    if (state.hydrated) saveJson(LS_MESSAGES, state.messages);
  }, [state.messages, state.hydrated]);

  useEffect(() => {
    if (state.hydrated) saveJson(LS_SESSION, state.session);
  }, [state.session, state.hydrated]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setView: (view) => dispatch({ type: 'SET_VIEW', view }),
      setAdminSection: (section) => dispatch({ type: 'SET_ADMIN_SECTION', section }),
      login: (session) => dispatch({ type: 'LOGIN', session }),
      logout: () => dispatch({ type: 'LOGOUT' }),
      updateSite: (site) => dispatch({ type: 'UPDATE_SITE', site }),
      addBooking: (booking) => dispatch({ type: 'ADD_BOOKING', booking }),
      addMessage: (message) => dispatch({ type: 'ADD_MESSAGE', message }),
      markRead: (id) => dispatch({ type: 'MARK_READ', id }),
      resetContent: () => dispatch({ type: 'RESET_CONTENT' }),
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
