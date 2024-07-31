import { Parser, char, compose, choices, then, pure, between, lazy, satisfy, fmap, some, skipSome, skip } from '@/parser';
import { lexeme } from '@/parser/utils';

export type Instruction = '+' | '-' | '>' | '<' | ',' | '.';

export type Token =
  | { type: 'instruction', value: Instruction }
  | { type: 'loop'       , tokens: Token[]    }

const notValid = /[^\+\-\<\>\[\]\,\.]/;
const comment  = satisfy(x => notValid.test(x));
const comments = skipSome(comment);
const symbol   = compose(char, lexeme(comments));

const instructions: Instruction[] = ['+', '-', '<', '>', ',', '.'];

const instruction = (instruction: Instruction): Parser<Token> => then(
  symbol(instruction),
  pure({ type: 'instruction', value: instruction })
);

const loop = (tokens: Parser<Token[]>): Parser<Token> => fmap(
  between(
    symbol('['),
    symbol(']'),
    tokens
  ),
  (ts) => ({ type: 'loop', tokens: ts }),
);

export const brainfck: Parser<Token[]> = lazy(() => {
  const token = choices(
    ...instructions.map(instruction),
    loop(brainfck)
  );
  return then(
    skip(comment),
    some(token)
  );
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
