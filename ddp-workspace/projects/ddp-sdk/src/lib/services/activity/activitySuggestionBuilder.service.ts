import { Injectable } from '@angular/core';
import { TextSuggestionProvider } from '../../models/activity/textSuggestionProvider';
import { SuggestionType } from '../../models/activity/suggestionType';
import { ActivityRule } from '../../models/activity/activityRule';
import { TextSuggestion } from '../../models/activity/textSuggestion';
import { InstitutionServiceAgent } from '../serviceAgents/institutionServiceAgent.service';
import { SuggestionServiceAgent } from '../serviceAgents/suggestionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

const SUGGESTION_LIMIT = 10;

@Injectable()
export class ActivitySuggestionBuilder {
    private suggestionBuilders: Array<ActivityRule>;
    private readonly LOG_SOURCE = 'ActivitySuggestionBuilder';

    constructor(
        private logger: LoggingService,
        private institutionService: InstitutionServiceAgent,
        private suggestionService: SuggestionServiceAgent) {
        this.suggestionBuilders = [
            {
                type: SuggestionType.None,
                func: () => null
            },
            {
                type: SuggestionType.Drug,
                func: () => this.getDrugSuggestions()
            },
            {
                type: SuggestionType.Cancer,
                func: () => this.getCancerSuggestions()
            },
            {
                type: SuggestionType.Included,
                func: (x) => this.getIncludedSuggestions(x)
            },
            {
                type: SuggestionType.Institution,
                func: () => this.getInstitutionSuggestions()
            }
        ];
    }

    public getSuggestionProvider(questionJson: any): TextSuggestionProvider | null {
        const builder = this.suggestionBuilders.find(x => x.type === questionJson.suggestionType);
        if (builder) {
            return builder.func(questionJson.suggestions);
        } else {
            this.logger.logError(this.LOG_SOURCE,
                `Received suggestion of type ${questionJson.suggestionType} that we do not know how to handle`);
            return null;
        }
    }

    private getDrugSuggestions(): TextSuggestionProvider {
        // adding extra-typing info here for documentation purposes
        return (value$: Observable<string>) => value$.pipe(
            // using switchMap to cancel pending requests if new queryval becomes available
            switchMap(value => this.suggestionService.findDrugSuggestions(value, SUGGESTION_LIMIT).pipe(
                filter(response => response !== null),
                map(response =>
                    response.results.map(suggestion => (
                        {
                            value: suggestion.drug.name,
                            matches: suggestion.matches
                        } as TextSuggestion)
                    ) as TextSuggestion[]
                )
            ))
        );
    }

    private getCancerSuggestions(): TextSuggestionProvider {
        return (value$: Observable<string>) => value$.pipe(
            switchMap(value => this.suggestionService.findCancerSuggestions(value, SUGGESTION_LIMIT).pipe(
                filter(response => response !== null),
                map(response => response.results.map(suggestion => ({
                    value: suggestion.cancer.name,
                    matches: suggestion.matches
                })))
            ))
        );
    }

    private getIncludedSuggestions(suggestions: Array<string>): TextSuggestionProvider {
        return (value$: Observable<string>) => value$.pipe(
            map(value => this.buildTextSuggestions(value, suggestions))
        );
    }

    private getInstitutionSuggestions(): TextSuggestionProvider {
        return (value$: Observable<string>) => value$.pipe(
            switchMap(value => this.institutionService.getSummary(of(value), SUGGESTION_LIMIT).pipe(
                map(institutions => institutions.map(institution => institution.name)),
                map(names => this.buildTextSuggestions(value, names))
            ))
        );
    }

    private buildTextSuggestions(value: string, suggestions: Array<string>): Array<TextSuggestion> {
        const length = value.length;
        const lowerCaseValue = value.toLowerCase();
        const safeValue = lowerCaseValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const safeValueRegexp = new RegExp('\\b' + safeValue + '(\\b|\\w+)');

        const indexOfFirstMatch = (suggestion: string): number => suggestion.toLowerCase().indexOf(lowerCaseValue);
        const hasAnyMatch = (suggestion: string): boolean => indexOfFirstMatch(suggestion) !== -1;
        const hasStartWithMatch = (suggestion: string): boolean => suggestion.toLowerCase().startsWith(lowerCaseValue);
        const indexOfStartWithMatch = (suggestion: string): number => hasStartWithMatch(suggestion) ? 0 : -1;
        const indexOfStartOfWordMatch = (suggestion: string): number => suggestion.toLowerCase().search(safeValueRegexp);

        const compareOffsetAndText = (suggestion1: TextSuggestion, suggestion2: TextSuggestion): number => {
            const offsetCompResult = suggestion1.matches[0].offset - suggestion2.matches[0].offset;
            if (offsetCompResult !== 0) {
                return offsetCompResult;
            } else {
                return suggestion1.value.localeCompare(suggestion2.value);
            }
        };

        const findMatches = (suggestionsList: Array<string>, matcher: (val: string) => number): MatchResult => {
            const leftover = [];
            const matches = suggestionsList.reduce((accumulator: Array<TextSuggestion>, suggestion: string) => {
                const offset = matcher(suggestion);
                if (offset >= 0) {
                    accumulator.push({
                        value: suggestion,
                        matches: [{
                            offset,
                            length
                        }]
                    });
                } else {
                    leftover.push(suggestion);
                }
                return accumulator;
            }, []);
            return { matches, leftover };
        };

        const suggestionsMatched = suggestions.filter(hasAnyMatch);
        const resultForStartWith = findMatches(suggestionsMatched, indexOfStartWithMatch);
        const resultForStartOfWord = findMatches(resultForStartWith.leftover, indexOfStartOfWordMatch);
        const resultForWithinWord = findMatches(resultForStartOfWord.leftover, indexOfFirstMatch);
        const startsWithSuggestions = resultForStartWith.matches;
        const startOfWordSuggestions = resultForStartOfWord.matches;
        const suggestionsWithinWords = resultForWithinWord.matches;

        startsWithSuggestions.sort(compareOffsetAndText);
        startOfWordSuggestions.sort(compareOffsetAndText);
        suggestionsWithinWords.sort(compareOffsetAndText);

        return [
            ...startsWithSuggestions,
            ...startOfWordSuggestions,
            ...suggestionsWithinWords
        ];
    }
}

interface MatchResult {
    matches: Array<TextSuggestion>;
    leftover: Array<string>;
}
