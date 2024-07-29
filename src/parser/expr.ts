import { between, bind, char, choice, compose, fmap, lazy, Parser, pure, some } from '@/parser';
import { lexeme } from '@/parser/utils';

export type OperatorTable<T> = Parser<(a: T, b: T) => T>[][];

/* do
 *  symbol op
 *  b <- operand
 *  return $ \a -> { type: op, a: a, b: b }
 */

export function expression<T>(primitive: Parser<T>, operatorTable: OperatorTable<T>): Parser<T> {
  const symbol = compose(char, lexeme);

  function operationParser(operand: Parser<T>, operators: Parser<(a: T, b: T) => T>[]): Parser<T> {
    const operations = operators.map(operator => bind(
      operator,
      f => fmap(operand, b => (a: T) => f(a, b))
    )).reduce(choice);

    return bind(operand, a => choice(
      fmap(
        some(operations),
        ops => ops.reduce((value, op) => op(value), a),
      ),
      pure(a),
    ));
  }

  // Forward-declaration because of function co-dependency.
  let term: Parser<T>;

  const expr: Parser<T> = lazy(
    () => operatorTable.reduce(operationParser, term)
  );

  term = choice(
    between(symbol('('), symbol(')'), expr),
    primitive,
  );
  return expr;
}
