import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useMousePosition } from './useMousePosition';

describe('useMousePosition', () => {
  it('tracks mouse coordinates', () => {
    const { result } = renderHook(() => useMousePosition());
    expect(result.current).toEqual({ x: 0, y: 0 });

    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 220 }));
    });

    expect(result.current).toEqual({ x: 100, y: 220 });
  });
});
