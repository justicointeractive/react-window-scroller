export const windowScrollPositionKey = {
  y: 'pageYOffset',
  x: 'pageXOffset'
} as const;

export const documentScrollPositionKey = {
  y: 'scrollTop',
  x: 'scrollLeft'
} as const;

export function getWindowScrollPosition(axis: 'x' | 'y') {
  return (
    window[windowScrollPositionKey[axis]] ||
    document.documentElement[documentScrollPositionKey[axis]] ||
    document.body[documentScrollPositionKey[axis]] ||
    0
  );
}
