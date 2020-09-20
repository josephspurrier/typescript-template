// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from '@/lib/z';

let globalCounter = 0;

export const State = (): JSX.Element => {
  const [count, setCount] = z.useState(0);
  const [count2, setCount2] = z.useState(5);
  return (
    <>
      <button
        onclick={() => {
          console.log(
            'Global counter should increase on each click:',
            globalCounter++,
          );
        }}
      >
        Increment Global Variable
      </button>
      <button
        onclick={() => {
          globalCounter++;
          setCount(count() + 1);
        }}
      >
        Increment Local + Global Variable
      </button>
      <button
        onclick={() => {
          setCount2(count2() + 1);
        }}
      >
        Increment Local 2
      </button>
      <div>Global counter: {globalCounter}</div>
      <div>Local counter: {count()}</div>
      <div>Local counter 2: {count2()}</div>
    </>
  );
};
