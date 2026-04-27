import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCardStack } from './useCardStack';

describe('useCardStack', () => {
  it('navigates between indexes and sets direction', () => {
    const { result } = renderHook(() => useCardStack());

    act(() => result.current.navigateTo(2));
    expect(result.current.activeIndex).toBe(2);
    expect(result.current.direction).toBe('down');

    act(() => result.current.navigateTo(1));
    expect(result.current.activeIndex).toBe(1);
    expect(result.current.direction).toBe('up');
  });

  it('ignores invalid or same-index navigation', () => {
    const { result } = renderHook(() => useCardStack());

    act(() => result.current.navigateTo(0));
    expect(result.current.activeIndex).toBe(0);

    act(() => result.current.navigateTo(-1));
    expect(result.current.activeIndex).toBe(0);

    act(() => result.current.navigateTo(99));
    expect(result.current.activeIndex).toBe(0);
  });

  it('supports command navigation aliases', () => {
    const { result } = renderHook(() => useCardStack());

    expect(result.current.navigateByCommand('cd /skills')).toBe(true);
    expect(result.current.activeIndex).toBe(1);

    expect(result.current.navigateByCommand('open training_data')).toBe(true);
    expect(result.current.activeIndex).toBe(3);

    expect(result.current.navigateByCommand('unknown')).toBe(false);
  });

  it('supports ctrl-number shortcut and ignores typing in input fields', () => {
    const { result } = renderHook(() => useCardStack());

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '4', ctrlKey: true, bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.activeIndex).toBe(3);

    const input = document.createElement('input');
    document.body.appendChild(input);

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent('keydown', { key: '1', ctrlKey: true, bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.activeIndex).toBe(3);

    input.remove();
  });
});
