// Store the previous state.
let initialState = {} as JSX.Vnode;
let initialElement: () => JSX.Element;
let rootParent: HTMLElement;

const createElementText = (node: string): Text => {
  return document.createTextNode(node);
};

const stringArray = (value: (JSX.Vnode | string)[]): boolean => {
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
        console.log('caught!');
        z.redraw();
        // }, 1000);
      });
    }
  });
};

const isCustomProp = (name: string) => {
  return isEventProp(name) || name === 'forceUpdate';
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
  child: (string | JSX.Vnode)[] | JSX.Vnode,
) => {
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
    //console.log('node:', node);
    if (Array.isArray(node)) {
      node.forEach(function (item: string[] | JSX.Vnode | JSX.Vnode[]) {
        appendChild(frag, item);
      });
      return frag;
    }
    return createElement(node);
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
    parent.appendChild(createElement(newNode));
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
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
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
  },
  render: (parent: HTMLElement, child: string | (() => JSX.Element)): void => {
    if (typeof child === 'function') {
      rootParent = parent;
      initialElement = child;
    }

    z.redraw();
  },
  redraw: (): void => {
    console.log('called: redraw!');
    globalStateCounter = -1;
    const latestState = (initialElement() as unknown) as JSX.Vnode;
    if (!initialState.tag) {
      console.log('initial state:', latestState);
      initialState = removeFragments(latestState);
      console.log('post clean state:', initialState);
      updateElement(rootParent, initialState);
    } else {
      updateElement(rootParent, removeFragments(latestState), initialState);
      //console.log('output:', latestState, initialState);
    }
  },
  useState: function <T>(v: T): [() => T, (val: T) => void] {
    globalStateCounter++;
    //console.log('setState!', globalStateCounter);
    const localCounter = globalStateCounter;
    if (globalState[localCounter] === undefined) {
      globalState[localCounter] = v;
    }
    return [
      (): T => {
        //console.log('stateRead!', localCounter, globalState[localCounter]);
        return globalState[localCounter] as T;
      },
      (val: T): void => {
        globalState[localCounter] = val;
      },
    ];
  },
};

const globalState = [] as unknown[];
let globalStateCounter = -1;

// Removes any "FRAGMENT" elements from the state to make the dom comparisons
// easier to work with.
const removeFragments = (vn: JSX.Vnode): JSX.Vnode => {
  const cleanChildren = (vn: JSX.Vnode): (string | JSX.Vnode)[] => {
    const rChildren = [] as (string | JSX.Vnode)[];
    vn.children.forEach((element: JSX.Vnode | string) => {
      const vc = element as JSX.Vnode;
      if (vc.tag) {
        if (vc.tag === 'FRAGMENT') {
          rChildren.push(...cleanChildren(vc));
        } else {
          rChildren.push(removeFragments(vc));
        }
      } else {
        rChildren.push(element);
      }
    });

    return rChildren;
  };

  return {
    tag: vn.tag,
    attrs: vn.attrs,
    children: cleanChildren(vn),
  } as JSX.Vnode;
};
