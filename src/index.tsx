export interface ElementAttrs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
}

export const React = {
  createElement: function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tag: string | (() => HTMLElement),
    attrs: ElementAttrs,
    ...children: HTMLElement[]
  ): HTMLElement {
    let elem: HTMLElement;

    if (typeof tag === 'function') {
      return tag();
    } else {
      elem = document.createElement(tag);
    }

    // Add attributes
    for (const name in attrs) {
      // eslint-disable-next-line no-prototype-builtins
      if (name && attrs.hasOwnProperty(name)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const v = attrs[name];
        if (v === true) {
          elem.setAttribute(name, name);
        } else if (name === 'onclick') {
          elem.addEventListener('click', v);
        } else if (v !== false && v != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          elem.setAttribute(name, v.toString());
        }
      }
    }

    if (typeof children === 'string' || children instanceof String) {
      elem.appendChild(document.createTextNode(children.toString()));
    } else if (Array.isArray(children)) {
      for (const child of children) {
        if (Array.isArray(child)) {
          elem.append(...child);
        } else {
          elem.appendChild(
            child.nodeType == null
              ? document.createTextNode(child.toString())
              : child,
          );
        }
      }
    } else {
      console.log('Other:', children);
      elem.appendChild(children);
    }

    return elem;
  },
};

// Setup some data
const name = 'Joe';
const friends = ['Katrina', 'James', 'Hercule'];

const Hello = (): JSX.Element => {
  return <div>Hello World</div>;
};

// // Create some dom elements
const App = (): JSX.Element => {
  return (
    <div class='app'>
      <Hello />
      <p>Welcome back, {name}.</p>
      <button
        onclick={(e: MouseEvent) => {
          console.log('clicked:', e.isTrusted);
        }}
      >
        Click Me
      </button>
      <p>
        <strong>Your friends are:</strong>
      </p>
      <ul>
        {friends.map((n) => (
          <li key='name'>{n}</li>
        ))}
      </ul>
    </div>
  );
};

const render = (parent: HTMLElement, child: () => JSX.Element) => {
  const childElem = (child() as unknown) as HTMLDivElement;
  parent.appendChild(childElem);
  // const w = window.document.getElementById('app');
  // parent.replaceWith(childElem);
};

render(document.body, App);
