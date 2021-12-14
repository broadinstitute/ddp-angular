import { ConsoleErrorListener } from 'antlr4ts';
import { createLexer, createParserFromLexer } from './ParserFacade';
import { ParserErrorListener } from 'antlr4ts/ParserErrorListener';
import { Token } from 'antlr4ts/Token';

export class Error {
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
class CollectorErrorListener implements ParserErrorListener {
  private errors : Error[] = []
  constructor(errors: Error[]) {
    this.errors = errors
  }
  syntaxError(_: any, offendingSymbol: Token|undefined, line: number, column: number, msg: string) {
    let endColumn = column + 1;
    if (offendingSymbol?.text != null) {
      endColumn = column + offendingSymbol.text.length;
    }
    this.errors.push(new Error(line, line, column, endColumn, msg));
  }
}

export function validate(input: string) : Error[] {
  let errors : Error[] = []

  const lexer = createLexer(input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(new ConsoleErrorListener());

  const parser = createParserFromLexer(lexer);
  parser.removeErrorListeners();
  parser.addErrorListener(new CollectorErrorListener(errors));

  const tree = parser.pex();
  console.log(tree);
  return errors;
}
