import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { PicklistRenderMode } from '../../../models/activity/picklistRenderMode';
import { SearchHighlightPipe } from '../../../pipes/searchHighlight.pipe';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { PicklistSortingPolicy } from '../../../services/picklistSortingPolicy.service';
import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';

import { ActivityPicklistRemoteAutoCompleteOptionsComponent } from './activity-picklist-remote-auto-complete-options.component';

describe('ActivityPicklistRemoteAutoCompleteOptionsComponent', () => {
    const questionBlock = {
        picklistOptions: [
            { optionLabel: 'Some cancer', stableId: 'SOME_CANCER' },
            { optionLabel: 'Another cancer', stableId: 'ANOTHER_CANCER' },
        ],
        renderMode: PicklistRenderMode.AUTOCOMPLETE,
    } as ActivityPicklistQuestionBlock;

    let component: ActivityPicklistRemoteAutoCompleteOptionsComponent;
    let fixture: ComponentFixture<ActivityPicklistRemoteAutoCompleteOptionsComponent>;
    let ngxTranslateServiceSpy;

    beforeEach(() => {
        ngxTranslateServiceSpy = jasmine.createSpyObj('NGXTranslateService', [
            'getTranslation',
        ]);
        ngxTranslateServiceSpy.getTranslation.and.callFake(() =>
            of({
                'SDK.Validators.Autocomplete': 'No {{text}} is found',
            })
        );

        TestBed.configureTestingModule({
            imports: [
                MatInputModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                TranslateTestingModule,
                ReactiveFormsModule,
            ],
            providers: [
                {
                    provide: NGXTranslateService,
                    useValue: ngxTranslateServiceSpy,
                },
                {
                    provide: PicklistSortingPolicy,
                    useValue: new PicklistSortingPolicy(),
                },
                {
                    provide: 'ddp.config',
                    useValue: {
                        notSortedPicklistAutocompleteStableIds: [],
                        picklistAutocompleteIgnoredSymbols: [],
                    },
                },
            ],
            declarations: [
                ActivityPicklistRemoteAutoCompleteOptionsComponent,
                SearchHighlightPipe,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(
            ActivityPicklistRemoteAutoCompleteOptionsComponent
        );
        component = fixture.componentInstance;
        component.block = { ...questionBlock } as ActivityPicklistQuestionBlock;
        fixture.detectChanges();
    });

    it('should create component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
});
