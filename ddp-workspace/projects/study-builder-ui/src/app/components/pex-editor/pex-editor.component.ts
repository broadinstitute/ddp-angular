/**
 *  Before using this component run `antlr4ts Pex.g4`  from `src/antlr4-pex-grammar` folder in order to generate pex lexer and parser .ts files.
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { PEXLanguage } from '../../../antlr4-pex-grammar/pex-config';
import { ConsoleErrorListener } from 'antlr4ts';
import { CollectorErrorListener, PexError } from '../../pex-grammar/collector-error-listener';
import { createLexer, createParserFromLexer } from '../../pex-grammar/pex-grammar-utils';
import { debounceTime, Subject } from 'rxjs';
import { getCompletions } from '../../pex-grammar/pex-completion-utils';

@Component({
    selector: 'app-pex-editor',
    templateUrl: './pex-editor.component.html',
    styleUrls: ['./pex-editor.component.scss']
})
export class PexEditorComponent {
    @Input() expression: string;
    @Output() changed = new EventEmitter<string>();
    errors: PexError[] = [];
    completions: string[] = [];

    editorOptions = { theme: 'ddp-theme', language: PEXLanguage };

    constructor(private cd: ChangeDetectorRef) {}

    public editorInit(editor: monaco.editor.IStandaloneCodeEditor): void {
        editor.onDidChangeModelContent(() => {
            this.errors = this.getValidationErrors(this.expression);
            this.changed.emit(this.expression);
            this.cd.detectChanges();
        });

        const changeCursorPositionSubject = new Subject<monaco.editor.ICursorPositionChangedEvent>();
        editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) => changeCursorPositionSubject.next(e));

        changeCursorPositionSubject.pipe(debounceTime(500)).subscribe((e: monaco.editor.ICursorPositionChangedEvent) => {
            const caretPosition = { lineNumber: e.position.lineNumber, column: e.position.column - 1 };
            this.completions = getCompletions(this.expression, caretPosition);
            this.cd.detectChanges();
        });
    }

    private getValidationErrors(input: string): PexError[] {
        const errors : PexError[] = []

        const lexer = createLexer(input);
        lexer.removeErrorListeners();
        lexer.addErrorListener(new ConsoleErrorListener());

        const parser = createParserFromLexer(lexer);
        parser.removeErrorListeners();
        parser.addErrorListener(new CollectorErrorListener(errors));

        parser.pex();
        return errors;
    }
}
