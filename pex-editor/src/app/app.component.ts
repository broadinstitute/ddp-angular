import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  editorOptions = {theme: 'myCoolTheme', language: 'pex'};
  code: string = 'user.studies["A"].forms["B"].questions["COUNTRY"].answers.hasOption("US")';
}
