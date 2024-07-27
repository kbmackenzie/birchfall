import { Reply } from '@/reply';

export type TestOutput<T> =
  | { type: 'success', value: T        }
  | { type: 'fail'   , value: T        }
  | { type: 'error'  , message: string };

export function test<T>(reply: Reply<T>, predicate?: (t: T) => boolean): TestOutput<T> {
  if (reply.type === 'ok') {
    const result = !predicate || predicate(reply.value);
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

export function logTest<T>(output: TestOutput<T>, stringify?: (t: T) => string): void {
  if (output.type === 'error') {
    console.error(output.message);
    return;
  }
  const valueString = stringify ? stringify(output.value) : String(output.value);
  const success = output.type === 'success';
  console.log(`test ${success ? 'passed' : 'failed'}: ${valueString}`);
}
