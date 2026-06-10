import React from 'react';
import { BA, BL, BM } from '../constants.js';
import { formatCurrency, initials } from '../utils.js';

export default function QrScreen({ participants, products, scanState, setScanState, onConfirmSale, status, setStatus, loading }) {
  const { active, selectedParticipantId, selectedProductId, quantity } = scanState;
  const activeProducts = products.filter((product) => Number(product.estoque || 0) > 0);
  const participant = participants.find((item) => Number(item.id) === Number(selectedParticipantId));
  const product = activeProducts.find((item) => Number(item.id) === Number(selectedProductId));
  const total = product ? Number(product.preco) * quantity : 0;

  const handleScan = () => {
    if (!participants.length) return setStatus('Nenhum participante disponivel para simular o QR Code.');
    if (!activeProducts.length) return setStatus('Nenhum produto ativo em estoque para vender.');
    setScanState((prev) => ({
      ...prev,
      active: true,
      selectedParticipantId: prev.selectedParticipantId || participants[0].id,
      selectedProductId: prev.selectedProductId || activeProducts[0].id,
      quantity: prev.quantity || 1,
    }));
    setStatus('QR Code simulado. Selecione o produto e confirme a venda.');
  };

  return (
    <div className="screen-body">
      <div className="scan-cam">
        <div className="scan-frame">
          {['tl', 'tr', 'bl', 'br'].map((pos) => <div key={pos} className={`sc ${pos}`} style={{ borderColor: BA }} />)}
          <div className="scan-line" style={{ background: BA }} />
        </div>
        <div className="scan-hint">Aponte o telefone para o QR Code do participante</div>
      </div>
      <button className="btn btn-secondary" type="button" onClick={handleScan}>Simular leitura de QR Code</button>

      {active && (
        <div className="card" style={{ marginTop: 10 }}>
          <p className="card-title">Participante detectado</p>
          <div className="item-row" style={{ borderBottom: 0, paddingTop: 0 }}>
            <div className="avatar" style={{ background: BL, color: BM }}>{initials(participant?.nome)}</div>
            <div className="item-info">
              <div className="item-name">{participant?.nome || 'Participante'}</div>
              <div className="item-meta">{participant?.email || 'usuario selecionado'}</div>
            </div>
          </div>

          <div className="field">
            <label>Participante</label>
            <select value={selectedParticipantId || ''} onChange={(e) => setScanState((prev) => ({ ...prev, selectedParticipantId: Number(e.target.value) }))}>
              {participants.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Produto ativo</label>
            <select value={selectedProductId || ''} onChange={(e) => setScanState((prev) => ({ ...prev, selectedProductId: Number(e.target.value), quantity: 1 }))}>
              {activeProducts.map((item) => <option key={item.id} value={item.id}>{item.nome} - {formatCurrency(item.preco)} - estoque {item.estoque}</option>)}
            </select>
          </div>

          <div className="row">
            <span className="row-label">Quantidade</span>
            <div className="qty-ctrl">
              <button className="qty-btn" type="button" onClick={() => setScanState((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}>-</button>
              <div className="qty-num">{quantity}</div>
              <button className="qty-btn" type="button" onClick={() => setScanState((prev) => ({ ...prev, quantity: Math.min(Number(product?.estoque || 1), prev.quantity + 1) }))}>+</button>
            </div>
          </div>
          <div className="row">
            <span className="row-label">Valor total</span>
            <span className="row-value">{formatCurrency(total)}</span>
          </div>
          <button
            className="btn"
            type="button"
            style={{ background: BA, color: '#fff' }}
            onClick={() => onConfirmSale({ usuario_id: selectedParticipantId, itens: [{ produto_id: selectedProductId, quantidade: quantity }] })}
            disabled={!participant || !product || loading}
          >
            {loading ? 'Confirmando...' : 'Confirmar venda'}
          </button>
        </div>
      )}
      {status && <div style={{ marginTop: 10, color: '#555', fontSize: 13 }}>{status}</div>}
    </div>
  );
}
