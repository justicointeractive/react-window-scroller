import throttle from 'lodash/throttle';
import {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from 'react';

const windowScrollPositionKey = {
  y: 'pageYOffset',
  x: 'pageXOffset'
} as const;

const documentScrollPositionKey = {
  y: 'scrollTop',
  x: 'scrollLeft'
} as const;

const getScrollPosition = (axis: 'x' | 'y') =>
  window[windowScrollPositionKey[axis]] ||
  document.documentElement[documentScrollPositionKey[axis]] ||
  document.body[documentScrollPositionKey[axis]] ||
  0;

type ListScrollable = {
  scrollTo: (top: number) => void;
};

type GridScrollable = {
  scrollTo: (dimensions: { scrollTop: number; scrollLeft: number }) => void;
};

type ScrollerProps<TIsGrid extends boolean | undefined> = TIsGrid extends true
  ? GridScrollable
  : ListScrollable;

type OnScrollProps = {
  scrollLeft: number;
  scrollTop: number;
  scrollOffset: number;
  scrollUpdateWasRequested: boolean;
};

type CommonChildrenRenderProps<T> = {
  ref: MutableRefObject<T | undefined>;
  outerRef: MutableRefObject<HTMLElement | undefined>;
  style: React.CSSProperties;
  onScroll: (ev: OnScrollProps) => void;
};

type GridScrollerProps = {
  children: (
    renderProps: CommonChildrenRenderProps<GridScrollable>
  ) => ReactNode;
  throttleTime?: number;
  isGrid: true;
};

type ListScrollerProps = {
  children: (
    renderProps: CommonChildrenRenderProps<ListScrollable>
  ) => ReactNode;
  throttleTime?: number;
  isGrid: false | undefined;
};

export const ReactWindowScroller = <
  T extends ListScrollerProps | GridScrollerProps
>({
  children,
  throttleTime = 10,
  isGrid
}: T) => {
  const ref = useRef<ScrollerProps<T['isGrid']>>();
  const outerRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {};

      const scrollTop = getScrollPosition('y') - offsetTop;
      const scrollLeft = getScrollPosition('x') - offsetLeft;

      if (isGrid) {
        ref.current && ref.current.scrollTo({ scrollLeft, scrollTop } as any);
      } else {
        ref.current && ref.current.scrollTo(scrollTop as any);
      }
    }, throttleTime);

    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      handleWindowScroll.cancel();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [isGrid]);

  const onScroll = useCallback(
    ({
      scrollLeft,
      scrollTop,
      scrollOffset,
      scrollUpdateWasRequested
    }: OnScrollProps) => {
      if (!scrollUpdateWasRequested) return;
      const top = getScrollPosition('y');
      const left = getScrollPosition('x');
      const { offsetTop = 0, offsetLeft = 0 } = outerRef.current || {};

      scrollOffset += Math.min(top, offsetTop);
      scrollTop += Math.min(top, offsetTop);
      scrollLeft += Math.min(left, offsetLeft);

      if (!isGrid && scrollOffset !== top) {
        window.scrollTo(0, scrollOffset);
      }
      if (isGrid && (scrollTop !== top || scrollLeft !== left)) {
        window.scrollTo(scrollLeft, scrollTop);
      }
    },
    [isGrid]
  );

  return children({
    ref: ref as any,
    outerRef,
    style: {
      width: isGrid ? 'auto' : '100%',
      height: '100%',
      display: 'inline-block'
    },
    onScroll
  });
};
