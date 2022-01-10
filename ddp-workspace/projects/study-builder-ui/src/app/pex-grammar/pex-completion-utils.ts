import { ParseTree } from 'antlr4ts/tree';
import { Token } from 'antlr4ts/Token';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { createLexer, createParserFromLexer } from './pex-grammar-utils';
import { CodeCompletionCore } from 'antlr4-c3';
import { PexEditorLexer } from './pex-editor-lexer';

interface CaretPosition { lineNumber: number, column: number }

function computeToken(parseTree: ParseTree, caretPosition: CaretPosition): Token | undefined {
    if(parseTree instanceof TerminalNode) {
        return computeTokenOfTerminalNode(parseTree, caretPosition);
    } else {
        return computeTokenOfChildNode(parseTree, caretPosition);
    }
}

function computeTokenOfTerminalNode(parseTree: TerminalNode, caretPosition: CaretPosition): Token | undefined {
    const start = parseTree.symbol.charPositionInLine;
    const stop = parseTree.symbol.charPositionInLine + parseTree.text.length;
    if (parseTree.symbol.line === caretPosition.lineNumber &&
        start <= caretPosition.column &&
        stop >= caretPosition.column
    ) {
        return parseTree.symbol;
    } else {
        return undefined;
    }
}

function computeTokenOfChildNode(parseTree: ParseTree, caretPosition: CaretPosition): Token | undefined {
    for (let i = 0; i < parseTree.childCount; i++) {
        const index = computeToken(parseTree.getChild(i), caretPosition);
        if (index !== undefined) {
            return index;
        }
    }
    return undefined;
}

export function getCompletions(input: string, caretPosition?: CaretPosition): string[] {
    if (!caretPosition) return [];

    const lexer = createLexer(input);
    const parser = createParserFromLexer(lexer);
    const core = new CodeCompletionCore(parser);
    const tree = parser.pex();
    const token = computeToken(tree, caretPosition);
    if (!token) {
        return [];
    }
    const index = token.type === PexEditorLexer.UNRECOGNIZED ? token.tokenIndex : token.tokenIndex + 1;
    const collections = core.collectCandidates(index);

    const keywords: string[] = [];
    if (collections) {
        for (const candidate of collections.tokens) {
            const tokens = [candidate[0], ...candidate[1]]

            keywords.push(tokens.map(token => {
                if (token === PexEditorLexer.STR) {
                    return '""';
                }
                return parser.vocabulary.getDisplayName(token).replace(/['"]+/g, '');
            }).join(''));
        }
    }

    return keywords;
}
