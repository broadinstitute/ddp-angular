import { SuggestionMatch } from '../suggestionMatch';

export interface TextSuggestion {
    value: string;
    matches: Array<SuggestionMatch>;
}
