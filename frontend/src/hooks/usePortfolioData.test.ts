import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePortfolioData } from './usePortfolioData';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    getExperiences: vi.fn(),
    getEducation: vi.fn(),
    getProfile: vi.fn(),
    getSkills: vi.fn(),
    getClients: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('usePortfolioData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads all portfolio sections successfully', async () => {
    mockedApi.getExperiences.mockResolvedValueOnce([{ company: 'X' }] as never);
    mockedApi.getEducation.mockResolvedValueOnce([{ school: 'Y' }] as never);
    mockedApi.getProfile.mockResolvedValueOnce({ name: 'Ashley' } as never);
    mockedApi.getSkills.mockResolvedValueOnce([{ category: 'Frontend', items: [] }] as never);
    mockedApi.getClients.mockResolvedValueOnce([{ name: 'Client' }] as never);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.profile).toEqual({ name: 'Ashley' });
    expect(result.current.experiences).toHaveLength(1);
    expect(result.current.education).toHaveLength(1);
    expect(result.current.skills).toHaveLength(1);
    expect(result.current.clients).toHaveLength(1);
  });

  it('sets error when any request fails', async () => {
    mockedApi.getExperiences.mockRejectedValueOnce(new Error('network down'));
    mockedApi.getEducation.mockResolvedValueOnce([] as never);
    mockedApi.getProfile.mockResolvedValueOnce(null as never);
    mockedApi.getSkills.mockResolvedValueOnce([] as never);
    mockedApi.getClients.mockResolvedValueOnce([] as never);

    const { result } = renderHook(() => usePortfolioData());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('network down');
  });
});
