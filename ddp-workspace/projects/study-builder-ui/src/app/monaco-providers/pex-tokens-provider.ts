/**
 *  PexTokensProvider is mostly based on the article
 *  https://tomassetti.me/writing-a-browser-based-editor-using-monaco-and-antlr/
 *  We use this provider for pex syntax highlighting
 */
import { ConsoleErrorListener } from 'antlr4ts';
import { createLexer } from '../pex-grammar/pex-grammar-utils';
import { PEXLanguage } from '../../antlr4-pex-grammar/pex-config';

class PexState implements monaco.languages.IState {
    clone(): monaco.languages.IState {
        return new PexState();
    }
    equals(): boolean {
        return true;
    }
}

export class PexTokensProvider implements monaco.languages.TokensProvider {
    getInitialState(): monaco.languages.IState {
        return new PexState();
    }

    tokenize(line: string, state: monaco.languages.IState): monaco.languages.ILineTokens {
        // So far we ignore the state, which is not great for performance reasons
        return tokensForLine(line);
    }
}

class PexToken implements monaco.languages.IToken {
    scopes: string;
    startIndex: number;
    constructor(ruleName: string, startIndex: number) {
        this.scopes = `${ruleName.toLowerCase()}.${PEXLanguage}`;
        this.startIndex = startIndex;
    }
}

class PexLineTokens implements monaco.languages.ILineTokens {
    endState: monaco.languages.IState;
    tokens: monaco.languages.IToken[];
    constructor(tokens: monaco.languages.IToken[]) {
        this.endState = new PexState();
        this.tokens = tokens;
    }
}
const EOF = -1;
function tokensForLine(input: string): monaco.languages.ILineTokens {
    const errorStartingPoints : number[] = []
    class ErrorCollectorListener extends ConsoleErrorListener {
        syntaxError(_: any, __: any, ___: any, column: number) {
            errorStartingPoints.push(column)
        }
    }
    const lexer = createLexer(input);
    lexer.removeErrorListeners();
    let errorListener = new ErrorCollectorListener();
    lexer.addErrorListener(errorListener);
    let done = false;
    let myTokens: monaco.languages.IToken[] = [];
    do {
        let token = lexer.nextToken();
        if (token == null) {
            done = true
        } else {
            // We exclude EOF
            if (token.type == EOF) {
                done = true;
            } else {
                let tokenTypeName = lexer.vocabulary.getSymbolicName(token.type) || '';
                let myToken = new PexToken(tokenTypeName, token.startIndex);
                myTokens.push(myToken);
            }
        }
    } while (!done);
    // Add all errors
    for (let e of errorStartingPoints) {
        myTokens.push(new PexToken(`error.${PEXLanguage}`, e));
    }
    myTokens.sort((a, b) => (a.startIndex > b.startIndex) ? 1 : -1)
    return new PexLineTokens(myTokens);
}
