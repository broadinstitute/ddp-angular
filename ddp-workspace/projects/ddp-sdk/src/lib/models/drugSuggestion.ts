import { SuggestionMatch } from './suggestionMatch';
import { Drug } from './drug';

export interface DrugSuggestion {
    drug: Drug;
    /**
     * Contains a list of substring matches for the given `Drug`. The substrings are based within the drug's `name` property.
     */
    matches: Array<SuggestionMatch>;
}
