import { Parser } from '@/parser';

export type TestOutput<T> =
  | { type: 'success', value: T        }
  | { type: 'fail'   , value: T        }
  | { type: 'error'  , message: string };

export class Test<T> {
  predicate?: (t: T) => boolean;

  constructor(public parser: Parser<T>, public input: string) {
  }

  expect(predicate: (t: T) => boolean): typeof this {
    this.predicate = predicate;
    return this;
  }

  run(): TestOutput<T> {
    const reply = this.parser(this.input);

    if (reply.type === 'ok') {
      const result = !this.predicate || this.predicate(reply.value);
      return {
        type:  result ? 'success' : 'fail',
        value: reply.value,
      };
    }
    return {
      type: 'error',
      message: `Parser failed with reply: { type: '${reply.type}' }"`,
    };
  }

  log(stringify?: (t: T) => string): void {
    const output = this.run();
    if (output.type === 'error') {
      console.error(output.message);
      return;
    }
    const valueString = stringify ? stringify(output.value) : String(output.value);
    const success = output.type === 'success';
    console.log(`test ${success ? 'passed' : 'failed'}: ${valueString}`);
  }
}
