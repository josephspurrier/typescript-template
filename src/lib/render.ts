import { redraw } from '@/lib/vdom';
import { z } from '@/lib/z';

export const render = (
  parent: HTMLElement,
  child: string | (() => JSX.Element),
): void => {
  z.state.rootParent = parent;
  if (typeof child === 'function') {
    z.state.generateRawState = child;
  } else {
    // FIXME: This looks strange and doesn't work so the types are messed up.
    z.state.generateRawState = () => {
      return (z.createElement(
        'div',
        {},
        'Page not found.',
      ) as unknown) as JSX.Element;
    };
  }
  redraw();
};
