import { between, char, choice, compose, fmap, lazy, Parser, pure, then } from '@/parser';
import { integer, lexeme } from '@/parser/utils';
import { makeExpressionParser, OperatorTable, OperatorType } from '@/parser/expr';

export type Operator = '+' | '-' | '*' | '/';
export type Expr =
  | { type: 'operation', operator: Operator, left: Expr, right: Expr }
  | { type: 'primitive', value: number };

const symbol = compose(char, lexeme);

const parseNumber: Parser<Expr> = fmap(
  lexeme(integer),
  (num) => ({ type: 'primitive', value: num })
);

const parseOperation = (operator: Operator) => then(
  symbol(operator),
  pure((left: Expr, right: Expr): Expr => ({
    type: 'operation',
    operator: operator,
    left: left,
    right: right,
  }))
);

const operators: OperatorTable<Expr> = [
  [
    { type: OperatorType.InfixL, parse: parseOperation('*') },
    { type: OperatorType.InfixL, parse: parseOperation('/') },
  ],
  [
    { type: OperatorType.InfixL, parse: parseOperation('+') },
    { type: OperatorType.InfixL, parse: parseOperation('-') },
  ]
];

export function calculator(): Parser<Expr> {
  /* Forward-declaration, because function co-dependency. */
  let term: Parser<Expr>;
  let expr = lazy(() => makeExpressionParser(term, operators));
  term = choice(
    between(symbol('('), symbol(')'), expr),
    parseNumber
  );
  return expr;
}

/* Print an expression and its subexpressions. */
export function printExpr(expr: Expr): string {
  if (expr.type === 'primitive') return String(expr.value);
  const a = printExpr(expr.left);
  const b = printExpr(expr.right);
  return `(${a} ${expr.operator} ${b})`;
}

/* Compare two expressions recursively. */
export function compare(a: Expr, b: Expr): boolean {
  if (a.type === 'primitive' && b.type === 'primitive') {
    return a.value === b.value;
  }
  if (a.type === 'operation' && b.type === 'operation') {
    return a.operator === b.operator
      && compare(a.left, b.left)
      && compare(a.right, b.right);
  }
  return false;
}

/* Evaluate an expression, calculating its result. */
export function evaluate(expr: Expr): number {
  if (expr.type === 'primitive') {
    return expr.value;
  }
  const left  = evaluate(expr.left);
  const right = evaluate(expr.right);
  switch (expr.operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
  }
}
