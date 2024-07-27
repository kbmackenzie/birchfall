import { Reply, empty, consumed } from '@/reply';

export type Parser<T> = (input: string) => Reply<T>;

/* Analogous to Haskell's 'pure' or 'return' for a parser monad. */
export function pure<T>(t: T): Parser<T> {
  return (input) => ({
    type: 'epsilon',
    value: t,
    input: input,
  });
}

/* Analogous to Haskell's '>>=' for a parser monad. */
export function bind<T1, T2>(pa: Parser<T1>, pb: (t: T1) => Parser<T2>): Parser<T2> {
  return (input) => {
    const a = pa(input);
    if (a.type === 'epsilon' || a.type === 'ok') {
      return pb(a.value)(a.input);
    }
    return a;
  };
}

/* Analogous to Haskell's '>>' for a parser monad. */
export function then<T1, T2>(pa: Parser<T1>, pb: Parser<T2>): Parser<T2> {
  return bind(pa, (_) => pb);
}

/* Analogous to Haskell's '<*' for a parser applicative functor. */
export function after<T1, T2>(pa: Parser<T1>, pb: Parser<T2>): Parser<T1> {
  return bind(pa, (a) => then(pb, pure(a)));
}

/* Analogous to Haskell's 'fmap' for a parser functor. */
export function fmap<T1, T2>(f: (t: T1) => T2, pa: Parser<T1>): Parser<T2> {
  return bind(pa, (a) => pure(f(a)));
}

export function satisfy(predicate: (c: string) => boolean): Parser<string> {
  return (input) => {
    const head = input[0];
    if (head === undefined || !predicate(head)) {
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
    if (consumed(a) || a.type === 'epsilon') return a;
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
    if (a.type !== 'ok' && a.type !== 'epsilon') {
      return a;
    }
    const output: T[] = [];

    while (a.type === 'ok' || a.type === 'epsilon') {
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

export function anyChar(): Parser<string> {
  return satisfy(_ => true);
}

export function skipSome<T>(p: Parser<T>): Parser<void> {
  return (input) => {
    let a: Reply<T> = p(input);
    if (a.type !== 'ok' && a.type !== 'epsilon') {
      return a;
    }
    while (a.type === 'ok' || a.type === 'epsilon') {
      const x = p(a.input);
      if (x.type === 'fail') break;
      a = x;
    } 
    if (a.type === 'error') return a;

    return {
      type: 'epsilon',
      value: void 0,
      input: a.input,
    };
  }
}

export function skip<T>(p: Parser<T>): Parser<void> {
  return choice(skipSome(p), pure(void 0));
}

export function between<T1, T2, T3>(open: Parser<T1>, close: Parser<T2>, pa: Parser<T3>): Parser<T3> {
  return then(open, bind(pa, (a) => then(close, pure(a))));
}