import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useContactForm } from './useContactForm';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    submitContact: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('useContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates fields and submits successfully', async () => {
    mockedApi.submitContact.mockResolvedValueOnce({ message: 'ok' } as never);
    const { result } = renderHook(() => useContactForm());

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Ashley' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(mockedApi.submitContact).toHaveBeenCalledWith({
      name: 'Ashley',
      email: '',
      message: '',
    });
    expect(result.current.status).toBe('DATA UPLOADED.');
    expect(result.current.formData).toEqual({ name: '', email: '', message: '' });
  });

  it('surfaces submit errors as status', async () => {
    mockedApi.submitContact.mockRejectedValueOnce(new Error('CONNECTION LOST'));
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(result.current.status).toBe('CONNECTION LOST');
  });
});
