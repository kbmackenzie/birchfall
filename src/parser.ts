import { Reply, empty, consumed } from '@/reply.js';

export type Parser<T> = (input: string) => Reply<T>;

export function pure<T>(t: T): Parser<T> {
  return (input) => ({
    type: 'epsilon',
    value: t,
    input: input,
  });
}

export function bind<T1, T2>(pa: Parser<T1>, pb: (t: T1) => Parser<T2>): Parser<T2> {
  return (input) => {
    const a = pa(input);
    if (a.type === 'epsilon' || a.type === 'ok') {
      return pb(a.value)(a.input);
    }
    return a;
  };
}

export function then<T1, T2>(pa: Parser<T1>, pb: Parser<T2>): Parser<T2> {
  return bind(pa, (_) => pb);
}

export function satisfy(predicate: (c: string) => boolean): Parser<string> {
  return (input) => {
    const head = input[0];
    if (!head || !predicate(head)) {
      return { type: 'fail' };
    }
    return {
      type: 'ok',
      value: head,
      input: input.slice(1),
    };
  };
}

export function char(c: string): Parser<string> {
  return satisfy(x => x === c);
}

export function word(a: string): Parser<string> {
  return (input) => {
    if (input.length < a.length) return { type: 'fail' };
    const b = input.slice(0, a.length);
    if (b !== a) return { type: 'fail' };
    return {
      type: 'ok',
      value: b,
      input: input.slice(a.length),
    };
  };
}

export function choice<T>(pa: Parser<T>, pb: Parser<T>): Parser<T> {
  return (input) => {
    const a = pa(input);
    if (consumed(a)) return a;
    if (a.type === 'fail') return pb(input);

    const b = pb(input);
    if (empty(b)) return a;
    return b;
  };
}

export function choices<T>(...ps: Parser<T>[]): Parser<T> {
  return ps.reduce((a, b) => choice(a, b));
}

function some<T>(p: Parser<T>): Parser<T[]> {
  /* An iterative implementation preferred over a recursive one like Haskell's.
   * Linked lists and recursion is expensive in JS. */
  return (input) => {
    let a: Reply<T> = p(input);
    if (a.type !== 'ok') {
      if (a.type === 'error') return a;
      return { type: 'fail' };
    }
    const output: T[] = [];

    while (a.type === 'ok') {
      output.push(a.value);
      const x = p(a.input);
      if (x.type === 'fail') break;
      a = x;
    } 
    if (a.type === 'error') return a;

    return {
      type: 'ok',
      value: output,
      input: a.input,
    }
  };
}

export function many<T>(p: Parser<T>): Parser<T[]> {
  return choice(some(p), pure([]));
}
