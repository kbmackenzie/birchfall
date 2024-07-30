import { parse } from '@/parser';
import { calculator, evaluate } from '@test/calculator';

test('parses "1 + 1 + 1" to equal 3', () => {
  const result = parse(calculator(), '1 + 1 + 1');
  expect(result.type).toBe('success');
  if (result.type === 'success') {
    expect(evaluate(result.value)).toBe(3);
  }
});

test('parses "1 + 2 * 2" to equal 5', () => {
  const result = parse(calculator(), '1 + 2 * 2');
  expect(result.type).toBe('success');
  if (result.type === 'success') {
    expect(evaluate(result.value)).toBe(5);
  }
});

test('parses "1 + (2 + 3) * (4 + 2) + 3 / 4 * 2 / 5" to equal 31.3', () => {
  const result = parse(calculator(), '1 + (2 + 3) * (4 + 2) + 3 / 4 * 2 / 5');
  expect(result.type).toBe('success');
  if (result.type === 'success') {
    expect(evaluate(result.value)).toBeCloseTo(31.3, 1);
  }
});
