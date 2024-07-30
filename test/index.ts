import { test, logTest } from './parser-test';
import { Parser, pure, bind, then, char, many, word, choice, choices, anyChar, skip, compose } from '@/parser'
import { float } from '@/parser/utils';
import { calculator, printExpr } from './parser/calculator';

{
  const input  = '1 + (2 + 3) * (4 + 2) + 3 / 4 * 2 / 5'
  const result = test(calculator()(input));
  logTest(result, printExpr);
}

{
  const input = '3.14';
  const result = test(
    float(input),
    result => result === 3.14
  );
  logTest(result);
}

{
  const input = '314';
  const result = test(
    float(input),
    result => result === 314
  );
  logTest(result);
}

{ 
  const input  = 'hellohellohellohelloworldworld';
  const parser = many(
    choice(
      word('hello'),
      word('world'),
    )
  );
  const result = test(
    parser(input),
    result => result.length === 6
  );
  logTest(result);
}

{ 
  const input  = 'do re and me';
  const note = choices(
    word('do'),
    word('re'),
    word('mi'),
    word('fa'),
    word('sol'),
    word('la'),
    word('si'),
  );
  const noteParser = bind(
    note,
    (n) => then(
      skip(char(' ')),
      pure(n)
    )
  );
  const parser: Parser<[string[], string]> = bind(
    many(noteParser),
    (ns) => bind(
      many(anyChar()),
      (rest) => pure([ns, rest.join('')])
    )
  );
  const result = test(
    parser(input),
    result => result[0].length === 2
      && result[0][0] === 'do'
      && result[0][1] === 're'
      && result[1] === 'and me'
  );
  logTest(result);
}
