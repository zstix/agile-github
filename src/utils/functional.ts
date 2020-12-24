const getProp = <T, K extends keyof T>(key: K, obj: T) => obj[key];

const getDeepProp = (path: string, obj: any) =>
  path.split('.').reduce((val, key) => val[key], obj)

export const range = (a: number, b?: number): number[] =>
  b ? [...Array(b).keys()].slice(a) : [...Array(a).keys()];

export const prop = <T, K extends keyof T>(key: K) => (obj: T) =>
  getProp(key, obj);

export const get = (path: string) => (obj: any) =>
  getDeepProp(path, obj);