import { MutableRefObject } from 'react';
import { getWindowScrollPosition } from './getScrollPosition';

export function elementPageOffset(
  outerRef: MutableRefObject<HTMLElement | undefined>
): { offsetTop?: number | undefined; offsetLeft?: number | undefined } {
  const rect = outerRef.current?.getBoundingClientRect();
  return rect
    ? {
        offsetTop: rect.top + getWindowScrollPosition('y'),
        offsetLeft: rect.left + getWindowScrollPosition('x')
      }
    : {};
}
