import { getCompletions } from '../pex-grammar/pex-completion-utils';

export const pexCompletionItemProvider: monaco.languages.CompletionItemProvider = {
    provideCompletionItems: function (model: monaco.editor.ITextModel, position: monaco.Position) {
        const completions = getCompletions(model.getValue(), position);
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };
        return {
            suggestions: completions.map((completion) => ({
                label: completion,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: completion,
                range
            }))
        };
    }
}
