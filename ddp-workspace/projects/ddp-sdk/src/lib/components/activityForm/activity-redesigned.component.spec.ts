import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    ActivityRedesignedComponent,
    ActivityServiceAgent,
    AnalyticsEventsService,
    LoggingService,
    mockComponent,
    SessionMementoService,
    WindowRef,
    WorkflowServiceAgent
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

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
    let debugElement: DebugElement;
    const invitationId = 'testInvitationId';

    beforeEach(async() => {
        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['invitationId'] });
        const adminPanel = mockComponent({ selector: 'ddp-admin-action-panel', inputs: ['activityReadonly'] });
        const activitySection = mockComponent({
            selector: 'ddp-activity-section',
            inputs: ['section', 'readonly', 'validationRequested', 'studyGuid', 'activityGuid']
        });
        const serviceAgentSpy = jasmine.createSpyObj('serviceAgentSpy', { getActivity: of(null) });
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
                { provide: SessionMementoService, useValue: { session: { invitationId } } },
                { provide: ActivityServiceAgent, useValue: serviceAgentSpy },
                { provide: WorkflowServiceAgent, useValue: {} },
                { provide: 'ddp.config', useValue: { usesVerticalStepper: [] } },
            ],
            declarations: [ActivityRedesignedComponent, subjectPanel, adminPanel, activitySection],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivityRedesignedComponent);
        component = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should set invitation id from session', () => {
        expect(component.invitationId).toBe(invitationId);
    });
});
