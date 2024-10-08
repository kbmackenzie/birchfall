import { between, char, choice, compose, fmap, lazy, Parser, pure, skip, then } from '@/parser';
import { integer, lexeme, whitespace } from '@/parser/utils';
import { makeExpressionParser, OperatorTable, OperatorType } from '@/parser/expr';

export type Operator = '+' | '-' | '*' | '/';
export type Expr =
  | { type: 'operation', operator: Operator, left: Expr, right: Expr }
  | { type: 'primitive', value: number };

const symbol = compose(char, lexeme(whitespace));

const parseNumber: Parser<Expr> = fmap(
  lexeme(whitespace)(integer),
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
  return then(skip(whitespace), expr);
}

/* Stringify an expression and its subexpressions. */
export function showExpr(expr: Expr): string {
  if (expr.type === 'primitive') return String(expr.value);
  const a = showExpr(expr.left);
  const b = showExpr(expr.right);
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
