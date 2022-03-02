import throttle from 'lodash/throttle';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import {
  FixedSizeGrid,
  FixedSizeList,
  GridOnScrollProps,
  ListOnScrollProps,
  VariableSizeGrid,
  VariableSizeList
} from 'react-window';

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

type OnScrollProps = {
  scrollLeft: number;
  scrollTop: number;
  scrollOffset: number;
  scrollUpdateWasRequested: boolean;
};

type CommonChildrenRenderProps<TRef, TOnScrollProps> = {
  ref: MutableRefObject<TRef | null>;
  outerRef: MutableRefObject<HTMLElement | undefined>;
  style: React.CSSProperties;
  onScroll: (ev: TOnScrollProps) => any;
};

type ScrollerProps<
  TIsGrid extends boolean | undefined,
  TIsVariable extends boolean | undefined
> = {
  children: (
    renderProps: CommonChildrenRenderProps<
      ScrollableRef<TIsGrid, TIsVariable>,
      ScrollProps<TIsGrid>
    >
  ) => JSX.Element;
  throttleTime?: number;
  isGrid: TIsGrid;
  isVariable: TIsVariable;
};

type ScrollProps<TIsGrid extends boolean | undefined> = TIsGrid extends true
  ? GridOnScrollProps
  : ListOnScrollProps;

type ScrollableRef<
  TIsGrid extends boolean | undefined,
  TIsVariable extends boolean | undefined
> = TIsGrid extends true
  ? TIsVariable extends true
    ? VariableSizeGrid
    : FixedSizeGrid
  : TIsVariable extends true
  ? VariableSizeList
  : FixedSizeList;

function pageOffset(
  outerRef: MutableRefObject<HTMLElement | undefined>
): { offsetTop?: number | undefined; offsetLeft?: number | undefined } {
  const rect = outerRef.current?.getBoundingClientRect();
  return rect
    ? {
        offsetTop: rect.top + getScrollPosition('y'),
        offsetLeft: rect.left + getScrollPosition('x')
      }
    : {};
}

export function ReactWindowScroller<
  TIsGrid extends boolean | undefined,
  TIsVariable extends boolean | undefined
>({
  children,
  throttleTime = 10,
  isGrid
}: ScrollerProps<TIsGrid, TIsVariable>): JSX.Element {
  const ref = useRef<ScrollableRef<TIsGrid, TIsVariable>>(null);
  const outerRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = pageOffset(outerRef);

      const scrollTop = getScrollPosition('y') - offsetTop;
      const scrollLeft = getScrollPosition('x') - offsetLeft;

      if (isGrid) {
        (ref.current as ScrollableRef<true, TIsVariable>)?.scrollTo({
          scrollLeft,
          scrollTop
        });
      } else {
        (ref.current as ScrollableRef<false, TIsVariable>)?.scrollTo(scrollTop);
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
      const { offsetTop = 0, offsetLeft = 0 } = pageOffset(outerRef);

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
    onScroll: onScroll as any
  });
}
