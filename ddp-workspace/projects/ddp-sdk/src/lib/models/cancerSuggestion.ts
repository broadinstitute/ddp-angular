import { SuggestionMatch } from './suggestionMatch';
import { SuggestionDetails } from './suggestionDetails';

export interface CancerSuggestion {
    cancer: SuggestionDetails;
    /**
     * Contains a list of substring matches for the given `Cancer`. The substrings are based within the cancer's `name` property.
     */
    matches: Array<SuggestionMatch>;
}
