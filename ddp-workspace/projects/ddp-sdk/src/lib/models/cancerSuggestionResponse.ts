import { CancerSuggestion } from './cancerSuggestion';

export interface CancerSuggestionResponse {
    query: string;
    results: Array<CancerSuggestion>;
}
