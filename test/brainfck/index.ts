import { Parser, char, compose, choices, then, pure, between, lazy, satisfy, void_, fmap, some } from '@/parser';
import { lexeme } from '@/parser/utils';

export type Instruction = '+' | '-' | '>' | '<' | ',' | '.';

export type Token =
  | { type: 'instruction', value: Instruction }
  | { type: 'loop'       , tokens: Token[]    }

const validCharacters = /[^\+\-\<\>\[\]\,\.]/;
const spaces = void_(satisfy(x => validCharacters.test(x)));
const symbol = compose(char, lexeme(spaces));

const instruction = (ins: Instruction): Parser<Token> => then(
  symbol(ins),
  pure({ type: 'instruction', value: ins })
);
const loop = (tokens: Parser<Token[]>): Parser<Token> => fmap(
  between(symbol('['), symbol(']'), tokens),
  (ts) => ({ type: 'loop', tokens: ts }),
);

export const brainfck: Parser<Token[]> = lazy(() => {
  const instructions: Instruction[] = ['+', '-', '<', '>', ',', '.'];
  return some(choices(...instructions.map(instruction), loop(brainfck)));
});

export function showToken(token: Token): string {
  if (token.type === 'instruction') return token.value;
  /* For the lines below, this holds true: token.type === 'loop' */
  const body = token.tokens.map(showToken).join('');
  return `[${body}]`;
}

export function showTokens(tokens: Token[]): string {
  return tokens.map(showToken).join('');
}
