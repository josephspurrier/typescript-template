// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from '@/lib/z';
import { Empty } from '@/component/empty';
import { FragLevel1 } from '@/component/fragments';
import { State } from '@/component/state';
import { RedrawButtons } from '@/component/redraw';

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

interface TwoFragmentsAttrs {
  username: string;
}

const TwoFragments = (attrs: TwoFragmentsAttrs): JSX.Element => {
  return (
    <>
      <div cool={attrs.username}>This is fragment A.</div>
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

// // Create some dom elements
const App = (): JSX.Element => {
  return (
    <div class='app'>
      <a title='home' href='#/'>
        Back
      </a>

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

      <TwoFragments username='josephspurrier' />

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

      <State />
      <State />

      <hr />

      <RedrawButtons />

      <hr />

      <FragLevel1 />

      <hr />

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

const rootElem = document.createElement('div');
rootElem.setAttribute('id', 'root');
document.body.appendChild(rootElem);
//z.render(rootElem, App);

const Index = (): JSX.Element => {
  return (
    <div>
      <div>
        <a title='page1' href='#/page1'>
          Go to Page 1
        </a>
      </div>
      <div>
        <a title='page2' href='#/page2'>
          Go to Page 2
        </a>
      </div>
      <div>
        <a title='error' href='#/404'>
          Go to Error Page
        </a>
      </div>
    </div>
  );
};

const Page1 = (): JSX.Element => {
  return (
    <div class='app'>
      <p>Page 1.</p>
      <a title='home' href='#/'>
        Back
      </a>
    </div>
  );
};

// const Page2 = (): JSX.Element => {
//   return (
//     <div class='app'>
//       <p>Page 2.</p>
//       <a title='home' href='#/'>
//         Back
//       </a>
//     </div>
//   );
// };

const ErrorPage = (): JSX.Element => {
  return (
    <div>
      <div>404 Page not found</div>
      <a title='home' href='#/'>
        Back
      </a>
    </div>
  );
};

z.state.routerPrefix = '#';

z.route(rootElem, '/', Index);
z.route(rootElem, '/page1', Page1);
z.route(rootElem, '/page2', App);
z.route(rootElem, '/404', ErrorPage);
