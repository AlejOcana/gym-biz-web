import { AppProvider, useApp } from './core/store';
import { PublicSite } from './pages/PublicSite';
import { AdminApp } from './pages/admin/AdminApp';
import './styles/global.css';
import './app.css';

function Views() {
  const { state } = useApp();
  return state.view === 'admin' ? <AdminApp /> : <PublicSite />;
}

export default function App() {
  return (
    <AppProvider>
      <Views />
    </AppProvider>
  );
}
