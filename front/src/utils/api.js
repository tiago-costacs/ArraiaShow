const defaultHeaders = {
  'Content-Type': 'application/json',
};

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const handleResponse = async (response) => {
  const data = await parseResponse(response);
  if (!response.ok) {
    // Se data for uma string (HTML de erro do servidor), evita erro de objeto
    const message = (data && typeof data === 'object') 
      ? (data.message || data.error) 
      : (response.statusText || 'Erro desconhecido');
    throw new Error(message);
  }
  return data;
};

const buildHeaders = (token, extra = {}) => {
  const headers = { ...defaultHeaders, ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const apiFetch = async (path, token, options = {}) => {
  const config = {
    method: options.method || 'GET',
    headers: buildHeaders(token, options.headers || {}),
    body: options.body,
  };

  if (config.method === 'GET' || config.method === 'HEAD') {
    delete config.body;
  }

  const response = await fetch(path, config);
  return handleResponse(response);
};

export const get = async (path, token) => apiFetch(path, token, { method: 'GET' });
export const post = async (path, token, body) => apiFetch(path, token, { method: 'POST', body: JSON.stringify(body) });
export const put = async (path, token, body) => apiFetch(path, token, { method: 'PUT', body: JSON.stringify(body) });
export const del = async (path, token) => apiFetch(path, token, { method: 'DELETE' });
