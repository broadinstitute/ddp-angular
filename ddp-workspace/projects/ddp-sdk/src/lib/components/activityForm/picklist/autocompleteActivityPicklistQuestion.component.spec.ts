import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { ActivityPicklistQuestionBlock, NGXTranslateService } from 'ddp-sdk';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { of } from 'rxjs';
import { AutocompleteActivityPicklistQuestion } from './autocompleteActivityPicklistQuestion.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

describe('AutocompleteActivityPicklistQuestion', () => {
    const questionBlock = {
        picklistSuggestions: [
            { label: 'Sarcoma', isParent: true, value: 'SARCOMA' },
            { label: 'Angiosarcoma', parent: 'Sarcoma', value: 'ANGIOSARCOMA' },
            { label: 'Chondrosarcoma', parent: 'Sarcoma', value: 'CHONDROSARCOMA' },
            { label: 'Endocrine cancer', isParent: true, value: 'ENDOCRINE_CANCER' },
            { label: 'Pheochromocytoma', parent: 'Endocrine cancer', value: 'PHEOCHROMOCYTOMA' },
        ],
        renderMode: 'AUTOCOMPLETE',
    } as ActivityPicklistQuestionBlock;

    let component: AutocompleteActivityPicklistQuestion;
    let fixture: ComponentFixture<AutocompleteActivityPicklistQuestion>;
    const ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', ['getTranslation']);
    ngxTranslateServiceSpy.getTranslation.and.callFake(() => {
        return of({
            'SDK.Validators.Autocomplete': 'No {{text}} is found',
        });
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: NGXTranslateService, useValue: ngxTranslateServiceSpy }
            ],
            declarations: [AutocompleteActivityPicklistQuestion]
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

    it('should filter the list of suggestions by child label', fakeAsync(() => {
        component.inputFormControl.setValue('hondrosarc', { emitEvent: true });
        fixture.detectChanges();
        tick(200);

        const suggestions = [
            { label: 'Sarcoma', isParent: true, value: 'SARCOMA' },
            { label: 'Chondrosarcoma', parent: 'Sarcoma', value: 'CHONDROSARCOMA' },
        ];
        expect(component.filteredSuggestions).toEqual(suggestions);
    }));

    it('should filter the list of suggestions by parent label', fakeAsync(() => {
        component.inputFormControl.setValue('Endocrine');
        fixture.detectChanges();
        tick(200);

        const suggestions = [
            { label: 'Endocrine cancer', isParent: true, value: 'ENDOCRINE_CANCER' },
            { label: 'Pheochromocytoma', parent: 'Endocrine cancer', value: 'PHEOCHROMOCYTOMA' },
        ];
        expect(component.filteredSuggestions).toEqual(suggestions);
    }));

    it('should trim search query', fakeAsync(() => {
        component.inputFormControl.setValue(' Endocrine   ');
        fixture.detectChanges();
        tick(200);

        const suggestions = [
            { label: 'Endocrine cancer', isParent: true, value: 'ENDOCRINE_CANCER' },
            { label: 'Pheochromocytoma', parent: 'Endocrine cancer', value: 'PHEOCHROMOCYTOMA' },
        ];
        expect(component.filteredSuggestions).toEqual(suggestions);
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

    it('should set initial value from the list', () => {
        component.block = {...questionBlock, answer: [{ detail: null, stableId: 'CHONDROSARCOMA' }]} as ActivityPicklistQuestionBlock;
        component.ngOnInit();
        expect(component.inputFormControl.value).toEqual({ label: 'Chondrosarcoma', parent: 'Sarcoma', value: 'CHONDROSARCOMA' });
    });

    it('should emit valueChanged with selected option', fakeAsync(() => {
        const valueChangedSpy = spyOn(component.valueChanged, 'emit');
        component.inputFormControl.setValue({ label: 'Chondrosarcoma', parent: 'Sarcoma', value: 'CHONDROSARCOMA' });
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

    it('should display suggested option correctly', () => {
        expect(component.displayAutoComplete({ label: 'Chondrosarcoma', parent: 'Sarcoma', value: 'CHONDROSARCOMA' }))
            .toBe('Chondrosarcoma');
    });

    it('should display custom text correctly', () => {
        expect(component.displayAutoComplete('blabla')).toBe('blabla');
    });

    it('should display custom empty string if nothing is entered', () => {
        expect(component.displayAutoComplete(null)).toBe('');
    });
});
