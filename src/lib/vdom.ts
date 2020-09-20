import { createElementText, createFragment } from '@/lib/vnode';
import { removeFragments } from '@/lib/fragment';
import { resetStateCounter } from '@/lib/state';
import { updateAttrs } from '@/lib/attrs';
import { z } from '@/lib/z';

export const redraw = (): void => {
  resetStateCounter();

  const rawDesiredState = (z.state.generateRawState() as unknown) as JSX.Vnode;
  if (!z.state.currentState.tag) {
    z.state.currentState = removeFragments(rawDesiredState);
    updateElement(z.state.rootParent, z.state.currentState);
  } else {
    const desiredState = removeFragments(rawDesiredState);
    updateElement(z.state.rootParent, desiredState, z.state.currentState);
    z.state.currentState = desiredState;
  }
};

// Accepts either a Vnode or a string and makes the changes on the DOM.
const updateElement = function (
  parent: Node,
  newNode: JSX.Vnode | string,
  oldNode?: JSX.Vnode | string,
  index = 0,
) {
  if (oldNode === undefined) {
    if (typeof newNode === 'string') {
      parent.appendChild(createElementText(newNode));
      return;
    }
    parent.appendChild(createFragment(newNode));
  } else if (newNode === undefined) {
    parent.removeChild(parent.childNodes[index]);
  } else if (
    (typeof newNode === 'string' && typeof oldNode === 'string') ||
    (typeof newNode === 'number' && typeof oldNode === 'number')
  ) {
    if (newNode !== oldNode) {
      if (parent) {
        parent.replaceChild(
          createElementText(newNode),
          parent.childNodes[index],
        );
      } else {
        console.log('skipped:', typeof newNode);
      }
    }
  } else if (changed(newNode, oldNode)) {
    if (typeof newNode === 'string') {
      parent.replaceChild(createElementText(newNode), parent.childNodes[index]);
    } else {
      parent.replaceChild(createFragment(newNode), parent.childNodes[index]);
    }
  } else if ((newNode as JSX.Vnode) && (oldNode as JSX.Vnode)) {
    const newVnode = newNode as JSX.Vnode;
    const oldVnode = oldNode as JSX.Vnode;

    updateAttrs(parent.childNodes[index], newVnode.attrs, oldVnode.attrs);
    const newLength = newVnode.children.length;
    const oldLength = oldVnode.children.length;

    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        parent.childNodes[index],
        newVnode.children[i],
        oldVnode.children[i],
        i,
      );
    }
  } else {
    // FIXME: This is probably a number, should probably not be a number;
    //updateElement(parent, newNode, oldNode);
    console.log('Node:', parent, oldNode, newNode);
  }
};

// FIXME: This currently only looks at tag and not attributes, etc.
const changed = function (
  node1: JSX.Vnode | string,
  node2: JSX.Vnode | string,
) {
  //console.log('changed text?', node1, node2);
  if (typeof node1 !== typeof node2) {
    return true;
  } else if (
    (node1 as JSX.Vnode) &&
    (node1 as JSX.Vnode).attrs &&
    (node1 as JSX.Vnode).attrs.forceUpdate
  ) {
    return true;
  } else if (typeof node1 === 'string' && node1 !== node2) {
    return true;
  } else if (typeof node1 !== 'string' && typeof node2 !== 'string') {
    if (node1.tag !== node2.tag) {
      return true;
    }
    return false;
  }

  return false;
};

const isStringArray = (value: (JSX.Vnode | string)[]): boolean => {
  if (Array.isArray(value)) {
    let notString = true;
    value.forEach(function (item: unknown) {
      if (typeof item !== 'string') {
        notString = false;
      }
    });
    return notString;
  }

  return false;
};

export const appendChild = (
  parent: HTMLElement | DocumentFragment,
  child: (string | JSX.Vnode)[] | JSX.Vnode,
): void => {
  if (Array.isArray(child)) {
    if (isStringArray(child)) {
      (child as string[]).forEach((nestedChild: string) => {
        parent.appendChild(document.createTextNode(nestedChild.toString()));
      });
    } else {
      (child as JSX.Vnode[]).forEach((nestedChild) =>
        appendChild(parent, nestedChild),
      );
    }
  } else {
    parent.appendChild(createFragment(child));
  }
};
