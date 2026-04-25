import { Experience, Education, Profile, SkillCategory, Client } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const get = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
};

const post = async <T>(path: string, body: unknown): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `API error ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
};

export const api = {
  getExperiences: () => get<Experience[]>('/api/experience'),
  getEducation: () => get<Education[]>('/api/education'),
  getProfile: () => get<Profile>('/api/profile'),
  getSkills: () => get<SkillCategory[]>('/api/skills'),
  getClients: () => get<Client[]>('/api/clients'),
  submitContact: (payload: { name: string; email: string; message: string }) =>
    post<{ message: string }>('/api/contact', payload),
};
