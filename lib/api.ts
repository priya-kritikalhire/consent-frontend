export const API_BASE = process.env.NEXT_PUBLIC_PORTAL_API_URL || 'http://localhost:4100/api';

export function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('portal_token') || '';
}

export function setSession(token: string, user: any) {
  localStorage.setItem('portal_token', token);
  localStorage.setItem('portal_user', JSON.stringify(user));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('portal_user');
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem('portal_token');
  localStorage.removeItem('portal_user');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(data?.message || data?.error || text || 'Request failed');
  return data;
}
