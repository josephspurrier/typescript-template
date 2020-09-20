import { redraw } from '@/lib/vdom';

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

export const setProps = (elem: HTMLElement, attrs: JSX.ElementAttrs): void => {
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

export const addEventListeners = (
  elem: HTMLElement,
  attrs: JSX.ElementAttrs,
): void => {
  Object.keys(attrs).forEach((name) => {
    if (isEventProp(name)) {
      elem.addEventListener(extractEventName(name), attrs[name]);
      elem.addEventListener(extractEventName(name), () => {
        // setTimeout(() => {
        console.log('caught!');
        redraw();
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

export const updateProps = (
  elem: Node,
  newProps: JSX.ElementAttrs,
  oldProps: JSX.ElementAttrs = {},
): void => {
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
