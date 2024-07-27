import { Parser, bind, char, choice, fmap, many, pure, satisfy, then, word } from '@/parser';

/* --- Numbers: --- */

function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
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
      bind(
        many(satisfy(isDigit)),
        (fractinal) => pure(`${whole}.${fractinal}`)
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
