import { between, bind, char, choice, compose, fmap, lazy, Parser, pure, some, then } from '@/parser';
import { float, lexeme } from '@/parser/utils';

export type Operator = '+' | '-' | '*' | '/';
export type Expr =
  | { type: 'operator', operator: Operator, left: Expr, right: Expr }
  | { type: 'primitive', value: number };

export type OperatorTable = Operator[][];

/* do
 *  symbol op
 *  b <- operand
 *  return $ \a -> { type: op, a: a, b: b }
 */

export function expression(primitive: Parser<Expr>, operatorTable: OperatorTable): Parser<Expr> {
  const symbol = compose(char, lexeme);
  let term: Parser<Expr>;

  const expr: Parser<Expr> = lazy(() => operatorTable.reduce(
    (operand: Parser<Expr>, operators: Operator[]) => {
      const operatorParser = operators.map((operator) => then(
        symbol(operator),
        bind(operand, (b) => pure(
          (a: Expr): Expr => ({
            type: 'operator',
            left: a,
            right: b,
            operator: operator,
          }))
        )
      )).reduce(choice);

      const operations = (a: Expr) => fmap(
        some(operatorParser),
        (ops) => ops.reduce((value, op) => op(value), a),
      );

      return bind(operand, (a) => choice(
        operations(a),
        pure(a)
      ));
    },
    term,
  ));

  term = choice(
    between(symbol('('), symbol(')'), expr),
    primitive,
  );
  return expr;
}

export function calculator(): Parser<Expr> {
  const number = fmap(
    lexeme(float),
    (n): Expr => ({ type: 'primitive', value: n }),
  );
  const operators: OperatorTable = [
    ['*', '/'],
    ['+', '-'],
  ];
  return expression(number, operators);
}

export function printExpr(expr: Expr): string {
  if (expr.type === 'primitive') return String(expr.value);
  const a = printExpr(expr.left);
  const b = printExpr(expr.right);
  return `(${a} ${expr.operator} ${b})`;
}
