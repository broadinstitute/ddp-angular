// todo try to find better solution with injecting monaco type declaration
// eslint-disable-next-line
/// <reference path="../../../../node_modules/monaco-editor/monaco.d.ts" />
import { NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { pexTheme } from './monaco-providers/pex-theme';
import { PexTokensProvider } from './monaco-providers/pex-tokens-provider';
import { PEXLanguage } from '../antlr4-pex-grammar/pex-config';
import { pexCompletionItemProvider } from './monaco-providers/pex-completion-item-provider';

function onMonacoLoad() {
    monaco.languages.register({ id: PEXLanguage });
    monaco.languages.setTokensProvider(PEXLanguage, new PexTokensProvider());
    monaco.editor.defineTheme('ddp-theme', pexTheme);
    monaco.languages.registerCompletionItemProvider(PEXLanguage, pexCompletionItemProvider);
}

export const monacoConfig: NgxMonacoEditorConfig = {
    onMonacoLoad,
};
