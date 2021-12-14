/// <reference path="../../node_modules/monaco-editor/monaco.d.ts" />
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { FormsModule } from '@angular/forms';
import { PexTokensProvider } from '../parser-utils/pexTokensProvider';
import { CommonModule } from '@angular/common';

function onMonacoLoad() {
  monaco.languages.register({ id: 'pex' });
  monaco.languages.setTokensProvider('pex', new PexTokensProvider());

  let literalFg = '3b8737';
  let symbolsFg = '000000';
  let keywordFg = '7132a8';
  let errorFg = 'ff0000';

  monaco.editor.defineTheme('myCoolTheme', {
    base: 'vs',
    inherit: false,
    rules: [
      { token: 'int.pex',   foreground: literalFg },
      { token: 'bool.pex',   foreground: literalFg },
      { token: 'str.pex',   foreground: keywordFg },
      { token: 'timeunit.pex',   foreground: literalFg },
      { token: 'unary_operator.pex',         foreground: symbolsFg },
      { token: 'relation_operator.pex',          foreground: symbolsFg },
      { token: 'equality_operator.pex',          foreground: symbolsFg },
      { token: 'user_type.pex',     foreground: keywordFg,  fontStyle: 'bold' },
      { token: 'instance_type.pex',    foreground: keywordFg,  fontStyle: 'bold' },
      { token: 'unrecognized.pex', foreground: errorFg }
    ],
    colors: {}
  });
}

const monacoConfig: NgxMonacoEditorConfig = {
  // baseUrl: 'assets',
  onMonacoLoad
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule.forRoot(monacoConfig),
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
