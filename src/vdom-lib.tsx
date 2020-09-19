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
  // Skip properties that are inherited.
  if (name.startsWith('on') && name.toLowerCase() in window) {
    // Add event listeners for those that are available in the window.
    elem.addEventListener(name.toLowerCase().substr(2), value);
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

// const isCustomProp = (name: string) => {
//   console.log(name);
//   return false;
// };

const updateProp = (
  elem: Node,
  name: string,
  newVal: unknown,
  oldVal: unknown,
): void => {
  console.log('update prop:', name, oldVal, newVal);
  if (!newVal) {
    removeProp(elem, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp(elem, name, newVal);
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
  /*if (isCustomProp(name)) {
    return;
  } else */

  console.log('remove prop:', name);
  if (name === 'className') {
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
    oldchild?: string | (() => JSX.Element),
    replace = false,
  ): void => {
    if (typeof child === 'function') {
      const childElem = (child() as unknown) as JSX.Vnode;

      if (replace) {
        //parent.replaceWith(childElem);
      } else {
        if (oldchild && typeof oldchild === 'function') {
          const oldchildElem = (oldchild() as unknown) as JSX.Vnode;
          updateElement(parent, childElem, oldchildElem);
          return;
        }
        updateElement(parent, childElem);
        //parent.appendChild(childElem);
      }
      return;
    }

    if (replace) {
      //parent.replaceWith(document.createTextNode(child.toString()));
    } else {
      //parent.appendChild(document.createTextNode(child.toString()));
      //updateElement(parent, childElem);
    }
  },
};

const appendChild = (
  parent: HTMLElement | DocumentFragment,
  child: string[] | JSX.Vnode | JSX.Vnode[],
) => {
  if (Array.isArray(child))
    if (stringArray(child)) {
      (child as string[]).forEach((nestedChild: string) =>
        parent.appendChild(document.createTextNode(nestedChild.toString())),
      );
    } else {
      (child as JSX.Vnode[]).forEach((nestedChild) =>
        appendChild(parent, nestedChild),
      );
    }
  else {
    parent.appendChild(createElement(child));
  }
};

const createElement = (node: string | JSX.Vnode): Node => {
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

    // TODO: Determine why one article suggested to use:
    // elem.appendChild.bind(elem)
    appendChild(elem, vnode.children);
    frag.appendChild(elem);
    return frag;
  }

  frag.appendChild(document.createTextNode(node.toString()));
  return frag;
};

// FIXME: This currently only looks at tag and not attributes, etc.
const changed = function (
  node1: JSX.Vnode | string,
  node2: JSX.Vnode | string,
) {
  if (typeof node1 !== typeof node2) {
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

const updateElement = function (
  parent: Node,
  newNode: JSX.Vnode | string,
  oldNode?: JSX.Vnode | string,
  index = 0,
) {
  if (!oldNode) {
    if (typeof newNode === 'string') {
      parent.appendChild(createElementText(newNode));
    } else {
      parent.appendChild(createElement(newNode));
    }
  } else if (!newNode) {
    parent.removeChild(parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    if (typeof newNode === 'string') {
      parent.replaceChild(createElementText(newNode), parent.childNodes[index]);
    } else {
      parent.replaceChild(createElement(newNode), parent.childNodes[index]);
    }
  } else if (typeof newNode !== 'string' && typeof oldNode !== 'string') {
    updateProps(parent.childNodes[index], newNode.attrs, oldNode.attrs);
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement(
        parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i,
      );
    }
  }
};
