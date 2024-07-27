export type Reply<T> =
  | { type: 'ok'     , value: T, input: string }
  | { type: 'epsilon', value: T, input: string }
  | { type: 'fail'  }
  | { type: 'error' }

export function empty<T>(r: Reply<T>): boolean {
  return r.type === 'epsilon' || r.type === 'fail';
}

export function consumed<T>(r: Reply<T>): boolean {
  return r.type === 'ok' || r.type === 'error';
}
