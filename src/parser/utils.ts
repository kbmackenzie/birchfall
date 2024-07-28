import { Parser, after, bind, char, choice, fmap, many, pure, satisfy, skip, then, void_, word } from '@/parser';

/* --- Numbers: --- */
function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

export const integer: Parser<number> = fmap(
  (digits: string[]) => Number(digits.join('')),
  many(satisfy(isDigit))
);

export const float: Parser<number> = fmap(
  (digits: string) => Number(digits),
  bind(
    many(satisfy(isDigit)),
    (whole) => then(
      char('.'),
      fmap(
        (fractional) => `${whole}.${fractional}`,
        many(satisfy(isDigit)),
      )
    )
  )
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
export const whitespace: Parser<void> = skip(satisfy(isWhitespace));
export const newline:    Parser<void> = void_(char('\n'));

/* -- Miscellaneous -- */
export function lexeme<T>(p: Parser<T>): Parser<T> {
  return after(p, whitespace);
}
