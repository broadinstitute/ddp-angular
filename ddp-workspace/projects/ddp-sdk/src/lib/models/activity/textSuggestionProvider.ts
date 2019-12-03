import { Observable } from 'rxjs';
import { TextSuggestion } from './textSuggestion';

export type TextSuggestionProvider = (queryVal$: Observable<string>) => Observable<TextSuggestion[]>;
