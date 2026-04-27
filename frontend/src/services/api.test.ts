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
});
