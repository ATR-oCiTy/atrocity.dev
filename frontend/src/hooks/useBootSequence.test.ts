import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useBootSequence } from './useBootSequence';

describe('useBootSequence', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs full boot sequence and marks session as booted', () => {
    const { result } = renderHook(() => useBootSequence());
    expect(result.current.isBooting).toBe(true);
    expect(result.current.visibleLines).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(result.current.isBooting).toBe(false);
    expect(result.current.progress).toBe(100);
    expect(result.current.visibleLines.length).toBeGreaterThan(0);
    expect(sessionStorage.getItem('sys_booted')).toBe('true');
  });

  it('skips boot sequence immediately when already booted', () => {
    sessionStorage.setItem('sys_booted', 'true');
    const { result } = renderHook(() => useBootSequence());
    expect(result.current.isBooting).toBe(false);
  });

  it('supports manual skip', () => {
    const { result } = renderHook(() => useBootSequence());
    expect(result.current.isBooting).toBe(true);

    act(() => {
      result.current.skip();
    });

    expect(result.current.isBooting).toBe(false);
  });
});
