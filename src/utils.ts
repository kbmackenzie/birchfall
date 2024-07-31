/* Higher-order function utils. They may seem useless, but are very handy
 * in a higher-order function context. */

export function id<T>(t: T): T {
  return t;
}

export function constant<T1, T2>(a: T1): (_: T2) => T1 {
  return (_) => a;
}
