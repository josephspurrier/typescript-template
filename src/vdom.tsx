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

export const React = {
  createElement: (
    tag: string,
    attrs: JSX.ElementAttrs,
    ...children: JSX.Vnode[] | string[]
  ): JSX.Vnode => {
    return { tag, attrs, children };
  },
};

const createElement = (node: string | JSX.Vnode): HTMLElement => {
  if (typeof node === 'string') {
    const $el = document.createElement('span');
    $el.appendChild(document.createTextNode(node));
    return $el;
  }

  const $el = document.createElement(node.tag);

  if (stringArray(node.children)) {
    const c = node.children as string[];
    c.map(createElementText).forEach($el.appendChild.bind($el));
  } else {
    const c = node.children as JSX.Vnode[];
    c.map(createElement).forEach($el.appendChild.bind($el));
  }
  return $el;
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

// ---------------------------------------------------------------------

const a = (): JSX.Element => {
  return (
    <ul>
      <li>item 1</li>
      <li>item 2</li>
    </ul>
  );
};

const b = (): JSX.Element => {
  return (
    <ul>
      <li>item 1</li>
      <li>hello!</li>
    </ul>
  );
};

//const h = React.createElement;

//const a = h('div', {}, h('span', {}, 'joe'));
// const a = h('ul', {}, h('li', {}, 'item 1'), h('li', {}, 'item 2'));
// const b = h('ul', {}, h('li', {}, 'item 1'), h('li', {}, 'hello'));

{
  /* <button id="reload">RELOAD</button>
<div id="root"></div> */
}

let counter = 0;

const button = document.createElement('button');
button.setAttribute('id', 'reload');
button.textContent = 'Reload';
document.body.appendChild(button);

const rootElem = document.createElement('div');
rootElem.setAttribute('id', 'root');
document.body.appendChild(rootElem);

const root = document.getElementById('root');
const reload = document.getElementById('reload');

const render = (
  parent: HTMLElement,
  child: string | (() => JSX.Element),
  oldchild?: string | (() => JSX.Element),
  replace = false,
) => {
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
};

if (root && reload) {
  //updateElement(root, a);
  render(root, a);
  reload.addEventListener('click', () => {
    if (counter === 0) {
      render(root, b, a);
      //updateElement(root, b, a);
      //console.log('final a:', a);
      //console.log('final b:', b);
      counter++;
    } else {
      render(root, b, b);
      //updateElement(root, b, b);
      //console.log('final a:', a);
      //console.log('final b:', b);
    }
  });
} else {
  console.log('Something is wrong...');
}
