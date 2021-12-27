import { ChangeDetectorRef, Component } from '@angular/core';
import { Error, getCompletion, validate } from 'src/parser-utils/validator';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editorOptions = {theme: 'myCoolTheme', language: 'pex'};
  code: string = 'user.studies["A"].forms["B"].questions["COUNTRY"].answers.hasOption("US")';
  errors: Error[] = [];
  completions?: string[];

  constructor(private cd: ChangeDetectorRef) {}

  editorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    const model = <monaco.editor.ITextModel >editor.getModel();
    editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
      console.log(JSON.stringify(e, null, '\t'));
      console.log(this.code);
      this.errors = validate(this.code);
      this.cd.detectChanges();
    });

    const changeCursorPositionSubject = new Subject<monaco.editor.ICursorPositionChangedEvent>();
    editor.onDidChangeCursorPosition((e: monaco.editor.ICursorPositionChangedEvent) => changeCursorPositionSubject.next(e));
    changeCursorPositionSubject.pipe(debounceTime(500)).subscribe((e: monaco.editor.ICursorPositionChangedEvent) => {
      const caretPosition = { line: e.position.lineNumber, column: e.position.column - 1 };
      this.completions = getCompletion(this.code, caretPosition);

      if (this.completions.length) {
        const markers = this.completions.map((completion) => ({
          severity: monaco.MarkerSeverity.Hint,
          startLineNumber: caretPosition.line,
          startColumn: caretPosition.column,
          endLineNumber: caretPosition.line,
          endColumn: caretPosition.column,
          message: completion
        }));
        monaco.editor.setModelMarkers(model, 'pex', markers);
      }

      this.cd.detectChanges();
    });
  }
}
