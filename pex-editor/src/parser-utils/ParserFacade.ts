import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { PexLexer } from '../../PexLexer';
import { Token } from 'antlr4ts/Token';
import { PexParser } from '../../PexParser';

export function createLexer(input: string) {
  const chars = CharStreams.fromString(input);
  return new PexLexer(chars);
}

export function getTokens(input: string) : Token[] {
  return createLexer(input).getAllTokens()
}

export function createParserFromLexer(lexer: PexLexer) {
  const tokens = new CommonTokenStream(lexer);
  return new PexParser(tokens);
}
