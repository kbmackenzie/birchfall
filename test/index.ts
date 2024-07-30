import { calculator, printExpr } from '@test/calculator';
import { calculatorTests } from '@test/calculator/test';
import { test, logTest } from './test-func';

{
  const calc = calculator();
  test(calc, calculatorTests).forEach(x => logTest(x, printExpr));
}
