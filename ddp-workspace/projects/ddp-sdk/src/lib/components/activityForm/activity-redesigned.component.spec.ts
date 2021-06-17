import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    ActivityRedesignedComponent,
    ActivityServiceAgent,
    AnalyticsEventsService,
    EnrollmentStatusType,
    LoggingService,
    mockComponent,
    ParticipantsSearchServiceAgent,
    WindowRef,
    WorkflowServiceAgent
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('ActivityRedesignedComponent', () => {
    let fixture: ComponentFixture<ActivityRedesignedComponent>;
    let component: ActivityRedesignedComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;

    beforeEach(async () => {
        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        const adminPanel = mockComponent({ selector: 'ddp-admin-action-panel', inputs: ['activityReadonly'] });
        const activitySection = mockComponent({
            selector: 'ddp-activity-section',
            inputs: ['section', 'readonly', 'validationRequested', 'studyGuid', 'activityGuid']
        });
        const serviceAgentSpy = jasmine.createSpyObj('serviceAgentSpy', { getActivity: of(null) });
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', { getParticipant: of({
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.REGISTERED,
            })});
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
                NoopAnimationsModule
            ],
            providers: [
                { provide: LoggingService, useValue: {} },
                { provide: WindowRef, useValue: {} },
                { provide: AnalyticsEventsService, useValue: {} },
                { provide: ActivityServiceAgent, useValue: serviceAgentSpy },
                { provide: WorkflowServiceAgent, useValue: {} },
                { provide: ParticipantsSearchServiceAgent, useValue: participantsSearchSpy },
                { provide: 'ddp.config', useValue: { usesVerticalStepper: [] } },
            ],
            declarations: [ActivityRedesignedComponent, subjectPanel, adminPanel, activitySection],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityRedesignedComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should not display subject panel if selected user is not found', () => {
        participantsSearchSpy.getParticipant.and.returnValue(of(null));
        component.ngOnInit();
        fixture.detectChanges();

        const subjectPanel = fixture.debugElement.query(By.css('ddp-subject-panel'));
        expect(subjectPanel).toBeFalsy();
    });

    it('should display subject panel if selected user is found', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const subjectPanel = fixture.debugElement.query(By.css('ddp-subject-panel'));
        expect(subjectPanel).toBeTruthy();
    });
});
