import { getCompletions } from '../pex-grammar/pex-completion-utils';
import { StudiesServiceAgentService } from 'ddp-sdk';

export function pexProvideCompletionItems(
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    studiesServiceAgent: StudiesServiceAgentService // TODO: fetch studies from studiesServiceAgent for the suggestions below
) {
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
