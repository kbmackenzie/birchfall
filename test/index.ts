import { test, logTest } from './parser-test';
import { many, word, choice } from '@/parser'

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
