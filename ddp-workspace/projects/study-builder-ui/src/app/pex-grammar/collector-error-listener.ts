/**
 *  Error listener is based on the implementation from the article
 *  https://tomassetti.me/writing-a-browser-based-editor-using-monaco-and-antlr/
 */
import { ParserErrorListener } from 'antlr4ts';
import { Token } from 'antlr4ts/Token';

export class PexError {
    constructor(
        public startLine: number,
        public endLine: number,
        public startCol: number,
        public endCol: number,
        public message: string
    ) {}
}

export class CollectorErrorListener implements ParserErrorListener {
    constructor(private errors: PexError[] = []) {}

    syntaxError(_: any, offendingSymbol: Token | undefined, line: number, column: number, msg: string): void {
        let endColumn = column + 1;
        if (offendingSymbol?.text != null) {
            endColumn = column + offendingSymbol.text.length;
        }
        this.errors.push(new PexError(line, line, column, endColumn, msg));
    }
}
