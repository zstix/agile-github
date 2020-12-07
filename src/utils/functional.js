export const curry = (fn) => (...args) => fn.bind(null, ...args);

export const prop = curry((k, x) => x[k]);

export const get = curry((str, x) =>
  str.split(".").reduce((acc, k) => acc[k], x)
);

export const range = (a, b = false) =>
  b ? [...Array(b).keys()].slice(a) : [...Array(a).keys()];
