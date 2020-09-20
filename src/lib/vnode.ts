import { appendChild } from '@/lib/vdom';
import { addEventListeners, setProps } from '@/lib/attrs';

export const createVnode = (
  tag:
    | string
    | ((attrs: JSX.ElementAttrs, ...children: HTMLElement[]) => JSX.Vnode),
  attrs: JSX.ElementAttrs,
  ...children: JSX.Vnode[]
): JSX.Vnode => {
  //console.log('actual:', { tag, attrs: attrs || {}, children });
  const getChildren = (arr: JSX.Vnode[]): JSX.Vnode[] => {
    let r: JSX.Vnode[] = [];

    arr.forEach((element) => {
      if (Array.isArray(element)) {
        r = [...r, ...getChildren(element)];
      } else {
        r.push(element);
      }
    });

    return r;
  };

  if (typeof tag === 'string') {
    return { tag, attrs: attrs || {}, children: getChildren(children) };
  }

  const node = tag({ ...attrs, children: getChildren(children) });

  if (Array.isArray(node)) {
    return {
      tag: 'FRAGMENT',
      attrs: attrs || {},
      children: getChildren(node),
    };
  }
  return node;
};

export const createElementText = (node: string): Text => {
  return document.createTextNode(node);
};

export const createFragment = (node: string | JSX.Vnode): DocumentFragment => {
  const frag = document.createDocumentFragment();

  // Support functions (closures).
  const vnode = node as JSX.Vnode;
  const f = vnode.tag as (
    attrs: JSX.ElementAttrs,
    ...children: HTMLElement[]
  ) => JSX.Vnode;
  if (typeof f === 'function') {
    node = f({ ...vnode.attrs, children: vnode.children });
    //console.log('node:', node);
    if (Array.isArray(node)) {
      node.forEach(function (item: string[] | JSX.Vnode | JSX.Vnode[]) {
        appendChild(frag, item);
      });
      return frag;
    }
    return createFragment(node);
  }

  if (vnode && typeof vnode.tag === 'string') {
    if (vnode.tag === 'FRAGMENT') {
      appendChild(frag, vnode.children);
      //setProps(frag, vnode.attrs);
      //addEventListeners(frag, vnode.attrs);
    } else {
      const elem = document.createElement(vnode.tag);
      setProps(elem, vnode.attrs);
      addEventListeners(elem, vnode.attrs);
      // TODO: Determine why one article suggested to use:
      // elem.appendChild.bind(elem)
      appendChild(elem, vnode.children);
      frag.appendChild(elem);
    }

    return frag;
  }

  //console.log('string2?', node.toString());
  frag.appendChild(document.createTextNode(node.toString()));
  return frag;
};
