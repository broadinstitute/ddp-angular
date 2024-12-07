import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    UserActivityServiceAgent,
    LoggingService,
    ActivityServiceAgent,
    AnalyticsEventsService,
    SessionMementoService,
    ActivityInstanceStatusServiceAgent
} from 'ddp-sdk';
import { Observable, of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { UserActivitiesComponent } from './user-activities.component';

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
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });
});
