import { SuggestionMatch } from './suggestionMatch';
import { SuggestionDetails } from './suggestionDetails';

export interface DrugSuggestion {
    drug: SuggestionDetails;
    /**
     * Contains a list of substring matches for the given `Drug`. The substrings are based within the drug's `name` property.
     */
    matches: Array<SuggestionMatch>;
}
