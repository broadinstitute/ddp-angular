import { ChangeDetectorRef, Component } from '@angular/core';
import { Error, validate } from 'src/parser-utils/validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editorOptions = {theme: 'myCoolTheme', language: 'pex'};
  code: string = 'user.studies["A"].forms["B"].questions["COUNTRY"].answers.hasOption("US")';
  errors: Error[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  editorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    editor.onDidChangeModelContent((e: monaco.editor.IModelContentChangedEvent) => {
      console.log(JSON.stringify(e, null, '\t'));
      console.log(this.code);
      this.errors = validate(this.code);
      this.cd.detectChanges();
    });
  }
}
