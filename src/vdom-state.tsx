// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from '@/lib/z';

let globalCounter = 0;

export const State = (): JSX.Element => {
  const [count, setCount] = z.useState(0);
  const [count2, setCount2] = z.useState(5);
  return (
    <>
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
      <div>Global counter: {globalCounter}</div>
      <div>Local counter: {count()}</div>
      <div>Local counter 2: {count2()}</div>
    </>
  );
};
