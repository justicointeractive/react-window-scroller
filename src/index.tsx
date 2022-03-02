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
import { elementPageOffset } from './lib/elementPageOffset';
import { getWindowScrollPosition } from './lib/getScrollPosition';

type CommonChildrenRenderProps<TRef, TOnScrollProps> = {
  ref: MutableRefObject<TRef | null>;
  outerRef: MutableRefObject<HTMLElement | undefined>;
  style: React.CSSProperties;
  onScroll: (ev: TOnScrollProps) => any;
};

type ScrollerProps<TIsGrid extends boolean, TIsVariable extends boolean> = {
  children: (
    renderProps: CommonChildrenRenderProps<
      ScrollableRef<TIsGrid, TIsVariable>,
      ScrollProps<TIsGrid>
    >
  ) => JSX.Element;
  throttleTime?: number;
  isGrid?: TIsGrid;
  isVariable?: TIsVariable;
};

type ScrollProps<TIsGrid extends boolean> = TIsGrid extends true
  ? GridOnScrollProps
  : ListOnScrollProps;

type ScrollableRef<
  TIsGrid extends boolean,
  TIsVariable extends boolean
> = TIsGrid extends true
  ? TIsVariable extends true
    ? VariableSizeGrid
    : FixedSizeGrid
  : TIsVariable extends true
  ? VariableSizeList
  : FixedSizeList;

export function ReactWindowScroller<
  TIsGrid extends boolean,
  TIsVariable extends boolean
>({
  children,
  throttleTime = 10,
  isGrid,
  isVariable
}: ScrollerProps<TIsGrid, TIsVariable>): JSX.Element {
  const ref = useRef<ScrollableRef<TIsGrid, TIsVariable>>(null);
  const outerRef = useRef<HTMLElement>();

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const { offsetTop = 0, offsetLeft = 0 } = elementPageOffset(outerRef);

      const scrollTop = getWindowScrollPosition('y') - offsetTop;
      const scrollLeft = getWindowScrollPosition('x') - offsetLeft;

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

  const onScroll = useCallback<(ev: ScrollProps<TIsGrid>) => any>(
    (scrollProps) => {
      const { scrollUpdateWasRequested } = scrollProps;

      if (!scrollUpdateWasRequested) return;

      const top = getWindowScrollPosition('y');
      const left = getWindowScrollPosition('x');
      const { offsetTop = 0, offsetLeft = 0 } = elementPageOffset(outerRef);

      if (isGrid) {
        let { scrollLeft, scrollTop } = scrollProps as GridOnScrollProps;

        scrollTop += Math.min(top, offsetTop);
        scrollLeft += Math.min(left, offsetLeft);

        if (scrollTop !== top || scrollLeft !== left) {
          window.scrollTo(scrollLeft, scrollTop);
        }
      } else {
        let { scrollOffset } = scrollProps as ListOnScrollProps;

        scrollOffset += Math.min(top, offsetTop);

        if (scrollOffset !== top) {
          window.scrollTo(0, scrollOffset);
        }
      }
    },
    [isGrid]
  );

  return children({
    ref,
    outerRef,
    style: {
      width: isGrid ? 'auto' : '100%',
      height: '100%',
      display: 'inline-block'
    },
    onScroll
  });
}
