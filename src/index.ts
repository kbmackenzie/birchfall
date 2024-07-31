import { after, endOfInput, Parser } from '@/parser';
export * from '@/parser';
export * from '@/reply';

export type ParserResult<T> =
  | { type: 'success', value: T }
  | { type: 'failure', index: number, message?: string }

export type Config = {
  allowLeftovers?: boolean;
  trim?: {
    where?: 'start' | 'end' | 'both',
    how?: RegExp | ((char: string) => boolean),
  },
};

type Transform = (input: string) => string;

export function parse<T>(parser: Parser<T>, input: string, config: Config = {}): ParserResult<T> {
  const transforms: Transform[] = !config ? [] : [
    /* Trim input. */
    (input) => {
      if (!config.trim) return input;
      const where = config.trim.where ?? 'both';

      if (where === 'both') return input.trim();
      return where === 'start' ? input.trimStart() : input.trimEnd();
    },
  ];

  const transInput  = transforms.reduce((acc, f) => f(acc), input);
  const transParser = (config.allowLeftovers)
    ? parser
    : after(parser, endOfInput);
  const reply = transParser(transInput, 0);

  if (reply.type === 'ok' || reply.type === 'epsilon') {
    return {
      type: 'success',
      value: reply.value
    };
  }
  return { 
    type: 'failure',
    index: reply.index,
    message: reply.message
  }
}
