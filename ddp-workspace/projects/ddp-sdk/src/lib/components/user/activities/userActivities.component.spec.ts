import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserActivitiesComponent, UserActivityServiceAgent, LoggingService, ActivityServiceAgent, AnalyticsEventsService } from 'ddp-sdk';
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

  beforeEach(async() => {
    serviceAgentSpy = jasmine.createSpyObj('serviceAgentSpy', {
      updateSelectedUser: undefined,
      resetSelectedUser: undefined,
      getActivities: of([])
    });
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

  it('updates selected user for announcements service', () => {
    const id = '12345';
    component.selectedUserGuid = id;
    serviceAgentSpy.updateSelectedUser.calls.reset();
    serviceAgentSpy.resetSelectedUser.calls.reset();
    component.ngOnInit();

    expect(serviceAgentSpy.updateSelectedUser).toHaveBeenCalledWith(id);
    expect(serviceAgentSpy.resetSelectedUser).not.toHaveBeenCalled();
  });

  it('resets selected user for announcements service', () => {
    component.selectedUserGuid = null;
    serviceAgentSpy.updateSelectedUser.calls.reset();
    serviceAgentSpy.resetSelectedUser.calls.reset();
    component.ngOnInit();

    expect(serviceAgentSpy.updateSelectedUser).not.toHaveBeenCalled();
    expect(serviceAgentSpy.resetSelectedUser).toHaveBeenCalledWith();
  });
});
