import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SuggestionServiceAgent } from '../serviceAgents/suggestionServiceAgent.service';
import { LoggingService } from './../../services/logging.service';
import { ActivitySuggestionBuilder } from './activitySuggestionBuilder.service';
import { of } from 'rxjs';

let service: ActivitySuggestionBuilder;
const loggerServiceSpy: jasmine.SpyObj<LoggingService> = jasmine.createSpyObj('LoggingService', ['logError']);
const drugServiceSpy: jasmine.SpyObj<SuggestionServiceAgent> = jasmine.createSpyObj('SuggestionServiceAgent', ['findDrugSuggestions']);

describe('ActivitySuggestionBuilder Test', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                ActivitySuggestionBuilder,
                LoggingService,
                SuggestionServiceAgent
            ]
        });

        service = new ActivitySuggestionBuilder(loggerServiceSpy, drugServiceSpy);
    });

    it('should initialize service', () => {
        expect(service).toBeDefined();
    });

    it('should return DRUG provider', () => {
        expect(service.getSuggestionProvider({ suggestionType: 'DRUG' })).not.toEqual(null);
    });

    it('should return CANCER provider', () => {
        expect(service.getSuggestionProvider({ suggestionType: 'CANCER' })).not.toEqual(null);
    });

    it('should return INCLUDED provider', () => {
        expect(service.getSuggestionProvider({ suggestionType: 'INCLUDED' })).not.toEqual(null);
    });

    it('should return null for suggestionType NONE', () => {
        expect(service.getSuggestionProvider({ suggestionType: 'NONE' })).toEqual(null);
    });

    it('should return null for unknown suggestionType', () => {
        expect(service.getSuggestionProvider({ suggestionType: 'UNKNOWN' })).toEqual(null);
    });

    it(`should return 6 sorted suggestion(sort order:
        preference is for matches at start of word,
        then at the start of word excluding string beginning,
        then other matches) with 1 match`, () => {
        const searchValue = 'foo';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['bar foowar', 'foobar', 'foowoo', 'bar foobar', 'bar foo', 'zarbarfoo aoo', , 'yarbarfoo www', 'barbarfoo', 'barfoo', 'foo']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'foo',
                        matches: [
                            {
                                offset: 0,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'foobar',
                        matches: [
                            {
                                offset: 0,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'foowoo',
                        matches: [
                            {
                                offset: 0,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'bar foo',
                        matches: [
                            {
                                offset: 4,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'bar foobar',
                        matches: [
                            {
                                offset: 4,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'bar foowar',
                        matches: [
                            {
                                offset: 4,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'barfoo',
                        matches: [
                            {
                                offset: 3,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'barbarfoo',
                        matches: [
                            {
                                offset: 6,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'yarbarfoo www',
                        matches: [
                            {
                                offset: 6,
                                length: 3
                            }
                        ]
                    },
                    {
                        value: 'zarbarfoo aoo',
                        matches: [
                            {
                                offset: 6,
                                length: 3
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return 1 suggestion with 1 match', () => {
        const searchValue = 'foo';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['foo bar foo']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'foo bar foo',
                        matches: [
                            {
                                offset: 0,
                                length: 3
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return 1 suggestion with 1 match(regexp should handle value with parentheses)', () => {
        const searchValue = 'bar)';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['foo bar', 'foo (bar)']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'foo (bar)',
                        matches: [
                            {
                                offset: 5,
                                length: 4
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return 1 suggestion with 1 match(regexp should handle value with parentheses)', () => {
        const searchValue = '(bar';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['foo bar', 'foo (bar)']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'foo (bar)',
                        matches: [
                            {
                                offset: 4,
                                length: 4
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return 3 suggestion with 1 match(using lexicographic sorting of matches)', () => {
        const searchValue = 'hello';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['hello world', 'hello kitty', 'hello baby', 'hello']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'hello',
                        matches: [
                            {
                                offset: 0,
                                length: 5
                            }
                        ]
                    },
                    {
                        value: 'hello baby',
                        matches: [
                            {
                                offset: 0,
                                length: 5
                            }
                        ]
                    },
                    {
                        value: 'hello kitty',
                        matches: [
                            {
                                offset: 0,
                                length: 5
                            }
                        ]
                    },
                    {
                        value: 'hello world',
                        matches: [
                            {
                                offset: 0,
                                length: 5
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return 2 sorted suggestion with 1 match(regexp should handle special symbols)', () => {
        const searchValue = '!^*#*$(#)';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['foo bar', 'foo !^*#*$(#)bar', '!^*#*$(#)']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: '!^*#*$(#)',
                        matches: [
                            {
                                offset: 0,
                                length: 9
                            }
                        ]
                    },
                    {
                        value: 'foo !^*#*$(#)bar',
                        matches: [
                            {
                                offset: 4,
                                length: 9
                            }
                        ]
                    }
                ]);
            });
        }
    });


    it('should return 1 suggestion(Upper/Lower case should not affect result)', () => {
        const searchValue = 'eEeEwW';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['EEEEWW!']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([
                    {
                        value: 'EEEEWW!',
                        matches: [
                            {
                                offset: 0,
                                length: 6
                            }
                        ]
                    }
                ]);
            });
        }
    });

    it('should return empty suggestions list', () => {
        const searchValue = 'AAAA';
        const provider = service.getSuggestionProvider({
            suggestionType: 'INCLUDED',
            suggestions: ['EEEEWW!']
        });
        if (provider) {
            provider(of(searchValue)).subscribe(value => {
                expect(value).toEqual([]);
            });
        }
    });
});
