// Store the previous state.
let initialState = {} as JSX.Vnode;
let initialElement: () => JSX.Element;
//let firstRun = false;
//let currentState = {} as JSX.Vnode;
let rootParent: HTMLElement;

const createElementText = (node: string): Text => {
  return document.createTextNode(node);
};

const stringArray = (value: string[] | JSX.Vnode[]): boolean => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setProp = (elem: Node, name: string, value: any): void => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    (elem as HTMLElement).setAttribute('class', value);
  } else if (value === true) {
    // Add attributes that are boolean so they don't have a value, only a name.
    (elem as HTMLElement).setAttribute(name, '');
  } else if (value === false || value === null || value === undefined) {
    // Skip attributes that are: false, null, undefined.
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    (elem as HTMLElement).setAttribute(name, value.toString());
  }
};

const setProps = (elem: HTMLElement, attrs: JSX.ElementAttrs) => {
  Object.keys(attrs).forEach((name) => {
    // eslint-disable-next-line no-prototype-builtins
    if (attrs.hasOwnProperty(name)) {
      setProp(elem, name, attrs[name]);
    }
  });
};

const removeBooleanProp = (elem: HTMLElement, name: string) => {
  elem.removeAttribute(name);
  //elem[name] = false;
};

const isEventProp = (name: string) => {
  return /^on/.test(name);
};

const extractEventName = (name: string) => {
  return name.slice(2).toLowerCase();
};

const addEventListeners = (elem: HTMLElement, attrs: JSX.ElementAttrs) => {
  Object.keys(attrs).forEach((name) => {
    if (isEventProp(name)) {
      elem.addEventListener(extractEventName(name), attrs[name]);
      elem.addEventListener(extractEventName(name), () => {
        // setTimeout(() => {

        // }, 1000);
        console.log('caught!');
        z.redraw();
      });
    }
  });
};

const isCustomProp = (name: string) => {
  return isEventProp(name) || name === 'forceUpdate';
  // if (name.startsWith('on') && name.toLowerCase() in window) {
  //   // Add event listeners for those that are available in the window.
  //   elem.addEventListener(name.toLowerCase().substr(2), value);
  //   elem.addEventListener(name.toLowerCase().substr(2), () => {
  //     // setTimeout(() => {

  //     // }, 1000);
  //     console.log('caught!');
  //     redraw();
  //   });
  console.log(name);
  return false;
};

const updateProp = (
  elem: Node,
  name: string,
  newVal: unknown,
  oldVal: unknown,
): void => {
  if (!newVal) {
    //console.log('remove prop:', name);
    removeProp(elem, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    // console.log('update prop:', name);
    // console.log('update prop - old:', oldVal);
    // console.log('update prop - new:', newVal);
    setProp(elem, name, newVal);
  } else {
    //console.log('skip prop:', name);
  }
};

const updateProps = (
  elem: Node,
  newProps: JSX.ElementAttrs,
  oldProps: JSX.ElementAttrs = {},
) => {
  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach((name) => {
    updateProp(elem, name, newProps[name], oldProps[name]);
  });
};

const removeProp = (elem: Node, name: string, value: unknown) => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    (elem as HTMLElement).removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp(elem as HTMLElement, name);
  } else {
    (elem as HTMLElement).removeAttribute(name);
  }
};

interface FragmentAttrs {
  children: JSX.Vnode[];
}

const appendChild = (
  parent: HTMLElement | DocumentFragment,
  child: string[] | JSX.Vnode | JSX.Vnode[],
) => {
  if (Array.isArray(child))
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
  else {
    parent.appendChild(createElement(child));
  }
};

const createElement = (node: string | JSX.Vnode): DocumentFragment => {
  const frag = document.createDocumentFragment();

  // Support functions (closures).
  const vnode = node as JSX.Vnode;
  const f = vnode.tag as (
    attrs: JSX.ElementAttrs,
    ...children: HTMLElement[]
  ) => JSX.Vnode;
  if (typeof f === 'function') {
    node = f({ ...vnode.attrs, children: vnode.children });
    if (Array.isArray(node)) {
      node.forEach(function (item: string[] | JSX.Vnode | JSX.Vnode[]) {
        appendChild(frag, item);
      });
      return frag;
    }
    return createElement(node);
  }

  if (vnode && typeof vnode.tag === 'string') {
    const elem = document.createElement(vnode.tag);
    setProps(elem, vnode.attrs);
    addEventListeners(elem, vnode.attrs);

    // TODO: Determine why one article suggested to use:
    // elem.appendChild.bind(elem)
    appendChild(elem, vnode.children);
    frag.appendChild(elem);
    return frag;
  }

  //console.log('string2?', node.toString());
  frag.appendChild(document.createTextNode(node.toString()));
  return frag;
};

