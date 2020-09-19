// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { React, render } from '@/vdom-lib';

// ---------------------------------------------------------------------

// const a = (): JSX.Element => {
//   return (
//     <ul>
//       <li>item 1</li>
//       <li>item 2</li>
//     </ul>
//   );
// };

// const b = (): JSX.Element => {
//   return (
//     <ul>
//       <li>item 1</li>
//       <li>hello!</li>
//     </ul>
//   );
// };

interface ButtonAttr {
  username: string;
}

const CounterButton = (attrs: ButtonAttr): JSX.Element => {
  let counter = 0;
  return (
    <>
      <button
        username={attrs.username}
        onclick={() => {
          console.log(counter++);
        }}
      >
        Increase Counter
      </button>
      <div>Counter: {counter}</div>
    </>
  );
};

// const CounterButton2 = (attrs: ButtonAttr): JSX.Element => {
//   let counter = 0;
//   return (
//     <button
//       username={attrs.username}
//       onclick={() => {
//         console.log(counter--);
//       }}
//     >
//       Increase Counter
//     </button>
//   );
// };

const Simple = () => {
  return <div>simple</div>;
};

const App = (): JSX.Element => {
  let username2 = 'jarrod';
  //const counter = 100;
  return (
    <app>
      <CounterButton username={username2} />
      <div>{counter}</div>
      <CounterButton username={username2} />
      <Simple />
      <button
        onclick={() => {
          console.log('clicked!', counter);
          counter++;
          username2 = 'josephspurrier';
        }}
      >
        Change Username
      </button>
      <div>
        {username2} {counter}
      </div>
    </app>
  );
};

// const App2 = (): JSX.Element => {
//   return (
//     <app>
//       <CounterButton2 username='josephspurrier' />
//       <Simple />
//     </app>
//   );
// };

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

if (root && reload) {
  //updateElement(root, a);
  render(root, App);
  reload.addEventListener('click', () => {
    if (counter === 0) {
      //tempusername = 'jarrod';
      render(root, App, App);
      //updateElement(root, b, a);
      //console.log('final a:', a);
      //console.log('final b:', b);
      counter++;
    } else {
      //render(root, b, b);
      //updateElement(root, b, b);
      //console.log('final a:', a);
      //console.log('final b:', b);
    }
  });
} else {
  console.log('Something is wrong...');
}
