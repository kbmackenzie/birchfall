import { between, bind, char, choice, choices, compose, fmap, lazy, option, Parser, pure, some, then } from '@/parser';
import { float, lexeme } from '@/parser/utils';

export type Operator = '+' | '-' | '*' | '/';
export type Expr =
  | { type: 'operation', op: Operator, a: Expr, b: Expr }
  | { type: 'primitive', value: number };

export function calculator(): Parser<Expr> {
  const symbol = compose(char, lexeme);
  const number = fmap(
    (n: number): Expr => ({ type: 'primitive', value: n }),
    lexeme(float)
  );

  const operationSet = (operators: Operator[], operand: Parser<Expr>) => {
    const operation = (op: Operator) => then(
      symbol(op),
      pure((a: Expr, b: Expr): Expr =>
        ({ type: 'operation', op: op, a: a, b: b }))
    );
    const rexpr = bind(
      choices(...operators.map((operation))),
      (f) => bind(operand, (b) => pure((a: Expr) => f(a, b))),
    );
    const rhs   = bind(
      some(rexpr),
      (fs) => pure(fs.reduce((f, g) => (a) => g(f(a))))
    );
    return bind(
      operand,
      (a: Expr) => bind(
        option(rhs, (x: Expr) => x),
        (f) => pure(f(a)),
      )
    );
  }

  /* Forward declaration (due to function co-dependency). */
  let sum:  Parser<Expr>,
      prod: Parser<Expr>,
      term: Parser<Expr>;

  sum  = lazy(() => operationSet(['+', '-'], prod));
  prod = lazy(() => operationSet(['*', '/'], term));
  term = lazy(() => choice(
    number,
    between(symbol('('), symbol(')'), sum),
  ));

  return sum;
}

export function printExpr(expr: Expr): string {
  if (expr.type === 'primitive') return String(expr.value);
  const a = printExpr(expr.a);
  const b = printExpr(expr.b);
  return `(${a} ${expr.op} ${b})`;
}
