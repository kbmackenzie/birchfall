import { between, bind, char, choice, choices, compose, fmap, lazy, option, Parser, pure, some } from '@/parser';
import { lexeme } from '@/parser/utils';

export enum OperatorType {
  Prefix  = 'prefix',
  InfixL  = 'infixL',
  InfixR  = 'infixR',
  Postfix = 'postix',
};

export type Operator<T> =
  | { type: OperatorType.Prefix,  parse: Parser<(a: T) => T>       }
  | { type: OperatorType.InfixL,  parse: Parser<(a: T, b: T) => T> }
  | { type: OperatorType.InfixR,  parse: Parser<(a: T, b: T) => T> }
  | { type: OperatorType.Postfix, parse: Parser<(a: T) => T>       };

export type OperatorTable<T> = Operator<T>[][];

export function parseInfixL<T>(
  left: T,
  term: Parser<T>,
  operators: Parser<(a: T, b: T) => T>[]
): Parser<T> {
  const operation = choices(...operators);
  return bind(operation, op => bind(term, right => {
    const expr = op(left, right);
    return choice(
      parseInfixL(expr, term, operators),
      pure(expr),
    );
  }));
}

export function parseInfixR<T>(
  left: T,
  term: Parser<T>,
  operators: Parser<(a: T, b: T) => T>[]
): Parser<T> {
  const operation = choices(...operators);

  return bind(operation, op => {
    const rhs = bind(term, value => choice(
      parseInfixR(value, term, operators),
      pure(value),
    ));
    return fmap(rhs, right => op(left, right));
  });
}

export function parseTerm<T>(
  term: Parser<T>,
  prefixes:  Parser<(a: T) => T>[],
  postfixes: Parser<(a: T) => T>[],
): Parser<T> {
  const prefix  = option(choices(...prefixes), x => x);
  const postfix = option(choices(...postfixes), x => x);
  return bind(prefix, pre => bind(term, a => bind(postfix, post => pure(post(pre(a))))));
}

export type SplitOperators<T> = {
  [OperatorType.Prefix]:  Parser<(a: T) => T>[],
  [OperatorType.InfixL]:  Parser<(a: T, b: T) => T>[],
  [OperatorType.InfixR]:  Parser<(a: T, b: T) => T>[],
  [OperatorType.Postfix]: Parser<(a: T) => T>[],
};

export function splitOperators<T>(table: OperatorTable<T>): SplitOperators<T> {
  const operators: SplitOperators<T> = {
    [OperatorType.Prefix]:  [],
    [OperatorType.InfixL]:  [],
    [OperatorType.InfixR]:  [],
    [OperatorType.Postfix]: [],
  };
  for (const row of table) {
    for (const operator of row) {
      /* This superflous switch-case is sadly necessary for this to typecheck.
       * Because TypepScript is TypeScript. c': */
      switch (operator.type) {
        case OperatorType.Prefix:
        case OperatorType.Postfix:
          operators[operator.type].push(operator.parse);
          break;
        case OperatorType.InfixL:
        case OperatorType.InfixR:
          operators[operator.type].push(operator.parse);
          break;
      }
    }
  }
  return operators;
}
