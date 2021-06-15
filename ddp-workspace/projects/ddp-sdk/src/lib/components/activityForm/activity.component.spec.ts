import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    ActivityComponent,
    ActivityServiceAgent,
    AnalyticsEventsService,
    EnrollmentStatusType,
    LoggingService,
    mockComponent,
    ParticipantsSearchServiceAgent,
    SubmitAnnouncementService,
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

fdescribe('ActivityComponent', () => {
    let fixture: ComponentFixture<ActivityComponent>;
    let component: ActivityComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;
    let serviceAgentSpy: jasmine.SpyObj<ActivityServiceAgent>;

    beforeEach(async() => {
        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        const adminPanel = mockComponent({ selector: 'ddp-admin-action-panel', inputs: ['activityReadonly'] });
        const activitySection = mockComponent({
            selector: 'ddp-activity-section',
            inputs: ['section', 'readonly', 'validationRequested', 'studyGuid', 'activityGuid']
        });
        serviceAgentSpy = jasmine.createSpyObj('serviceAgentSpy', { getActivity: of(null) });
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', { getParticipant: of({
                getParticipant: of({
                    guid: '1234',
                    hruid: '5678',
                    status: EnrollmentStatusType.REGISTERED,
                })
            }) });
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
                { provide: SubmitAnnouncementService, useValue: {} },
                { provide: 'ddp.config', useValue: { usesVerticalStepper: [] } },
            ],
            declarations: [ActivityComponent, subjectPanel, adminPanel, activitySection],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityComponent);
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

    it('should not display admin action panel if model is not defined', () => {
        component.ngOnInit();
        component.model = null;
        fixture.detectChanges();

        const subjectPanel = fixture.debugElement.query(By.css('ddp-admin-action-panel'));
        expect(subjectPanel).toBeFalsy();
    });

    it('should display admin action panel if model is defined', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const subjectPanel = fixture.debugElement.query(By.css('ddp-admin-action-panel'));
        expect(subjectPanel).toBeTruthy();
    });

    it('should return readonly false if model readonly is false', () => {
        component.ngOnInit();
        component.model.readonly = false;
        fixture.detectChanges();

        expect(component.isReadonly()).toBeFalse();
    });

    it('should return readonly false if model readonly is true but admin allows editing', () => {
        component.ngOnInit();
        component.model.readonly = true;
        component.updateIsAdminEditing(true);
        fixture.detectChanges();

        expect(component.isReadonly()).toBeFalse();
    });

    it('should return readonly true if model readonly is true but admin does not allow editing', () => {
        component.ngOnInit();
        component.model.readonly = true;
        fixture.detectChanges();

        expect(component.isReadonly()).toBeTrue();
    });
});
