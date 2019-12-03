import { Injectable } from '@angular/core';
import { TextSuggestionProvider } from '../../models/activity/textSuggestionProvider';
import { ActivityRule } from '../../models/activity/activityRule';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { SuggestionMatch } from '../../models/suggestionMatch';
import { DrugServiceAgent } from '../serviceAgents/drugServiceAgent.service';
import { LoggingService } from '../logging.service';
import { Observable } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

const SUGGESTION_LIMIT = 10;

@Injectable()
export class ActivitySuggestionBuilder {
    private suggestionBuilders: Array<ActivityRule>;

    constructor(
        private logger: LoggingService,
        private drugService: DrugServiceAgent) {
        this.suggestionBuilders = [
            {
                type: 'NONE',
                func: (x) => null
            },
            {
                type: 'DRUG',
                func: (x) => this.getDrugSuggestions()
            },
            {
                type: 'INCLUDED',
                func: (x) => this.getIncludedSuggestions(x)
            }
        ];
    }

    public getSuggestionProvider(questionJson: any): TextSuggestionProvider | null {
        const builder = this.suggestionBuilders.find(x => x.type === questionJson.suggestionType);
        if (builder) {
            return builder.func(questionJson.suggestions);
        } else {
            this.logger.logError(
                `ActivityConverter.ActivitySuggestionsBuilder`,
                `Received suggestion of type ${questionJson.suggestionType} that we do not know how to handle`);
            return null;
        }
    }

    private getDrugSuggestions(): TextSuggestionProvider {
        // adding extra-typing info here for documentation purposes
        return (value$: Observable<string>) => value$.pipe(
            // using switchMap to cancel pending requests if new queryval becomes available
            switchMap(value => this.drugService.findDrugSuggestions(value, SUGGESTION_LIMIT).pipe(
                filter(response => response !== null),
                map(response =>
                    <TextSuggestion[]>response.results.map(suggestion => (
                        <TextSuggestion>{
                            value: suggestion.drug.name,
                            matches: suggestion.matches
                        })
                    )
                )
            ))
        );
    }

    private getIncludedSuggestions(suggestions: Array<string>): TextSuggestionProvider {
        return (value$: Observable<string>) => value$.pipe(
            map(value => this.findIncludedSuggestions(value, suggestions))
        );
    }

    private findIncludedSuggestions(value: string, suggestions: Array<string>): Array<TextSuggestion> {
        const lowerCaseValue = value.toLowerCase();
        const length = value.length;

        const indexOfFirstMatch = (suggestion: string): number => suggestion.toLowerCase().indexOf(lowerCaseValue);
        const hasAnyMatch = (suggestion: string): boolean => indexOfFirstMatch(suggestion) !== -1;
        const hasStartWithMatch = (suggestion: string): boolean => suggestion.toLowerCase().startsWith(lowerCaseValue);
        const hasStartOfWordMatch = (suggestion: string): number => {
            const safeValue = lowerCaseValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexp = new RegExp('\\b' + safeValue + '(\\b|\\w+)');
            return suggestion.toLowerCase().search(regexp);
        }

        const compareOffsetAndText = (suggestion1: TextSuggestion, suggestion2: TextSuggestion): number => {
            const offsetCompResult = suggestion1.matches[0].offset - suggestion2.matches[0].offset;
            if (offsetCompResult !== 0) {
                return offsetCompResult;
            } else {
                return suggestion1.value.localeCompare(suggestion2.value);
            }
        };

        let suggestionsLeft = suggestions.filter(hasAnyMatch);

        const startsWithSuggestions = suggestionsLeft.reduce((accumulator: Array<TextSuggestion>, suggestion: string) => {
            if (hasStartWithMatch(suggestion)) {
                accumulator.push({
                    value: suggestion,
                    matches: [{
                        offset: 0,
                        length
                    }]
                });
            }
            return accumulator;
        }, []);

        suggestionsLeft = suggestionsLeft.filter((suggestion: string) => !hasStartWithMatch(suggestion));

        const startOfWordSuggestions = suggestionsLeft.reduce((accumulator: Array<TextSuggestion>, suggestion: string) => {
            const offset = hasStartOfWordMatch(suggestion);
            if (offset !== -1) {
                accumulator.push({
                    value: suggestion,
                    matches: [{
                        offset,
                        length
                    }]
                });
            }
            return accumulator;
        }, []);

        suggestionsLeft = suggestionsLeft.filter((suggestion: string) => hasStartOfWordMatch(suggestion) === -1);

        const suggestionsWithinWords = suggestionsLeft.reduce((accumulator: Array<TextSuggestion>, suggestion: string) => {
            const offset = indexOfFirstMatch(suggestion);
            if (offset !== -1) {
                accumulator.push({
                    value: suggestion,
                    matches: [{
                        offset,
                        length
                    }]
                });
            }
            return accumulator;
        }, []);

        startsWithSuggestions.sort(compareOffsetAndText);
        startOfWordSuggestions.sort(compareOffsetAndText);
        suggestionsWithinWords.sort(compareOffsetAndText);

        return startsWithSuggestions.concat(startOfWordSuggestions, suggestionsWithinWords);
    }
}