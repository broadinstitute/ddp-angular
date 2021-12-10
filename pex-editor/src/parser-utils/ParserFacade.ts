import { CharStreams} from 'antlr4ts';
import { PexLexer } from '../../PexLexer';
import { Token } from 'antlr4ts/Token';

export function createLexer(input: string) {
  const chars = CharStreams.fromString(input);
  return new PexLexer(chars);
}

export function getTokens(input: string) : Token[] {
  return createLexer(input).getAllTokens()
}
