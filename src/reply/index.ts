export type Reply<T> =
  | { type: 'ok'     , value: T, index: number }  /* Success after consuming input.   */
  | { type: 'epsilon', value: T, index: number }  /* Success without consuming input. */
  | { type: 'fail'   , message?: string }         /* Failure without consuming input. */
  | { type: 'error'  , message?: string }         /* Failure *after* consuming input. */

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
