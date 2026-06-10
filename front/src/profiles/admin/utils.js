export const asArray = (value) => Array.isArray(value) ? value : [];

export const formatCurrency = (value) => `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
