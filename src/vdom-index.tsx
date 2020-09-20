//import { Empty } from '@/vdom-empty';
import { z } from '@/vdom-lib';

// const Destructuring = ({ username }: { username: string }): JSX.Element => {
//   return <div>Destructuring should show foo: {username}</div>;
// };

// interface InterfacingAttrs {
//   username: string;
// }
// const Interfacing = (attrs: InterfacingAttrs): JSX.Element => {
//   return <div>Interfacing should show bar: {attrs.username}</div>;
// };

// interface SingleChildStringAttrs {
//   children: string;
// }

// const SingleChildText = (attrs: SingleChildStringAttrs): JSX.Element => {
//   return <div>Child should be Saturn: {attrs.children}</div>;
// };

// interface NestedChildElementAttrs {
//   children: JSX.Element;
// }

// const NestedChildElement = (attrs: NestedChildElementAttrs): JSX.Element => {
//   return (
//     <div>
//       Child below should be Mars in a {`<div>`} and {`<span>`}: {attrs.children}
//     </div>
//   );
// };

// const TwoFragments = (): JSX.Element => {
//   return (
//     <>
//       <div>This is fragment A.</div>
//       <div>This is fragment B.</div>
//     </>
//   );
// };

// interface FragmentsAttrs {
//   num1: string;
//   num2: string;
//   children: JSX.Element | string;
// }

// const FragmentChild = (attrs: FragmentsAttrs): JSX.Element => {
//   return (
//     <>
//       <div name={attrs.num1}>div {attrs.num1}</div>
//       {attrs.children}
//       <div name={attrs.num2}>div {attrs.num2}</div>
//     </>
//   );
// };

// interface RequiredAttrs {
//   required: boolean;
// }

// const RequiredTrue = (attrs: RequiredAttrs): JSX.Element => {
//   return (
//     <div required={attrs.required}>
//       This is a div with a required attribute that should be set (true).
//     </div>
//   );
// };
// const RequiredFalse = (attrs: RequiredAttrs): JSX.Element => {
//   return (
//     <div required={attrs.required}>
//       This is a div with a required attribute that is not set (false).
//     </div>
//   );
// };

// const firstname = 'User';
// const alphabet = ['Alpha', 'Bravo', 'Charlie'];

let globalCounter = 0;

// // Create some dom elements
const App = (): JSX.Element => {
  const [count, setCount] = z.useState(0);
  const [count2, setCount2] = z.useState(5);
  return (
    <div class='app'>
      {/* <p>Welcome back, {firstname}.</p>

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

      <hr /> */}

      <button
        onclick={(e: MouseEvent) => {
          //setTimeout(() => {
          console.log(
            'Global counter should increase on each click:',
            globalCounter++,
          );
          setCount(count() + 1);
          console.log('Local counter should increase on each click:', count);
          console.log('Should show MouseEvent:', e);
          //z.redraw();
          //}, 1000);
        }}
      >
        Click to show Console Message
      </button>
      <button
        onclick={() => {
          setCount2(count2() + 1);
        }}
      >
        Click to increase 2nd one
      </button>
      <div>
        Global counter: {globalCounter} (unfortunately, this won't update on
        click)
      </div>
      <div>
        Local counter: {count()} (unfortunately, this won't update on click)
      </div>
      <div>Local counter2: {count2()}</div>
      {/* <p>
        <strong>Below are list items from an array:</strong>
      </p>
      <ul>
        {alphabet.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul> */}
    </div>
  );
};

//z.render(document.body, App);

//const counter = 0;

// const button = document.createElement('button');
// button.setAttribute('id', 'reload');
// button.textContent = 'Reload';
// document.body.appendChild(button);

const rootElem = document.createElement('div');
rootElem.setAttribute('id', 'root');
document.body.appendChild(rootElem);

const root = document.getElementById('root');
//const reload = document.getElementById('reload');

if (root) {
  //updateElement(root, a);
  z.render(root, App);
  //   reload.addEventListener('click', () => {
  //     if (counter === 0) {
  //       //tempusername = 'jarrod';
  //       z.render(root, App, App);
  //       //updateElement(root, b, a);
  //       //console.log('final a:', a);
  //       //console.log('final b:', b);
  //       counter++;
  //     } else {
  //       //render(root, b, b);
  //       //updateElement(root, b, b);
  //       //console.log('final a:', a);
  //       //console.log('final b:', b);
  //     }
  //   });
} else {
  console.log('Something is wrong...');
}
