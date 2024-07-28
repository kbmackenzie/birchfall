import { Parser, after, bind, char, choice, fmap, many, some, option, pure, satisfy, skip, then, void_, word } from '@/parser';

/* --- Numbers: --- */
function isDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

export const integer: Parser<number> = fmap(
  (digits: string[]) => Number(digits.join('')),
  some(satisfy(isDigit))
);

export const float: Parser<number> = fmap(
  (digits: string) => Number(digits),
  bind(
    some(satisfy(isDigit)),
    (whole) => option(
      then(
        char('.'),
        fmap(
          (fractional: string[]) => `${whole.join('')}.${fractional.join('')}`,
          some(satisfy(isDigit)),
        )
      ),
      whole.join('')
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
