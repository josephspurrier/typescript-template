export interface ElementAttrs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
}

export const React = {
  Fragment: function (attrs: { children: HTMLElement[] }): HTMLElement[] {
    return attrs.children;
  },
  createElement: function (
    tag:
      | string
      | ((attrs: ElementAttrs, ...children: HTMLElement[]) => HTMLElement),
    attrs: ElementAttrs,
    ...children: HTMLElement[]
  ): HTMLElement {
    // Support functions (closures).
    if (typeof tag === 'function') {
      return tag({ ...attrs, children: children });
    }

    // Create the element.
    const elem = document.createElement(tag);

    // Apply the attributes and event listeners.
    Object.entries(attrs || {}).forEach(([name, value]) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!attrs.hasOwnProperty(name)) {
        // Skip properties that are inherited.
      } else if (name.startsWith('on') && name.toLowerCase() in window) {
        // Add event listeners for those that are available in the window.
        elem.addEventListener(name.toLowerCase().substr(2), value);
      } else if (value === true) {
        // Add attributes that are boolean so they don't have a value, only a name.
        elem.setAttribute(name, '');
      } else if (value === false || value === null || value === undefined) {
        // Skip attributes that are: false, null, undefined.
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        elem.setAttribute(name, value.toString());
      }
    });

    const appendChild = (parent: HTMLElement, child: HTMLElement) => {
      if (Array.isArray(child))
        child.forEach((nestedChild) => appendChild(parent, nestedChild));
      else
        parent.appendChild(
          child.nodeType ? child : document.createTextNode(child.toString()),
        );
    };

    children.forEach((child) => {
      appendChild(elem, child);
    });

    return elem;
  },
};

// *****************************************************************************
// *****************************************************************************

export const render = (
  parent: HTMLElement,
  child: string | (() => JSX.Element),
  replace = false,
): void => {
  if (typeof child === 'function') {
    const childElem = (child() as unknown) as HTMLDivElement;
    if (replace) {
      parent.replaceWith(childElem);
    } else {
      parent.appendChild(childElem);
    }
    return;
  }

  if (replace) {
    parent.replaceWith(document.createTextNode(child.toString()));
  } else {
    parent.appendChild(document.createTextNode(child.toString()));
  }
};
