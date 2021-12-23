import { ConsoleErrorListener } from 'antlr4ts';
import { createLexer, createParserFromLexer } from './ParserFacade';
import { ParserErrorListener } from 'antlr4ts/ParserErrorListener';
import { Token } from 'antlr4ts/Token';
import { CodeCompletionCore } from 'antlr4-c3';
import { ParseTree } from 'antlr4ts/tree';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';

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
  syntaxError(_: any, offendingSymbol: Token|undefined, line: number, column: number, msg: string, error: any) {
    let endColumn = column + 1;
    if (offendingSymbol?.text != null) {
      endColumn = column + offendingSymbol.text.length;
    }
    // const representedAlternatives = (error as NoViableAltException).deadEndConfigs?.getRepresentedAlternatives();
    // console.log(representedAlternatives, 'representedAlternatives');
    // console.log((error as NoViableAltException).deadEndConfigs?.getStates(), 'getStates');
    // console.log(representedAlternatives?.get(0), 'representedAlternatives?.get(0)');
    // console.log(representedAlternatives?.toString(), 'representedAlternatives?.toString()');
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

interface CaretPosition { line: number, column: number }

function computeToken(parseTree: ParseTree, caretPosition: CaretPosition): Token | undefined {
  if(parseTree instanceof TerminalNode) {
    return computeTokenOfTerminalNode(parseTree, caretPosition);
  } else {
    return computeTokenOfChildNode(parseTree, caretPosition);
  }
}

function computeTokenOfTerminalNode(parseTree: TerminalNode, caretPosition: CaretPosition): Token | undefined {
  let start = parseTree.symbol.charPositionInLine;
  let stop = parseTree.symbol.charPositionInLine + parseTree.text.length;
  if (parseTree.symbol.line == caretPosition.line && start <= caretPosition.column && stop >= caretPosition.column) {
    return parseTree.symbol;
  } else {
    return undefined;
  }
}

function computeTokenOfChildNode(parseTree: ParseTree, caretPosition: CaretPosition): Token | undefined {
  for (let i = 0; i < parseTree.childCount; i++) {
    let index = computeToken(parseTree.getChild(i), caretPosition);
    if (index !== undefined) {
      return index;
    }
  }
  return undefined;
}

export function getCompletion(input: string, caretPosition?: CaretPosition): string[] {
  if (!caretPosition) return [];
  const lexer = createLexer(input);
  const parser = createParserFromLexer(lexer);
  let core = new CodeCompletionCore(parser);
  const tree = parser.pex();
  const token = computeToken(tree, caretPosition);
  if (!token) {
    return [];
  }
  const tokenDisplayName = parser.vocabulary.getDisplayName(token.type);
  const endOfTheLine = caretPosition.column > (tree.stop?.charPositionInLine || 0) && (["'.'", "']'"].includes(tokenDisplayName)) ? token.tokenIndex + 1 : token.tokenIndex;
  const collections = core.collectCandidates(endOfTheLine);

  let keywords: string[] = [];
  if (collections) {
    for (let candidate of collections.tokens) {
      keywords.push(parser.vocabulary.getDisplayName(candidate[0]));
    }
  }

  return keywords;
}
