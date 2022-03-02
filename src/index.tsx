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
    renderProps: CommonChildrenRenderProps<GridScrollableRef>
  ) => ReactNode;
  throttleTime?: number;
  isGrid: true;
};

type ListScrollerProps = {
  children: (
    renderProps: CommonChildrenRenderProps<ListScrollableRef>
  ) => ReactNode;
  throttleTime?: number;
  isGrid?: false;
};

type ListScrollableRef = {
  scrollTo: (top: number) => void;
};

type GridScrollableRef = {
  scrollTo: (dimensions: { scrollTop: number; scrollLeft: number }) => void;
};

type ScrollableRef<TIsGrid extends boolean | undefined> = TIsGrid extends true
  ? GridScrollableRef
  : ListScrollableRef;

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
  TProps extends ListScrollerProps | GridScrollerProps
>({ children, throttleTime = 10, isGrid }: TProps): ReactNode {
  const ref = useRef<ScrollableRef<TProps['isGrid']>>();
  const outerRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = pageOffset(outerRef);

      const scrollTop = getScrollPosition('y') - offsetTop;
      const scrollLeft = getScrollPosition('x') - offsetLeft;

      if (isGrid) {
        (ref.current as ScrollableRef<typeof isGrid>)?.scrollTo({
          scrollLeft,
          scrollTop
        });
      } else {
        (ref.current as ScrollableRef<typeof isGrid>)?.scrollTo(scrollTop);
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
    onScroll
  });
}
