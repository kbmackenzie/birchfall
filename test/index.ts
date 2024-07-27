import { many, word, choice } from '@/parser'

const parser = many(
  choice(
    word('hello'),
    word('world'),
  )
);

const input  = 'hellohellohellohelloworldworld';
const output = parser(input);

console.log(`Input: ${input}`);
console.log(`Output: { type: ${output.type}, value: ${output.type === 'ok' ? output.value : 'none'} }`);

if (output.type !== 'ok' || output.value.length !== 6) {
  throw new Error('Test failed!');
}
