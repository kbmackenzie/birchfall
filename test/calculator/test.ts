import { TestInput } from '@test/test-func';
import { evaluate, Expr } from '@test/calculator';

const calculatorTests: TestInput<Expr>[] = [
  {
    input: '1 + 1 + 1',
    expected: (expr) => evaluate(expr) === 5,
  },
  {
    input: '1 + 2 * 2',
    expected: (expr) => evaluate(expr) === 5,
  },
  {
    input: '1 + (2 + 3) * (4 + 2) + 3 / 4 * 2 / 5',
    expected: (expr) => evaluate(expr) === 31.3,
  },
];
