// TODO: figure out how to type this correctly (or pull in Ramda)
export const curry = (fn: Function): Function =>
  (...args: any[]) => fn.bind(null, ...args);

export const prop = curry((k: string, x: Object): any => x[k]);

export const get = curry((str, x) =>
  str.split(".").reduce((acc, k) => acc[k], x)
);

export const range = (a: number, b?: number): number[] =>
  b ? [...Array(b).keys()].slice(a) : [...Array(a).keys()];
