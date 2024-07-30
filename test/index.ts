import { calculator, showExpr } from '@test/calculator';
import { calculatorTests } from '@test/calculator/test';
import { brainfck, showTokens } from '@test/brainfck';
import { brainfckTests } from '@test/brainfck/test';
import { test, logTest } from './test-func';

{
  const calc = calculator();
  test(calc, calculatorTests).forEach(x => logTest(x, showExpr));
}
{
  test(brainfck, brainfckTests).forEach(x => logTest(x, showTokens))
}
