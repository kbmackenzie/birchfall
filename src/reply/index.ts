export type Reply<T> =
  | { type: 'ok'     , value: T, input: string }
  | { type: 'epsilon', value: T, input: string }
  | { type: 'fail'  }
  | { type: 'error'  , message?: string }

export function isEmpty<T>(r: Reply<T>): boolean {
  return r.type === 'epsilon' || r.type === 'fail';
}

export function isConsumed<T>(r: Reply<T>): boolean {
  return r.type === 'ok' || r.type === 'error';
}

export function isSuccess<T>(r: Reply<T>): boolean {
  return r.type === 'ok' || r.type === 'epsilon';
}

export function isError<T>(r: Reply<T>): boolean {
  return r.type === 'error';
}
