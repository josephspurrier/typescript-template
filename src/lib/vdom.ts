import { createElementText, createFragment } from '@/lib/vnode';
import { removeFragments } from '@/lib/fragment';
import { resetStateCounter } from '@/lib/state';
import { updateProps } from '@/lib/attrs';
import { stringArray } from '@/lib/helper';
import { z } from '@/lib/z';

export const redraw = (): void => {
  console.log('called: redraw!');
  resetStateCounter();

  const rawDesiredState = (z.state.generateRawState() as unknown) as JSX.Vnode;
  if (!z.state.currentState.tag) {
    console.log('initial state:', rawDesiredState);
    z.state.currentState = removeFragments(rawDesiredState);
    console.log('post clean state:', z.state.currentState);
    updateElement(z.state.rootParent, z.state.currentState);
  } else {
    const desiredState = removeFragments(rawDesiredState);
    updateElement(z.state.rootParent, desiredState, z.state.currentState);
    z.state.currentState = desiredState;
    //console.log('output:', latestState, initialState);
  }
};

// Accepts either a Vnode or a string and makes the changes on the DOM.
const updateElement = function (
  parent: Node,
  newNode: JSX.Vnode | string,
  oldNode?: JSX.Vnode | string,
  index = 0,
) {
  //console.log('here?', newNode, oldNode);
  if (oldNode === undefined) {
    //parent.appendChild(createElementText(newNode));
    // console.log('element changed 0');
    // console.log('element changed - newNode:', newNode);
    // console.log('element changed - oldNode:', oldNode);
    if (typeof newNode === 'string') {
      //console.log('found it3:', newNode);
      parent.appendChild(createElementText(newNode));
      return;
    }

    //console.log('found it4:', newNode);
    parent.appendChild(createFragment(newNode));
  } else if (newNode === undefined) {
    parent.removeChild(parent.childNodes[index]);
  } else if (
    (typeof newNode === 'string' && typeof oldNode === 'string') ||
    (typeof newNode === 'number' && typeof oldNode === 'number')
  ) {
    //console.log('found it5:', newNode, oldNode, parent, index);
    if (newNode !== oldNode) {
      //console.log('found it2:', newNode, oldNode, parent);
      //updateElement(parent, newNode, oldNode);
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
    //console.log('element changed 1:', newNode, oldNode);
    if (typeof newNode === 'string') {
      parent.replaceChild(createElementText(newNode), parent.childNodes[index]);
    } else {
      //console.log('found it:', newNode);
      parent.replaceChild(createFragment(newNode), parent.childNodes[index]);
    }
  } else if ((newNode as JSX.Vnode) && (oldNode as JSX.Vnode)) {
    const newVnode = newNode as JSX.Vnode;
    const oldVnode = oldNode as JSX.Vnode;
    // console.log(
    //   'Fragment?',
    //   newVnode.tag,
    //   oldVnode.tag,
    //   parent,
    //   parent.childNodes,
    // );

    // if (newVnode.tag === 'FRAGMENT') {
    //   updateElement(parent, newVnode, oldVnode, 0);
    //   return;
    // }
    //console.log('before error:', newVnode, oldVnode);
    updateProps(parent.childNodes[index], newVnode.attrs, oldVnode.attrs);
    const newLength = newVnode.children.length;
    const oldLength = oldVnode.children.length;

    // console.log(
    //   'parent check:',
    //   parent.childNodes[index],
    //   index,
    //   parent.childNodes,
    // );

    for (let i = 0; i < newLength || i < oldLength; i++) {
      // console.log(
      //   'new node:',
      //   newVnode.children[i],
      //   '| old node:',
      //   oldVnode.children[i],
      //   // '| will attach to this parent:',
      //   // parent,
      //   '| at this location:',
      //   parent.childNodes[index],
      //   '| on this index:',
      //   i,
      // );
      updateElement(
        parent.childNodes[index],
        newVnode.children[i],
        oldVnode.children[i],
        i,
      );
      //}
    }
  } else {
    // FIXME: This is probably a number, should probably not be a number;
    //updateElement(parent, newNode, oldNode);
    console.log('Node:', parent, oldNode, newNode);
    // parent.replaceChild(
    //   createElementText(newNode.toString()),
    //   createElementText(oldNode.toString()),
    // );
    //console.log('skipped', newNode, oldNode);
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

export const appendChild = (
  parent: HTMLElement | DocumentFragment,
  child: (string | JSX.Vnode)[] | JSX.Vnode,
): void => {
  if (Array.isArray(child)) {
    if (stringArray(child)) {
      (child as string[]).forEach((nestedChild: string) => {
        //console.log('string?', nestedChild.toString());
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
