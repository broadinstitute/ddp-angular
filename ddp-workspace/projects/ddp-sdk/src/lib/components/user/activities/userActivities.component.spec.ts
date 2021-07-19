import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    UserActivitiesComponent,
    UserActivityServiceAgent,
    LoggingService,
    ActivityServiceAgent,
    AnalyticsEventsService,
    SessionMementoService
} from 'ddp-sdk';
import { Observable, of } from 'rxjs';
import { ActivityInstanceStatusServiceAgent } from '../../../services/serviceAgents/activityInstanceStatusServiceAgent.service';
import { MatTableModule } from '@angular/material/table';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('UserActivitiesComponent', () => {
    let fixture: ComponentFixture<UserActivitiesComponent>;
    let component: UserActivitiesComponent;
    let debugElement: DebugElement;
    let serviceAgentSpy: jasmine.SpyObj<UserActivityServiceAgent>;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;

    beforeEach(async () => {
        serviceAgentSpy = jasmine.createSpyObj('serviceAgentSpy', {
            updateSelectedUser: undefined,
            resetSelectedUser: undefined,
            getActivities: of([])
        });
        sessionSpy = jasmine.createSpyObj('sessionSpy', ['setParticipant']);
        const statusesServiceAgentSpy = jasmine.createSpyObj('statusesServiceAgentSpy', { getStatuses: of([]) });
        const analyticsSpy = jasmine.createSpyObj('analyticsSpy', ['emitCustomEvent']);
        await TestBed.configureTestingModule({
            imports: [
                MatTableModule,
                NoopAnimationsModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
            ],
            providers: [
                { provide: UserActivityServiceAgent, useValue: serviceAgentSpy },
                { provide: ActivityInstanceStatusServiceAgent, useValue: statusesServiceAgentSpy },
                { provide: LoggingService, useValue: {} },
                { provide: ActivityServiceAgent, useValue: {} },
                { provide: AnalyticsEventsService, useValue: analyticsSpy },
                { provide: SessionMementoService, useValue: sessionSpy },
                { provide: 'ddp.config', useValue: {} },
            ],
            declarations: [UserActivitiesComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserActivitiesComponent);
        component = fixture.debugElement.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should set participant from the input', () => {
        const participantGuid = '123';
        component.participantGuid = participantGuid;
        component.ngOnInit();
        expect(sessionSpy.setParticipant).toHaveBeenCalledWith(participantGuid);
    });

    it('should not set participant from the input', () => {
        component.participantGuid = null;
        component.ngOnInit();
        expect(sessionSpy.setParticipant).not.toHaveBeenCalled();
    });

    it('should use input activities', () => {
        const userActivities = [{
            activityCode: 'code',
            activityDescription: 'Description',
            activityName: 'test activity',
            activitySubtitle: null,
            activitySubtype: '',
            activitySummary: 'Summary',
            activityTitle: 'test activity title',
            activityType: 'activity type',
            canDelete: false,
            instanceGuid: '789',
            isFollowup: false,
            isHidden: false,
            numQuestions: 0,
            numQuestionsAnswered: 0,
            readonly: false,
            statusCode: 'TEST_CODE'
        }];
        component.activities = userActivities;
        component.ngOnInit();
        expect(component.dataSource).toBe(userActivities);
    });
});
