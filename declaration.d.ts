// Support SCSS files in TypeScript.
// https://medium.com/@thetrevorharmon/how-to-silence-false-sass-warnings-in-react-16d2a7158aff
declare module '*.scss' {
  export const content: { [className: string]: string };
  export default content;
}

declare namespace JSX {
  interface IntrinsicElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [elemName: string]: any;
  }
  interface Element {
    (): HTMLElement;
  }
  interface ElementChildrenAttribute {
    // eslint-disable-next-line @typescript-eslint/ban-types
    children: {}; // specify children name to use
  }
}
