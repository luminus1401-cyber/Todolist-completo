// Em produção defina VITE_API_URL; em dev o proxy do Vite cuida do /api.
const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    // Content-Type só quando há corpo (o Fastify rejeita JSON vazio no DELETE).
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Erro ao comunicar com o servidor.');
  return data;
}

export const api = {
  list: ({ search, status }) => {
    const qs = new URLSearchParams({ search, status });
    return request(`/api/tasks?${qs}`);
  },
  create: (payload) => request('/api/tasks', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/tasks/${id}`, { method: 'PATCH', body: payload }),
  remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
