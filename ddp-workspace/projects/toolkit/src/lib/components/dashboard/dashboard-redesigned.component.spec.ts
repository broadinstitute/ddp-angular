import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardRedesignedComponent, HeaderConfigurationService, ToolkitConfigurationService } from 'toolkit';
import {
    ParticipantsSearchServiceAgent,
    EnrollmentStatusType,
    AnnouncementsServiceAgent,
    mockComponent,
    SessionMementoService,
    UserInvitationServiceAgent,
    Session,
    GovernedParticipantsServiceAgent,
    UserActivityServiceAgent,
    UserProfileServiceAgent,
    ActivityInstance,
    UserProfile,
    Participant,
    UserActivitiesComponent,
    LoggingService,
    ActivityServiceAgent,
    AnalyticsEventsService
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { ActivityInstanceStatusServiceAgent } from '../../../../../ddp-sdk/src/lib/services/serviceAgents/activityInstanceStatusServiceAgent.service';
import { MatTableModule } from '@angular/material/table';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                Toolkit: {
                    Dashboard: {
                        ParticipantsTitle: 'Participant Dashboard test',
                        Title: 'Dashboard test',
                        UserLabel: 'You test',
                        ChildLabel: 'Your child test',
                        HidePanel: 'Hide test',
                        ShowPanel: 'Show test',
                    },
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

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
    instanceGuid: '789',
    isFollowup: false,
    isHidden: false,
    numQuestions: 0,
    numQuestionsAnswered: 0,
    readonly: false,
    statusCode: 'TEST_CODE'
};

describe('DashboardRedesignedComponent', () => {
    let fixture: ComponentFixture<DashboardRedesignedComponent>;
    let component: DashboardRedesignedComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;
    let userActivityServiceAgentSpy: jasmine.SpyObj<UserActivityServiceAgent>;
    let governedParticipantsSpy: jasmine.SpyObj<GovernedParticipantsServiceAgent>;
    let sessionMock: SessionMementoService;
    let toolkitConfigMock: ToolkitConfigurationService;
    let profileMock: UserProfile;
    let loader: HarnessLoader;
    const userGuid = 'userGuid567';
    const studyGuid = 'PANCAN';

    beforeEach(async () => {
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', {
            getParticipant: of({
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.REGISTERED,
            })
        });
        toolkitConfigMock = new ToolkitConfigurationService();
        profileMock = {firstName: '', lastName: ''} as UserProfile;
        const userProfileServiceAgentMock = { profile: of({ profile: profileMock }) } as UserProfileServiceAgent;

        const announcementsSpy = jasmine.createSpyObj('participantsSearchSpy', { getMessages: of([]) });
        governedParticipantsSpy = jasmine.createSpyObj('governedParticipantsSpy', { getGovernedStudyParticipants: of([]) });
        userActivityServiceAgentSpy = jasmine.createSpyObj('userActivityServiceAgentSpy', { getActivities: of([]) });
        sessionMock = {
            isAuthenticatedAdminSession: () => true,
            setParticipant: () => {},
            session: ({ participantGuid: '1243', userGuid } as Session)
        } as SessionMementoService;
        const headerConfigSpy = jasmine.createSpyObj('participantsSearchSpy', ['setupDefaultHeader']);
        const userInvitationSpy = jasmine.createSpyObj('userInvitationSpy', { getInvitations: of([]) });
        const statusesServiceAgentSpy = jasmine.createSpyObj('statusesServiceAgentSpy', { getStatuses: of([]) });
        const loggerSpy = jasmine.createSpyObj('loggerSpy', ['logEvent']);
        const analyticsSpy = jasmine.createSpyObj('analyticsSpy', ['emitCustomEvent']);

        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatExpansionModule,
                MatIconModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                NoopAnimationsModule,
                // UserActivitiesComponent dependencies
                MatTableModule,
            ],
            providers: [
                { provide: ParticipantsSearchServiceAgent, useValue: participantsSearchSpy },
                { provide: AnnouncementsServiceAgent, useValue: announcementsSpy },
                { provide: 'toolkit.toolkitConfig', useValue: toolkitConfigMock },
                {
                    provide: 'ddp.config',
                    useValue: {
                        studyGuid,
                        // UserActivitiesComponent dependencies
                        dashboardSummaryInsteadOfStatus: [],
                        dashboardActivitiesCompletedStatuses: [],
                        dashboardReportActivities: [],
                        dashboardActivitiesStartedStatuses: []
                    },
                },
                { provide: HeaderConfigurationService, useValue: headerConfigSpy },
                { provide: SessionMementoService, useValue: sessionMock },
                { provide: UserInvitationServiceAgent, useValue: userInvitationSpy },
                { provide: GovernedParticipantsServiceAgent, useValue: governedParticipantsSpy },
                { provide: UserActivityServiceAgent, useValue: userActivityServiceAgentSpy },
                { provide: UserProfileServiceAgent, useValue: userProfileServiceAgentMock },
                // UserActivitiesComponent dependencies
                { provide: ActivityInstanceStatusServiceAgent, useValue: statusesServiceAgentSpy },
                { provide: ActivityServiceAgent, useValue: {} },
                { provide: LoggingService, useValue: loggerSpy },
                { provide: AnalyticsEventsService, useValue: analyticsSpy },
            ],
            declarations: [DashboardRedesignedComponent, subjectPanel, UserActivitiesComponent],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardRedesignedComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
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

    it('should display dashboard content if user is admin and session contains participantGuid', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const dashboardContent = fixture.debugElement.query(By.css('.dashboard-content'));
        expect(dashboardContent).toBeTruthy();
    });

    it('should display dashboard title', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const dashboardTitle = fixture.debugElement.query(By.css('.dashboard-title-section__title')).nativeElement;
        expect(dashboardTitle.textContent.trim()).toBe('Dashboard test');
    });

    it('should display participant dashboard title', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        const dashboardTitle = fixture.debugElement.query(By.css('.dashboard-title-section__title')).nativeElement;
        expect(dashboardTitle.textContent).toContain('Participant Dashboard test');
    });

    it('should display add participant button', () => {
        toolkitConfigMock.addParticipantUrl = 'test';
        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button'));
        expect(addParticipantButton).toBeTruthy();
    });

    it('should not display add participant button', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button'));
        expect(addParticipantButton).toBeFalsy();
    });

    it('builds the participants list without first and last names', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
            { userGuid: '2', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dashboardParticipants).toEqual([
            { userGuid, label: 'You test' },
            { userGuid: '1', label: 'Your child test' },
            { userGuid: '2', label: 'Your child test #2' },
        ]);
    });

    it('builds the participants list with first and last names', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([activityMock]));
        profileMock.firstName = 'Dexter';
        profileMock.lastName = 'Morgan';
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '3', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '4', userProfile: { firstName: 'One more', lastName: 'kid' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dashboardParticipants).toEqual([
            { userGuid, label: 'Dexter Morgan' },
            { userGuid: '3', label: 'My child' },
            { userGuid: '4', label: 'One more kid' },
        ]);
    });

    it('does not include the operator user into participants list', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dashboardParticipants[0]).toEqual({userGuid: '1', label: 'My child'});
    });

    it('includes only the operator user into participants list', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dashboardParticipants[0]).toEqual({userGuid, label: 'You test'});
    });

    it('sets participants list as empty list', () => {
        toolkitConfigMock.useParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.dashboardParticipants).toEqual([]);
    });

    it('displays expansion panel for every participant', () => {
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '4', userProfile: { firstName: 'One more', lastName: 'kid' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
        expect(expansionPanel.length).toBe(2);
    });

    it('does not display expansion panels for regular dashboard', () => {
        toolkitConfigMock.useParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = fixture.debugElement.query(By.css('.mat-accordion'));
        expect(expansionPanel).toBeFalsy();
    });

    it('expands the first panel', async () => {
        toolkitConfigMock.useParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = await loader.getHarness(MatExpansionPanelHarness);
        expect(await expansionPanel.isExpanded()).toBeTrue();
    });

    it('displays hide panel message if panel is open', async () => {
        toolkitConfigMock.useParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = await loader.getHarness(MatExpansionPanelHarness);
        expect(await expansionPanel.getDescription()).toContain('Hide test');
    });

    it('displays show panel message if panel is collapsed', async () => {
        toolkitConfigMock.useParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '2', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        expect(await expansionPanels[1].getDescription()).toContain('Show test');
    });

    it('calls setParticipant with correct param in user activities', async () => {
        const setParticipantSpy = spyOn(sessionMock, 'setParticipant');
        toolkitConfigMock.useParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
            { userGuid: '2', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        await expansionPanels[1].expand();
        await expansionPanels[2].expand();

        expect(setParticipantSpy.calls.allArgs()).toEqual([
            // clear participant id in DashboardComponent ngOnInit
            [null],
            // get activities for each user-activities component
            ['1'], ['2']]);
    });

    it('sets activities for participant correctly', async (done) => {
        toolkitConfigMock.useParticipantDashboard = true;
        const activitiesResult = [activityMock];
        userActivityServiceAgentSpy.getActivities.and.returnValue(of(activitiesResult));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        await expansionPanels[1].expand();

        component.participantToActivitiesStream.get('1').subscribe((activities) => {
            expect(activities).toEqual(activitiesResult);
            done();
        });
    });
});
