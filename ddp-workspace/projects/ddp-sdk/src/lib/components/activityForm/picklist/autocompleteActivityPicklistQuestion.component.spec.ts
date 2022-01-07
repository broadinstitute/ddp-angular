import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import {
    ActivityPicklistNormalizedGroup,
    ActivityPicklistOption,
    ActivityPicklistQuestionBlock,
    NGXTranslateService,
    PicklistSortingPolicy,
    SortOrder
} from 'ddp-sdk';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { AutocompleteActivityPicklistQuestion } from './autocompleteActivityPicklistQuestion.component';
import { PicklistRenderMode } from '../../../models/activity/picklistRenderMode';
import { SearchHighlightPipe } from '../../../pipes/searchHighlight.pipe';


describe('AutocompleteActivityPicklistQuestion', () => {
    const questionBlock = {
        picklistGroups: [
            {
                name: 'Sarcoma',
                options: [
                    { optionLabel: 'Angiosarcoma', stableId: 'ANGIOSARCOMA' },
                    { optionLabel: 'Chondrosarcoma', stableId: 'CHONDROSARCOMA' }
                ]
            },
            {
                name: 'Endocrine cancer',
                options: [
                    { optionLabel: 'Pheochromocytoma', stableId: 'PHEOCHROMOCYTOMA' },
                    { optionLabel: 'Endocrine cancer test', stableId: 'ENDOCRINE_CANCER_TEST' },
                ]
            },
        ],
        picklistOptions: [
            { optionLabel: 'Some cancer', stableId: 'SOME_CANCER' },
            { optionLabel: 'Another cancer', stableId: 'ANOTHER_CANCER' }
        ],
        renderMode: PicklistRenderMode.AUTOCOMPLETE,
    } as ActivityPicklistQuestionBlock;

    let component: AutocompleteActivityPicklistQuestion;
    let fixture: ComponentFixture<AutocompleteActivityPicklistQuestion>;
    let ngxTranslateServiceSpy;

    beforeEach(() => {
        ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
        ngxTranslateServiceSpy.getTranslation.and.callFake(() => of({
            'SDK.Validators.Autocomplete': 'No {{text}} is found',
        }));

        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: NGXTranslateService, useValue: ngxTranslateServiceSpy },
                { provide: PicklistSortingPolicy, useValue:  new PicklistSortingPolicy() },
                { provide: 'ddp.config',
                    useValue: {
                        notSortedPicklistAutocompleteStableIds: [],
                        picklistAutocompleteIgnoredSymbols: []
                    }
                }
            ],
            declarations: [AutocompleteActivityPicklistQuestion, SearchHighlightPipe]
        }).compileComponents();

        fixture = TestBed.createComponent(AutocompleteActivityPicklistQuestion);
        component = fixture.componentInstance;
        component.block = {...questionBlock} as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
    });

    it('should create component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should generate the list of groups suggestions on init', fakeAsync(() => {
        tick(200);
        expect(component.filteredGroups).toEqual(questionBlock.picklistGroups);
    }));

    it('should generate the list of not grouped suggestions on init', fakeAsync(() => {
        tick(200);
        expect(component.filteredOptions).toEqual(questionBlock.picklistOptions);
    }));

    it('should filter the list of suggestions by child label', fakeAsync(() => {
        component.inputFormControl.setValue('hondrosarc', { emitEvent: true });
        fixture.detectChanges();
        tick(200);

        const suggestions: ActivityPicklistNormalizedGroup[] = [
            {
                name: 'Sarcoma',
                options: [{ optionLabel: 'Chondrosarcoma', stableId: 'CHONDROSARCOMA', } as ActivityPicklistOption]
            }
        ];
        expect(component.filteredGroups).toEqual(suggestions);
    }));

    it('should filter the list of suggestions by parent label', fakeAsync(() => {
        component.inputFormControl.setValue('Endocrine');
        fixture.detectChanges();
        tick(200);

        const suggestions = [
            {
                name: 'Endocrine cancer',
                options: [
                    { optionLabel: 'Pheochromocytoma', stableId: 'PHEOCHROMOCYTOMA' } as ActivityPicklistOption,
                    { optionLabel: 'Endocrine cancer test', stableId: 'ENDOCRINE_CANCER_TEST' } as ActivityPicklistOption,
                ]
            }
        ];
        expect(component.filteredGroups).toEqual(suggestions);
    }));

    it('should filter the list of not grouped suggestions', fakeAsync(() => {
        component.inputFormControl.setValue('Some');
        fixture.detectChanges();
        tick(200);

        const suggestions = [{ optionLabel: 'Some cancer', stableId: 'SOME_CANCER' } as ActivityPicklistOption];
        expect(component.filteredOptions).toEqual(suggestions);
    }));

    it('should trim search query', fakeAsync(() => {
        component.inputFormControl.setValue(' Endocrine   ');
        fixture.detectChanges();
        tick(200);

        const suggestions = [
            {
                name: 'Endocrine cancer',
                options: [
                    { optionLabel: 'Pheochromocytoma', stableId: 'PHEOCHROMOCYTOMA' } as ActivityPicklistOption,
                    { optionLabel: 'Endocrine cancer test', stableId: 'ENDOCRINE_CANCER_TEST' } as ActivityPicklistOption,
                ]
            }
        ];
        expect(component.filteredGroups).toEqual(suggestions);
    }));

    it('should not set any initial value', () => {
        expect(component.inputFormControl.value).toBe(null);
    });

    it('should set initial custom value', () => {
        const customSavedValue = 'very custom cancer';
        component.block = {...questionBlock, answer: [{ detail: customSavedValue, stableId: 'OTHER' }]} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        expect(component.inputFormControl.value).toBe(customSavedValue);
    });

    it('should set initial value from groups', () => {
        component.block = {...questionBlock, answer: [{ detail: null, stableId: 'CHONDROSARCOMA' }]} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        expect(component.inputFormControl.value).toEqual({ optionLabel: 'Chondrosarcoma', stableId: 'CHONDROSARCOMA' });
    });

    it('should set initial value from not from  groups', () => {
        component.block = {...questionBlock, answer: [{ detail: null, stableId: 'SOME_CANCER' }]} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        expect(component.inputFormControl.value).toEqual({ optionLabel: 'Some cancer', stableId: 'SOME_CANCER' });
    });

    it('should emit valueChanged with selected option', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        component.inputFormControl.setValue({ optionLabel: 'Chondrosarcoma', stableId: 'CHONDROSARCOMA' });
        fixture.detectChanges();
        tick(200);

        const answer = [{ stableId: 'CHONDROSARCOMA', detail: null }];
        expect(component.block.answer).toEqual(answer);
        expect(valueChangedSpy).toHaveBeenCalledWith(answer);
    }));

    it('should emit valueChanged with selected option if user typed the option from the list', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        component.inputFormControl.setValue('Chondrosarcoma', { emitEvent: true });
        fixture.detectChanges();
        tick(200);

        const answer = [{ stableId: 'CHONDROSARCOMA', detail: null }];
        expect(component.block.answer).toEqual(answer);
        expect(valueChangedSpy).toHaveBeenCalledWith(answer);
    }));

    it('should emit valueChanged with selected option if user typed the option from the list of not-grouped options', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        component.inputFormControl.setValue('Some cancer', { emitEvent: true });
        fixture.detectChanges();
        tick(200);

        const answer = [{ stableId: 'SOME_CANCER', detail: null }];
        expect(component.block.answer).toEqual(answer);
        expect(valueChangedSpy).toHaveBeenCalledWith(answer);
    }));

    it('should emit valueChanged with custom option', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        const customSavedValue = 'very custom cancer';
        component.block = {...questionBlock, customValue: 'OTHER'} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        component.inputFormControl.setValue(customSavedValue);
        fixture.detectChanges();
        tick(200);

        const answer = [{ stableId: 'OTHER', detail: customSavedValue }];
        expect(component.block.answer).toEqual(answer);
        expect(valueChangedSpy).toHaveBeenCalledWith(answer);
    }));

    it('should not emit valueChanged with custom option if query length less than minimal', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        const customSavedValue = 'v';
        component.block = {...questionBlock, customValue: 'OTHER'} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        component.inputFormControl.setValue(customSavedValue);
        fixture.detectChanges();
        tick(200);

        expect(component.block.answer).toBeFalsy();
        expect(valueChangedSpy).not.toHaveBeenCalled();
    }));

    it('should emit valueChanged with null if user resets the input', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        component.inputFormControl.setValue('');
        fixture.detectChanges();
        tick(200);

        expect(component.block.answer).toEqual(null);
        expect(valueChangedSpy).toHaveBeenCalledWith(null);
    }));

    it('should display suggested option correctly', () => {
        expect(component.displayAutoComplete({ optionLabel: 'Chondrosarcoma' } as ActivityPicklistOption))
            .toBe('Chondrosarcoma');
    });

    it('should display custom text correctly', () => {
        expect(component.displayAutoComplete('blabla')).toBe('blabla');
    });

    it('should display custom empty string if nothing is entered', () => {
        expect(component.displayAutoComplete(null)).toBe('');
    });

    it('should disable autocomplete input when readonly is true', () => {
        component.readonly = true;
        component.ngOnChanges({ readonly: { currentValue: true } as SimpleChange});
        expect(component.inputFormControl.disabled).toBeTrue();
    });
});

