import React, { useState, useEffect } from 'react';
import Phone from '../components/Phone.js';
import NavBar from '../components/NavBar.js';
import { ADM_COLOR, ADM_MID } from './admin/constants.js';
import { get } from '../utils/api.js';
import OverviewScreen from './admin/screens/OverviewScreen.js';
import UsersScreen from './admin/screens/UsersScreen.js';
import CreateUserScreen from './admin/screens/CreateUserScreen.js';
import CriarEventoScreen from './admin/screens/CriarEventoScreen.js';
import EventosScreen from './admin/screens/EventosScreen.js';

export default function AdminApp({ subtitle, user, token }) {
  const [tab, setTab] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [selectedEvId, setSelectedEvId] = useState(null);

  const loadEventos = async () => {
    try {
      const data = await get('/eventos', token);
      setEventos(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selectedEvId) setSelectedEvId(data[0].id);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadEventos(); }, [token]);

  const activeEvento = eventos.find(e => Number(e.id) === Number(selectedEvId));

  const navItems = [
    { icon: 'G', label: 'Geral' },
    { icon: 'Us', label: 'Usuarios' },
    { icon: '+', label: 'Criar' },
    { icon: '🎪', label: 'Eventos' },
    { icon: '🛠', label: 'Gerenciar' },
  ];

  const screens = [
    <OverviewScreen key="geral" token={token} selectedEventoId={selectedEvId} />,
    <UsersScreen key="usuarios" token={token} user={user} eventos={eventos} selectedEventoId={selectedEvId} />,
    <CreateUserScreen key="criar" token={token} eventos={eventos} />,
    <CriarEventoScreen key="eventos" token={token} />,
    <EventosScreen key="admin-eventos" token={token} />,
  ];

  const titles = ['Visao geral', 'Gerenciar usuarios', 'Criar evento', 'Eventos', 'Gerenciar eventos'];

  const topContent = eventos.length > 0 ? (
    <div style={{ 
      padding: '10px 16px 14px', 
      background: 'rgba(255,255,255,0.12)', 
      borderBottom: '1px solid rgba(255,255,255,0.2)', 
      display: 'flex', 
      alignItems: 'center', 
      gap: 10 
    }}>
      <span style={{ fontSize: 20 }}>🛡️</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: -2 }}>
          Alternar Contexto
        </div>
        <select 
          value={selectedEvId || ''} 
          onChange={e => setSelectedEvId(e.target.value)}
          style={{ 
            width: '100%',
            fontSize: 14, 
            fontWeight: 800, 
            border: 'none', 
            background: 'transparent', 
            outline: 'none', 
            color: '#fff',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          {eventos.map(ev => <option key={ev.id} value={ev.id}>{ev.nome}</option>)}
        </select>
      </div>
    </div>
  ) : null;

  return (
    <Phone color={ADM_COLOR} textColor="#fff" title={titles[tab]} subtitle={activeEvento ? `Arraiá: ${activeEvento.nome}` : subtitle} onBack={null} topContent={topContent}>
      {screens[tab]}
      <NavBar items={navItems} active={tab} onSelect={setTab} activeColor={ADM_MID} />
    </Phone>
  );
}
