import React, { useState } from 'react';
import GlobalStyle from './components/GlobalStyle.js';
import AuthPage from './pages/AuthPage.js';
import ParticipanteApp from './profiles/Participante.js';
import BarraqueiroApp from './profiles/Barraqueiro.js';
import OrganizadorApp from './profiles/OrganizadorApp.js';
import AdminApp from './profiles/AdminApp.js';

const ROLE_LABELS = {
  admin: 'Administrador',
  organizador: 'Organizador',
  barraqueiro: 'Barraqueiro',
  participante: 'Participante',
};

function AppRouter({ user, token }) {
  const subtitle = user?.email ?? '';
  const commonProps = { user, token, subtitle };
  const userRole = user?.tipo?.toLowerCase().trim();

  switch (userRole) {
    case 'admin': return <AdminApp {...commonProps} />;
    case 'organizador': return <OrganizadorApp {...commonProps} />;
    case 'barraqueiro': return <BarraqueiroApp {...commonProps} />;
    case 'participante':
    default: return <ParticipanteApp {...commonProps} />;
  }
}

export default function App() {
  const [tela, setTela] = useState('auth');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setTela('app');
    }
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setTela('app');
  };

  const handleLogout = () => {
    setMenuAberto(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setTela('auth');
  };

  const initial = (user?.nome || user?.email || 'U').slice(0, 1).toUpperCase();

  return (
    <div className="app-wrap">
      <GlobalStyle />

      {tela === 'auth' && (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}

      {tela === 'app' && user && (
        <>
          <div className="profile-fab">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="profile-trigger"
              aria-label={menuAberto ? 'Fechar menu do usuario' : 'Abrir menu do usuario'}
              aria-expanded={menuAberto}
            >
              <span>{initial}</span>
            </button>

            {menuAberto && (
              <div className="profile-dropdown">
                <div className="profile-summary">
                  <div className="profile-avatar">{initial}</div>
                  <div>
                    <div className="profile-name">{user.nome || 'Usuario'}</div>
                    <div className="profile-role">{ROLE_LABELS[user.tipo] || 'Participante'}</div>
                  </div>
                </div>
                <div className="profile-email">{user.email}</div>
                <button onClick={handleLogout} className="profile-logout">
                  Sair
                </button>
              </div>
            )}
          </div>

          <AppRouter user={user} token={token} />
        </>
      )}
    </div>
  );
}
