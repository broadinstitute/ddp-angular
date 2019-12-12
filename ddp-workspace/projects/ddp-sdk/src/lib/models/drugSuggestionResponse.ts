import { DrugSuggestion } from './drugSuggestion';

export interface DrugSuggestionResponse {
    query: string;
    results: Array<DrugSuggestion>;
}
