/**
 *  Error listener is based on the implementation from the article
 *  https://tomassetti.me/writing-a-browser-based-editor-using-monaco-and-antlr/
 */
import { ParserErrorListener } from 'antlr4ts';
import { Token } from 'antlr4ts/Token';

export class PexError {
    startLine: number;
    endLine: number;
    startCol: number;
    endCol: number;
    message: string;
    constructor(startLine: number, endLine: number, startCol: number, endCol: number, message: string) {
        this.startLine = startLine;
        this.endLine = endLine;
        this.startCol = startCol;
        this.endCol = endCol;
        this.message = message;
    }
}

export class CollectorErrorListener implements ParserErrorListener {
    private errors : PexError[] = []
    constructor(errors: PexError[]) {
        this.errors = errors
    }
    syntaxError(_: any, offendingSymbol: Token|undefined, line: number, column: number, msg: string) {
        let endColumn = column + 1;
        if (offendingSymbol?.text != null) {
            endColumn = column + offendingSymbol.text.length;
        }
        this.errors.push(new PexError(line, line, column, endColumn, msg));
    }
}
