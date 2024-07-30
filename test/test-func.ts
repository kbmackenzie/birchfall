import { Parser, parse } from '@/parser';
import { Reply } from '@/reply';

export type TestInput<T> = {
  input: string;
  expected: (t: T) => boolean;
};

export type TestOutput<T> =
  | { type: 'success'    , value: T                             }
  | { type: 'unexpected' , value: T,        input: TestInput<T> }
  | { type: 'error'      , reply: Reply<T>, input: TestInput<T> };

function analyze<T>(reply: Reply<T>, input: TestInput<T>): TestOutput<T> {
  if (reply.type === 'ok' || reply.type === 'epsilon') {
    const isExpected = input.expected(reply.value);
    return {
      type:  isExpected ? 'success' : 'unexpected',
      value: reply.value,
      input: input,
    };
  }
  return {
    type: 'error',
    reply: reply,
    input: input,
  };
}

export function test<T>(parser: Parser<T>, inputs: TestInput<T>[]): TestOutput<T>[] {
  return inputs.map(
    (input: TestInput<T>): TestOutput<T> => {
      const reply = parse(parser, input.input);
      return analyze(reply, input);
    }
  );
}

export function logTest<T>(output: TestOutput<T>, stringify?: (t: T) => string): void {
  if (output.type === 'error') {
    const snippet = output.input.input.length > 30
      ? output.input.input.slice(0, 30)
      : output.input.input;
    console.error(
      'test failed: ',
      `parser failed with reply type '${output.reply.type}' on input: ${snippet}!`
    );
  }
  else if (output.type === 'unexpected') {
    const snippet = output.input.input.length > 30
      ? output.input.input.slice(0, 30)
      : output.input.input;
    const valueString = stringify
      ? stringify(output.value)
      : String(output.value);
    console.error(
      'test failed: ',
      `parser result ${valueString} match expected result for input '${snippet}'!`
    );
  }
  else {
    const valueString = stringify
      ? stringify(output.value)
      : String(output.value);
    console.log(
      `test passed: ${valueString}`
    );
  }
}
