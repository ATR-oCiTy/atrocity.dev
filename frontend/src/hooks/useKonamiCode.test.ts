import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useKonamiCode } from './useKonamiCode';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

describe('useKonamiCode', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('triggers and auto-resets after full sequence', () => {
    const { result } = renderHook(() => useKonamiCode());

    act(() => {
      KONAMI.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      });
    });

    expect(result.current.triggered).toBe(true);

    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(result.current.triggered).toBe(false);
  });

  it('ignores keys from input targets', () => {
    const { result } = renderHook(() => useKonamiCode());
    const input = document.createElement('input');
    document.body.appendChild(input);

    act(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    });

    expect(result.current.triggered).toBe(false);
    input.remove();
  });

  it('resets sequence progress on wrong key', () => {
    const { result } = renderHook(() => useKonamiCode());

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }));
      KONAMI.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }));
      });
    });

    expect(result.current.triggered).toBe(true);
  });
});
