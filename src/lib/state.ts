import { z } from '@/lib/z';

export const resetStateCounter = (): void => {
  z.state.globalStateCounter = -1;
};

export const useState = function <T>(v: T): [() => T, (val: T) => void] {
  z.state.globalStateCounter++;
  const localCounter = z.state.globalStateCounter;
  if (z.state.globalState[localCounter] === undefined) {
    z.state.globalState[localCounter] = v;
  }
  return [
    (): T => {
      return z.state.globalState[localCounter] as T;
    },
    (val: T): void => {
      z.state.globalState[localCounter] = val;
    },
  ];
};
