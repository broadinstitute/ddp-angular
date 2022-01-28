import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { PexEditorLexer } from './pex-editor-lexer';
import { PexParser } from '../../antlr4-pex-grammar/PexParser';

export function createLexer(input: string): PexEditorLexer {
    const chars = CharStreams.fromString(input);
    return new PexEditorLexer(chars);
}

export function createParserFromLexer(lexer: PexEditorLexer): PexParser {
    const tokens = new CommonTokenStream(lexer);
    return new PexParser(tokens);
}