// FIXME: This currently only looks at tag and not attributes, etc.
const changed = function (
  node1: JSX.Vnode | string,
  node2: JSX.Vnode | string,
) {
  //console.log('changed text?', node1, node2);
  if (typeof node1 !== typeof node2) {
    return true;
  } else if (typeof node1 === 'string' && node1 !== node2) {
    return true;
  } else if (typeof node1 !== 'string' && typeof node2 !== 'string') {
    if (node1.tag !== node2.tag) {
      return true;
    }
    return false;
  } else if ((node1 as JSX.Vnode) && (node1 as JSX.Vnode).attrs.forceUpdate) {
    console.log('whoops');
    return true;
  }

  return false;
};

const updateElement = function (
  parent: Node,
  newNode: JSX.Vnode | string,
  oldNode?: JSX.Vnode | string,
  index = 0,
) {
  //console.log('here?', newNode);
  if (oldNode === undefined) {
    // console.log('element changed 0');
    // console.log('element changed - newNode:', newNode);
    // console.log('element changed - oldNode:', oldNode);
    if (typeof newNode === 'string') {
      //console.log('found it3:', newNode);
      parent.appendChild(createElementText(newNode));
    } else {
      //console.log('found it4:', newNode);
      parent.appendChild(createElement(newNode));
    }
  } else if (newNode === undefined) {
    parent.removeChild(parent.childNodes[index]);
  } else if (
    (typeof newNode === 'string' && typeof oldNode === 'string') ||
    (typeof newNode === 'number' && typeof oldNode === 'number')
  ) {
    //console.log('found it5:', newNode);
    if (newNode !== oldNode) {
      //console.log('found it2:', newNode, oldNode, parent);
      //updateElement(parent, newNode, oldNode);
      parent.replaceChild(createElementText(newNode), parent.childNodes[index]);
    }
  } else if (changed(newNode, oldNode)) {
    //console.log('element changed 1:', newNode);
    if (typeof newNode === 'string') {
      parent.replaceChild(createElementText(newNode), parent.childNodes[index]);
    } else {
      //console.log('found it:', newNode);
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
  } else if ((newNode as JSX.Vnode) && (oldNode as JSX.Vnode)) {
    const newVnode = newNode as JSX.Vnode;
    const oldVnode = oldNode as JSX.Vnode;
    //console.log('before error:', newVnode, oldVnode);
    updateProps(parent.childNodes[index], newVnode.attrs, oldVnode.attrs);
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
    // parent.replaceChild(
    //   createElementText(newNode.toString()),
    //   createElementText(oldNode.toString()),
    // );
    //console.log('skipped', newNode, oldNode);
  }
};

export const z = {
  fragment: (attrs: FragmentAttrs): JSX.Vnode[] | string[] => {
    return attrs.children;
  },
  createElement: (
    tag:
      | string
      | ((attrs: JSX.ElementAttrs, ...children: HTMLElement[]) => JSX.Vnode),
    attrs: JSX.ElementAttrs,
    ...children: JSX.Vnode[]
  ): JSX.Vnode => {
    //console.log({ tag, attrs: attrs || {}, children });
    return { tag, attrs: attrs || {}, children };
  },
  render: (
    parent: HTMLElement,
    child: string | (() => JSX.Element),
    // oldchild?: string | (() => JSX.Element),
  ): void => {
    if (typeof child === 'function') {
      rootParent = parent;
      initialElement = child;
    }

    z.redraw();
  },
  redraw: (): void => {
    console.log('called: redraw!');
    const latestState = (initialElement() as unknown) as JSX.Vnode;
    if (!initialState.tag) {
      //console.log('initial state!');
      initialState = latestState;
      updateElement(rootParent, latestState);
    } else {
      //console.log('new state!');
      updateElement(rootParent, latestState, initialState);
    }
  },
};
