import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent, ToolkitConfigurationService } from 'toolkit';
import {
    ParticipantsSearchServiceAgent,
    EnrollmentStatusType,
    AnnouncementsServiceAgent,
    mockComponent,
    SessionMementoService, UserActivityServiceAgent, ActivityInstance
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const activityMock: ActivityInstance = {
    activityCode: 'code',
    activityDescription: 'Description',
    activityName: 'test activity',
    activitySubtitle: null,
    activitySubtype: '',
    activitySummary: 'Summary',
    activityTitle: 'test activity title',
    activityType: 'activity type',
    canDelete: false,
    instanceGuid: '123',
    isFollowup: false,
    isHidden: false,
    numQuestions: 0,
    numQuestionsAnswered: 0,
    readonly: false,
    statusCode: 'TEST_CODE'
};

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let component: DashboardComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;
    let toolkitConfigMock: ToolkitConfigurationService;
    let userActivityServiceAgentSpy: jasmine.SpyObj<UserActivityServiceAgent>;

    beforeEach(async () => {
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', {
            getParticipant: of({
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.REGISTERED,
            })
        });
        toolkitConfigMock = new ToolkitConfigurationService();
        toolkitConfigMock.activityUrl = 'testActivityUrl';
        sessionSpy = jasmine.createSpyObj('sessionSpy', ['setParticipant']);
        userActivityServiceAgentSpy = jasmine.createSpyObj('userActivityServiceAgentSpy', { getActivities: of([]) });

        const announcementsSpy = jasmine.createSpyObj('participantsSearchSpy', { getMessages: of([]) });
        const toolkitHeader = mockComponent({ selector: 'toolkit-header', inputs: ['showButtons'] });
        const dashboard = mockComponent({ selector: 'ddp-dashboard', inputs: ['studyGuid', 'selectedUserGuid', 'activities'] });
        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([{path: 'testActivityUrl/:id', component: DashboardComponent}]),
                NoopAnimationsModule
            ],
            providers: [
                { provide: ParticipantsSearchServiceAgent, useValue: participantsSearchSpy },
                { provide: AnnouncementsServiceAgent, useValue: announcementsSpy },
                { provide: SessionMementoService, useValue: sessionSpy },
                { provide: UserActivityServiceAgent, useValue: userActivityServiceAgentSpy },
                { provide: 'toolkit.toolkitConfig', useValue: toolkitConfigMock },
            ],
            declarations: [DashboardComponent, toolkitHeader, dashboard, subjectPanel],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
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

    it('should reset participant in session on init for participant dashboard', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        expect(sessionSpy.setParticipant).toHaveBeenCalledWith(null);
    });

    it('should not reset participant in session on init for regular dashboard', () => {
        toolkitConfigMock.useParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        expect(sessionSpy.setParticipant).not.toHaveBeenCalled();
    });

    it('should set participant in session before action navigation for participant dashboard', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        const participantGuid = 'userGuid567';
        component.navigate('1', participantGuid);

        expect(sessionSpy.setParticipant).toHaveBeenCalledWith(participantGuid);
    });

    it('should not set participant in session before action navigation for regular dashboard', () => {
        toolkitConfigMock.useParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        component.navigate('1', 'userGuid567');

        expect(sessionSpy.setParticipant).not.toHaveBeenCalled();
    });

    it('retrieves user activities', (done) => {
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([activityMock]));
        component.ngOnInit();
        fixture.detectChanges();

        component.userActivities$.subscribe((activities) => {
            expect(activities).toEqual([activityMock]);
            done();
        });
    });

    it('sets user activities as empty array', (done) => {
        userActivityServiceAgentSpy.getActivities.and.returnValue(of(null));
        component.ngOnInit();
        fixture.detectChanges();

        component.userActivities$.subscribe((activities) => {
            expect(activities).toEqual([]);
            done();
        });
    });
});
