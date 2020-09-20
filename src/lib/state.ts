import { z } from '@/lib/z';

export const resetStateCounter = (): void => {
  z.state.globalStateCounter = -1;
};

export const useState = function <T>(v: T): [() => T, (val: T) => void] {
  z.state.globalStateCounter++;
  //console.log('setState!', globalStateCounter);
  const localCounter = z.state.globalStateCounter;
  if (z.state.globalState[localCounter] === undefined) {
    z.state.globalState[localCounter] = v;
  }
  return [
    (): T => {
      //console.log('stateRead!', localCounter, globalState[localCounter]);
      return z.state.globalState[localCounter] as T;
    },
    (val: T): void => {
      z.state.globalState[localCounter] = val;
    },
  ];
};
