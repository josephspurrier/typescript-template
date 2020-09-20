import { redraw } from '@/lib/vdom';
import { z } from '@/lib/z';

export const render = (
  parent: HTMLElement,
  child: string | (() => JSX.Element),
): void => {
  if (typeof child === 'function') {
    z.state.rootParent = parent;
    z.state.generateRawState = child;
  }

  redraw();
};
