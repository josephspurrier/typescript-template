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

const Empty = (): JSX.Element => {
  return <div>This is a div without attributes or children.</div>;
};

const Destructuring = ({ username }: { username: string }): JSX.Element => {
  return <div>Destructuring should show foo: {username}</div>;
};

interface InterfacingAttrs {
  username: string;
}
const Interfacing = (attrs: InterfacingAttrs): JSX.Element => {
  return <div>Interfacing should show bar: {attrs.username}</div>;
};

interface SingleChildStringAttrs {
  children: string;
}

const SingleChildText = (attrs: SingleChildStringAttrs): JSX.Element => {
  return <div>Child should be Saturn: {attrs.children}</div>;
};

interface NestedChildElementAttrs {
  children: JSX.Element;
}

const NestedChildElement = (attrs: NestedChildElementAttrs): JSX.Element => {
  return (
    <div>
      Child below should be Mars in a {`<div>`} and {`<span>`}: {attrs.children}
    </div>
  );
};

const TwoFragments = (): JSX.Element => {
  return (
    <>
      <div>This is fragment A.</div>
      <div>This is fragment B.</div>
    </>
  );
};

interface FragmentsAttrs {
  num1: string;
  num2: string;
  children: JSX.Element | string;
}

const FragmentChild = (attrs: FragmentsAttrs): JSX.Element => {
  return (
    <>
      <div name={attrs.num1}>div {attrs.num1}</div>
      {attrs.children}
      <div name={attrs.num2}>div {attrs.num2}</div>
    </>
  );
};

interface RequiredAttrs {
  required: boolean;
}

const RequiredTrue = (attrs: RequiredAttrs): JSX.Element => {
  return (
    <div required={attrs.required}>
      This is a div with a required attribute that should be set (true).
    </div>
  );
};
const RequiredFalse = (attrs: RequiredAttrs): JSX.Element => {
  return (
    <div required={attrs.required}>
      This is a div with a required attribute that is not set (false).
    </div>
  );
};

const firstname = 'User';
const alphabet = ['Alpha', 'Bravo', 'Charlie'];

let counter = 0;

// // Create some dom elements
const App = (): JSX.Element => {
  return (
    <div class='app'>
      <p>Welcome back, {firstname}.</p>

      <Empty></Empty>
      <Destructuring username='foo' />
      <Interfacing username='bar' />

      <SingleChildText>Saturn</SingleChildText>

      <NestedChildElement>
        <div>
          <span>Mars</span>
        </div>
      </NestedChildElement>

      <TwoFragments />

      <FragmentChild num1='10A' num2='10B'>
        <div>Text should be in a div.</div>
      </FragmentChild>

      <FragmentChild num1='20A' num2='20B'>
        Text is not in a div.
      </FragmentChild>

      <hr />

      <RequiredTrue required={true} />
      <RequiredFalse required={false} />

      <hr />

      <button
        onclick={(e: MouseEvent) => {
          console.log('Counter should increase on each click:', counter++);
          console.log('Should show MouseEvent:', e);
        }}
      >
        Click to show Console Message
      </button>
      <p>
        <strong>Below are list items from an array:</strong>
      </p>
      <ul>
        {alphabet.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
};

const render = (
  parent: HTMLElement,
  child: string | (() => JSX.Element),
  replace = false,
) => {
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

render(document.body, App);
