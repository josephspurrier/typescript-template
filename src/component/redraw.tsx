import { useState } from '@/lib/state';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from '@/lib/z';

export const RedrawButtons = (): JSX.Element => {
  const [count, setCount] = useState(0);
  return (
    <>
      <button
        onclick={() => {
          setTimeout(() => {
            //z.redraw();
            setCount(count() + 1);
          }, 1000);
        }}
      >
        Timer: Click Then Redraw Below ({count()} clicks)
      </button>

      <button
        onclick={() => {
          z.redraw();
        }}
      >
        Redraw
      </button>
    </>
  );
};
