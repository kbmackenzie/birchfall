import { parse } from '@/.';
import { brainfck, showTokens } from '@test/brainfck';

test('parse "+sd+sdfd++-sdfd---" as "++++----"', () => {
  const result = parse(brainfck, '+sd+sdfd++-sdfd---');
  expect(result.type).toBe('success');
  if (result.type === 'success') {
    expect(showTokens(result.value)).toBe('++++----');
  }
});

test('parse "> +++   ++[<+abc++d++ef++  \n+g>  -]" as ">+++++[<++++++++>-]"', () => {
  const result = parse(brainfck, '> +++   ++[<+abc++d++ef++  \n+g>  -]');
  expect(result.type).toBe('success');
  if (result.type === 'success') {
    expect(showTokens(result.value)).toBe('>+++++[<++++++++>-]');
  }
});
