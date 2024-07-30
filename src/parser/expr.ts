import { bind, choice, choices, fmap, option, Parser, pure } from '@/parser';

export enum OperatorType {
  Prefix  = 'prefix',
  InfixL  = 'infixL',
  InfixR  = 'infixR',
  Postfix = 'postfix',
};

export type Operator<T> =
  | { type: OperatorType.Prefix,  parse: Parser<(a: T) => T>       }
  | { type: OperatorType.InfixL,  parse: Parser<(a: T, b: T) => T> }
  | { type: OperatorType.InfixR,  parse: Parser<(a: T, b: T) => T> }
  | { type: OperatorType.Postfix, parse: Parser<(a: T) => T>       };

export type OperatorTable<T> = Operator<T>[][];

function parseInfixL<T>(
  left: T,
  term: Parser<T>,
  operations: Parser<(a: T, b: T) => T>
): Parser<T> {
  return bind(operations, op => bind(term, right => {
    const expr = op(left, right);
    return choice(
      parseInfixL(expr, term, operations),
      pure(expr),
    );
  }));
}

function parseInfixR<T>(
  left: T,
  term: Parser<T>,
  operations: Parser<(a: T, b: T) => T>
): Parser<T> {
  return bind(operations, op => {
    const rhs = bind(term, value => choice(
      parseInfixR(value, term, operations),
      pure(value),
    ));
    return fmap(rhs, right => op(left, right));
  });
}

function parseTerm<T>(
  term: Parser<T>,
  prefixes:  Parser<(a: T) => T>[],
  postfixes: Parser<(a: T) => T>[],
): Parser<T> {
  const prefix  = option(choices(...prefixes), x => x);
  const postfix = option(choices(...postfixes), x => x);
  return bind(prefix, pre => bind(term, a => bind(postfix, post => pure(post(pre(a))))));
}

type SplitOperators<T> = {
  prefix:  Parser<(a: T) => T>[],
  infixL:  Parser<(a: T, b: T) => T>[],
  infixR:  Parser<(a: T, b: T) => T>[],
  postfix: Parser<(a: T) => T>[],
};

function splitOperators<T>(operatorList: Operator<T>[]): SplitOperators<T> {
  const operators: SplitOperators<T> = {
    prefix:  [],
    infixL:  [],
    infixR:  [],
    postfix: [],
  };
  for (const operator of operatorList) {
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
  return operators;
}

function parsePrecLevel<T>(primitive: Parser<T>, operatorList: Operator<T>[]) {
  const operators = splitOperators(operatorList);
  const term = parseTerm(primitive, operators.prefix, operators.postfix);
  const infixR = choices(...operators.infixR);
  const infixL = choices(...operators.infixL);

  return bind(term, x => choices(
    parseInfixR(x, term, infixR),
    parseInfixL(x, term, infixL),
    pure(x)
  ));
}

export function makeExpressionParser<T>(primitive: Parser<T>, operatorTable: OperatorTable<T>): Parser<T> {
  return operatorTable.reduce((acc, x) => parsePrecLevel(acc, x), primitive);
}
