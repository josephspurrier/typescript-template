export interface ElementAttrs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [property: string]: any;
}

export const React = {
  Fragment: function ({
    children,
  }: {
    children: HTMLElement[];
  }): HTMLElement[] {
    console.log('fragment:', ...children);
    return children;
  },
  createElement: function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tag: string | ((attrs: any) => HTMLElement),
    attrs: ElementAttrs,
    ...children: HTMLElement[]
  ): HTMLElement {
    let elem: HTMLElement;

    if (typeof tag === 'function') {
      //console.log('children:', children, tag);
      // for (const child of children) {
      //   if (Array.isArray(child)) {
      //     const t = document.createElement
      //     elem.append(...child);
      //   } else {
      //     elem.appendChild(
      //       child.nodeType == null
      //         ? document.createTextNode(child.toString())
      //         : child,
      //     );
      //   }
      // }

      return tag({ ...attrs, children: children });
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

// Test destructuring
const name = 'Joe';
const friends = ['Katrina', 'James', 'Hercules'];
const Hello = ({ username }: { username: string }): JSX.Element => {
  return <div>Hello World: {username}</div>;
};

// Test interface
interface Hello2Attrs {
  username: string;
}
const Hello2 = (attrs: Hello2Attrs): JSX.Element => {
  return <div>Hello World: {attrs.username}</div>;
};

const Empty = (): JSX.Element => {
  return <div>This is a div with no parameters passed in.</div>;
};

interface SingleChildTextAttrs {
  children: string;
}

const SingleChildText = (attrs: SingleChildTextAttrs): JSX.Element => {
  return <div>Here is the child: {attrs.children}</div>;
};

interface SingleChildElementAttrs {
  children: JSX.Element;
}

const SingleChildElement = (attrs: SingleChildElementAttrs): JSX.Element => {
  return <div>Here is the child: {attrs.children}</div>;
};

const Fragments = (): JSX.Element => {
  return (
    <>
      <div>div 1</div>
      <div>div 2</div>
    </>
  );
};

interface FragmentsAttrs {
  left: string;
  right: string;
  children: JSX.Element;
}

const FragmentsAttrs = (attrs: FragmentsAttrs): JSX.Element => {
  return (
    <>
      <div name={attrs.left}>div 10</div>
      {attrs.children}
      <div name={attrs.right}>div 20</div>
    </>
  );
};

// // Create some dom elements
const App = (): JSX.Element => {
  return (
    <div class='app'>
      <Empty></Empty>
      <SingleChildText>baby text</SingleChildText>
      <SingleChildElement>
        <span>
          <span>baby element in double span</span>
        </span>
      </SingleChildElement>
      <Fragments />
      <FragmentsAttrs left='lefty' right='righty'>
        <div>div middle</div>
      </FragmentsAttrs>
      <Hello username='josephspurrier' />
      <Hello2 username='josephspurrier' />
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
