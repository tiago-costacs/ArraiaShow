import React, { useState } from 'react';
import { del, put } from '../../../utils/api.js';
import BarracaList from '../components/BarracaList.js';
import { barracaMetrics, formatCurrency } from '../utils.js';

export default function BarracasScreen({ barracas, users, barraqueiros, orders, products, token, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [assignBarracaId, setAssignBarracaId] = useState(null);
  const [selectedResponsavel, setSelectedResponsavel] = useState('');

  const toggleMenu = (barracaId) => {
    setMenuOpenId((prev) => (prev === barracaId ? null : barracaId));
  };

  const closeMenu = () => {
    setMenuOpenId(null);
  };

  const startAssignResponsavel = (barraca) => {
    setAssignBarracaId(barraca.id);
    setSelectedResponsavel(barraca.responsavel_id || '');
    closeMenu();
  };

  const cancelAssignResponsavel = () => {
    setAssignBarracaId(null);
    setSelectedResponsavel('');
  };

  const saveResponsavel = async (barracaId) => {
    setLoading(true);
    try {
      await put(`/barracas/${barracaId}`, token, { responsavel_id: selectedResponsavel || null });
      setStatus('Responsável atualizado.');
      onDelete?.();
      cancelAssignResponsavel();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
    }
  };

  const handleDeleteBarraca = async (barracaId) => {
    const confirmar = window.confirm('Deseja excluir esta barraca?');
    if (!confirmar) return;
    setLoading(true);
    try {
      await del(`/barracas/${barracaId}`, token);
      setStatus('Barraca excluida.');
      onDelete?.();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 2500);
      closeMenu();
    }
  };

  return (
    <div className="screen-body">
      <div className="section-head">
        <div>
          <p className="card-title">Operacao das barracas</p>
          <h2>{barracas.length} barraca(s)</h2>
        </div>
        <span className="badge badge-info">Repasse {formatCurrency(barracas.reduce((sum, barraca) => sum + barracaMetrics(barraca, orders, products).repasse, 0))}</span>
      </div>

      <BarracaList
        barracas={barracas}
        users={users}
        barraqueiros={barraqueiros}
        orders={orders}
        products={products}
        assignBarracaId={assignBarracaId}
        selectedResponsavel={selectedResponsavel}
        menuOpenId={menuOpenId}
        loading={loading}
        onStartAssign={startAssignResponsavel}
        onCancelAssign={cancelAssignResponsavel}
        onSaveResponsavel={saveResponsavel}
        onDeleteBarraca={handleDeleteBarraca}
        onToggleMenu={toggleMenu}
        onChangeResponsavel={setSelectedResponsavel}
      />
      {status && <div className="inline-alert" style={{ marginTop: 12 }}>{status}</div>}
    </div>
  );
}
