export const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;

export const initials = (name = '') => name.trim().slice(0, 2).toUpperCase() || '??';
