import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { Token } from 'antlr4ts/Token';
import { PexParser } from '../../PexParser';
import { EditorLexer } from './editorLexer';

export function createLexer(input: string): EditorLexer {
  const chars = CharStreams.fromString(input);
  return new EditorLexer(chars);
}

export function getTokens(input: string) : Token[] {
  return createLexer(input).getAllTokens()
}

export function createParserFromLexer(lexer: EditorLexer): PexParser {
  const tokens = new CommonTokenStream(lexer);
  return new PexParser(tokens);
}