describe('AutocompleteActivityPicklistQuestion sorting (with default ALPHABETICAL policy)', () => {
    const questionBlock = {
        picklistGroups: [
            {
                name: 'Melanomas',
                options: [
                    { optionLabel: 'Cutaneous melanoma', stableId: 'CUTANEOUS_MELANOMA' },
                    { optionLabel: 'Ocular melanoma (OM)', stableId: 'OCULAR_MELANOMA' }
                ]
            },
            {
                name: 'Breast cancers',
                options: [
                    { optionLabel: 'Invasive Ductal Carcinoma', stableId: 'INVASIVE_DUCTAL' },
                    { optionLabel: 'Breast carcinoma', stableId: 'BREAST_CARCINOMA' },
                ]
            },
        ],
        picklistOptions: [
            { optionLabel: 'Other cancer', stableId: 'OTHER_CANCER' },
            { optionLabel: 'Another test cancer', stableId: 'ANOTHER_TEST_CANCER' }
        ],
        renderMode: PicklistRenderMode.AUTOCOMPLETE,
    } as ActivityPicklistQuestionBlock;

    let component: AutocompleteActivityPicklistQuestion;
    let fixture: ComponentFixture<AutocompleteActivityPicklistQuestion>;
    let configServiceSpy;

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj('ddp.config', null,
            {
                notSortedPicklistAutocompleteStableIds: [],
                picklistAutocompleteIgnoredSymbols: []
            });

        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                ReactiveFormsModule,
            ],
            providers: [
                {provide: NGXTranslateService, useValue: {}},
                {provide: PicklistSortingPolicy, useValue: new PicklistSortingPolicy(SortOrder.ALPHABETICAL, 'UNSURE')},
                {provide: 'ddp.config', useValue: configServiceSpy}
            ],
            declarations: [AutocompleteActivityPicklistQuestion, SearchHighlightPipe]
        }).compileComponents();

        fixture = TestBed.createComponent(AutocompleteActivityPicklistQuestion);
        component = fixture.componentInstance;
        component.block = {...questionBlock} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
    });

    it('should sort options alphabetically (by default)', () => {
        expect(component.filteredGroups[0].name).toEqual('Breast cancers');
        expect(component.filteredGroups[0].options[0].optionLabel).toEqual('Breast carcinoma');
        expect(component.filteredOptions[0].optionLabel).toEqual('Another test cancer');
    });

    it('should keep  options as is (do not sort alphabetically)', () => {
        Object.defineProperty(configServiceSpy , 'notSortedPicklistAutocompleteStableIds', {
            value: ['stableId123']
        });
        component.block.stableId = 'stableId123';
        fixture.detectChanges();

        expect(component.filteredGroups[0].name).toEqual('Melanomas');
        expect(component.filteredGroups[0].options[0].optionLabel).toEqual('Cutaneous melanoma');
        expect(component.filteredOptions[0].optionLabel).toEqual('Other cancer');
    });
});
