import { Parser, after, bind, char, choice, fmap, some, option, pure, satisfy, then, void_, word, skipSome } from '@/parser';

/* --- Numbers: --- */
function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

export const integer: Parser<number> = fmap(
  some(satisfy(isDigit)),
  (digits) => Number(digits.join('')),
);

export const float: Parser<number> = fmap(
  bind(
    some(satisfy(isDigit)),
    (whole) => option(
      then(
        char('.'),
        fmap(
          some(satisfy(isDigit)),
          (fractional) => `${whole.join('')}.${fractional.join('')}`,
        )
      ),
      whole.join('')
    )
  ),
  (digits) => Number(digits),
);

/* --- Booleans: --- */
export const boolean: Parser<boolean> = choice(
  then(
    word('true'),
    pure(true)
  ),
  then(
    word('false'),
    pure(false)
  ),
);


/* -- Whitespace -- */
function isWhitespace(char: string): boolean {
  return /^\s$/.test(char);
}
export const whitespace: Parser<void> = skipSome(satisfy(isWhitespace));
export const newline:    Parser<void> = void_(char('\n'));

/* -- Miscellaneous -- */
export const lexeme = (space: Parser<void>) =>
  <T>(p: Parser<T>): Parser<T> =>
    after(p, choice(space, pure(void 0)));
