import { TestInput } from '@test/test-func';
import { showTokens, Token } from '@test/brainfck';

export const brainfckTests: TestInput<Token[]>[] = [
  {
    input: '++++----',
    expected: (token) => showTokens(token) === '++++----'
  },
  {
    input: '>+++++[<++++++++>-]',
    expected: (token) => showTokens(token) === '>+++++[<++++++++>-]'
  },
  {
    input: '> +++   ++[<+abc++d++ef++  \n+g>  -]',
    expected: (token) => showTokens(token) === '>+++++[<++++++++>-]'
  },
];
