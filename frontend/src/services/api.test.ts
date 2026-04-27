import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';

describe('api service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('requests profile data via GET', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'p1' }),
    } as Response);

    await api.getProfile();

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/profile'));
  });

  it('throws default API error when GET fails', async () => {
    vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as Response);

    await expect(api.getSkills()).rejects.toThrow('API error 503: /api/skills');
  });

  it('supports all collection GET endpoints', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await Promise.all([
      api.getExperiences(),
      api.getEducation(),
      api.getSkills(),
      api.getClients(),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenNthCalledWith(1, expect.stringContaining('/api/experience'));
    expect(fetchMock).toHaveBeenNthCalledWith(2, expect.stringContaining('/api/education'));
    expect(fetchMock).toHaveBeenNthCalledWith(3, expect.stringContaining('/api/skills'));
    expect(fetchMock).toHaveBeenNthCalledWith(4, expect.stringContaining('/api/clients'));
  });

  it('submits contact data successfully', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'ok' }),
    } as Response);

    await api.submitContact({ name: 'A', email: 'a@test.com', message: 'hello' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('throws backend message on failed contact submit', async () => {
    vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: 'Invalid payload' } }),
    } as Response);

    await expect(
      api.submitContact({ name: 'A', email: 'a@test.com', message: 'hello' }),
    ).rejects.toThrow('Invalid payload');
  });

  it('throws default API error when failed submit has non-json error body', async () => {
    vi.spyOn(globalThis, 'fetch' as never).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    } as Response);

    await expect(
      api.submitContact({ name: 'A', email: 'a@test.com', message: 'hello' }),
    ).rejects.toThrow('API error 500: /api/contact');
  });
});
