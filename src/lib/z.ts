import { render } from '@/lib/render';
import { useState } from '@/lib/state';
import { createVnode } from '@/lib/vnode';
import { createFragment } from '@/lib/fragment';
import { redraw } from '@/lib/vdom';
import { route } from '@/lib/router';

export const z = {
  state: {
    // Root element where Vnodes are rendered.
    rootParent: {} as HTMLElement,
    // Current state of the Vnode data.
    currentState: {} as JSX.Vnode,
    // Generate the new state.
    generateRawState: {} as () => JSX.Element,
    // Storage for local variables.
    globalState: [] as unknown[],
    // Counter for local variables.
    globalStateCounter: -1,
    // Router state.
    routerActive: false,
    // Router prefix.
    routerPrefix: '#',
  },
  fragment: createFragment,
  createElement: createVnode,
  render: render,
  redraw: redraw,
  useState: useState,
  route: route,
};
