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
    AnalyticsEventsService,
    WorkflowServiceAgent,
    UserManagementServiceAgent,
    ActivityResponse,
    UserPreferencesComponent
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { ActivityInstanceStatusServiceAgent } from '../../../../../ddp-sdk/src/lib/services/serviceAgents/activityInstanceStatusServiceAgent.service';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                Toolkit: {
                    Dashboard: {
                        ParticipantsTitle: 'Participant Dashboard test',
                        Title: 'Dashboard test',
                        UserLabel: 'You test',
                        ChildLabel: 'Your child test{{suffix}}',
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
    let workflowServiceSpy: jasmine.SpyObj<WorkflowServiceAgent>;
    let userManagementServiceSpy: jasmine.SpyObj<UserManagementServiceAgent>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let sessionMock: SessionMementoService;
    let toolkitConfigMock: ToolkitConfigurationService;
    let profileMock: UserProfile;
    let loader: HarnessLoader;
    let router: Router;
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
        toolkitConfigMock.studyGuid = studyGuid;
        profileMock = {firstName: '', lastName: ''} as UserProfile;
        const userProfileServiceAgentMock = { profile: of({ profile: profileMock }) } as UserProfileServiceAgent;

        const announcementsSpy = jasmine.createSpyObj('participantsSearchSpy', { getMessages: of([]) });
        governedParticipantsSpy = jasmine.createSpyObj('governedParticipantsSpy', {
            getGovernedStudyParticipants: of([]),
            addParticipant: of('')
        });
        userActivityServiceAgentSpy = jasmine.createSpyObj('userActivityServiceAgentSpy', { getActivities: of([activityMock]) });
        workflowServiceSpy = jasmine.createSpyObj('workflowServiceSpy', { fromParticipantList: of([]) });
        userManagementServiceSpy = jasmine.createSpyObj('userManagementServiceSpy', { deleteUser: of([]) });
        sessionMock = {
            isAuthenticatedAdminSession: () => true,
            setParticipant: () => {},
            session: ({ participantGuid: '1243', userGuid } as Session)
        } as SessionMementoService;
        matDialogSpy = jasmine.createSpyObj('MatDialog', { open: { afterClosed: () => of(true) } });
        const headerConfigSpy = jasmine.createSpyObj('participantsSearchSpy', ['setupDefaultHeader']);
        const userInvitationSpy = jasmine.createSpyObj('userInvitationSpy', { getInvitations: of([]) });
        const statusesServiceAgentSpy = jasmine.createSpyObj('statusesServiceAgentSpy', { getStatuses: of([]) });
        const loggerSpy = jasmine.createSpyObj('loggerSpy', ['logEvent']);
        const analyticsSpy = jasmine.createSpyObj('analyticsSpy', ['emitCustomEvent']);

        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
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
                { provide: WorkflowServiceAgent, useValue: workflowServiceSpy },
                { provide: UserManagementServiceAgent, useValue: userManagementServiceSpy },
                // UserActivitiesComponent dependencies
                { provide: ActivityInstanceStatusServiceAgent, useValue: statusesServiceAgentSpy },
                { provide: ActivityServiceAgent, useValue: {} },
                { provide: LoggingService, useValue: loggerSpy },
                { provide: AnalyticsEventsService, useValue: analyticsSpy },
                { provide: MatDialog, useValue: matDialogSpy },
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
        router = TestBed.inject(Router);
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
        toolkitConfigMock.useMultiParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        const dashboardTitle = fixture.debugElement.query(By.css('.dashboard-title-section__title')).nativeElement;
        expect(dashboardTitle.textContent).toContain('Participant Dashboard test');
    });

    it('should display add participant button', () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
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

    it('should create a new participant on backend when click add participant button', () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button')).nativeElement;
        addParticipantButton.click();
        expect(governedParticipantsSpy.addParticipant).toHaveBeenCalledWith(studyGuid);
    });

    it('should set the created participant into session', () => {
        const setParticipantSpy = spyOn(sessionMock, 'setParticipant');
        const newParticipantGuid = '6549';
        governedParticipantsSpy.addParticipant.and.returnValue(of(newParticipantGuid));
        toolkitConfigMock.useMultiParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button')).nativeElement;
        addParticipantButton.click();
        expect(setParticipantSpy).toHaveBeenCalledWith(newParticipantGuid);
    });

    it('should redirect to the correct activity', () => {
        const instanceGuid = 'DKJKF';
        const activityUrl = 'activity-test';

        workflowServiceSpy.fromParticipantList.and.returnValue(of({instanceGuid} as ActivityResponse));
        toolkitConfigMock.useMultiParticipantDashboard = true;
        toolkitConfigMock.activityUrl = activityUrl;
        const navigateSpy = spyOn(router, 'navigate');

        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button')).nativeElement;
        addParticipantButton.click();
        expect(navigateSpy).toHaveBeenCalledWith([activityUrl, instanceGuid]);
    });

    it('should delete created user if workflow request was failed', () => {
        const newParticipantGuid = '6549';
        governedParticipantsSpy.addParticipant.and.returnValue(of(newParticipantGuid));
        workflowServiceSpy.fromParticipantList.and.returnValue(throwError('error'));
        toolkitConfigMock.useMultiParticipantDashboard = true;
        const navigateSpy = spyOn(router, 'navigate');

        component.ngOnInit();
        fixture.detectChanges();

        const addParticipantButton = fixture.debugElement.query(By.css('.add-participant-button')).nativeElement;
        addParticipantButton.click();
        expect(userManagementServiceSpy.deleteUser).toHaveBeenCalledWith(newParticipantGuid);
        expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should return participant id', () => {
        expect(component.trackById('never mind', { userGuid: '1', label: 'label', activities: []})).toBe('1');
    });

    it('should delete participants w/o activities', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.withArgs(jasmine.anything(), '1').and.returnValue(of([]));
        userActivityServiceAgentSpy.getActivities.withArgs(jasmine.anything(), '2').and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
            { userGuid: '2', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(userManagementServiceSpy.deleteUser).toHaveBeenCalledWith('1');

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants).toEqual([
                { userGuid, label: 'You test', activities: [activityMock]},
                { userGuid: '2', label: 'Your child test', activities: [activityMock]},
            ]);
            done();
        });
    });

    it('builds the participants list without first and last names', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
            { userGuid: '2', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants).toEqual([
                { userGuid, label: 'You test', activities: [activityMock]},
                { userGuid: '1', label: 'Your child test', activities: [activityMock]},
                { userGuid: '2', label: 'Your child test #2', activities: [activityMock]},
            ]);
            done();
        });
    });

    it('builds the participants list with first and last names', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        profileMock.firstName = 'Dexter';
        profileMock.lastName = 'Morgan';
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '3', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '4', userProfile: { firstName: 'One more', lastName: 'kid' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants).toEqual([
                { userGuid, label: 'Dexter Morgan', activities: [activityMock]},
                { userGuid: '3', label: 'My child', activities: [activityMock]},
                { userGuid: '4', label: 'One more kid', activities: [activityMock]},
            ]);
            done();
        });
    });

    it('does not include the operator user into participants list', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([]));
        userActivityServiceAgentSpy.getActivities.withArgs(jasmine.anything(), '1').and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants[0]).toEqual({userGuid: '1', label: 'My child', activities: [activityMock]});
            done();
        });
    });

    it('includes only the operator user into participants list', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([]));
        component.ngOnInit();
        fixture.detectChanges();

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants[0]).toEqual({userGuid, label: 'You test', activities: [activityMock]});
            done();
        });
    });

    it('sets participants list as empty list', (done) => {
        toolkitConfigMock.useMultiParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        component.dashboardParticipants$.subscribe((participants) => {
            expect(participants).toEqual([]);
            done();
        });
    });

    it('displays expansion panel for every participant and operator', () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '4', userProfile: { firstName: 'One more', lastName: 'kid' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = fixture.debugElement.queryAll(By.css('.mat-expansion-panel'));
        expect(expansionPanel.length).toBe(3);
    });

    it('does not display expansion panels for regular dashboard', () => {
        toolkitConfigMock.useMultiParticipantDashboard = false;
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = fixture.debugElement.query(By.css('.mat-accordion'));
        expect(expansionPanel).toBeFalsy();
    });

    it('expands the first panel', async () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '2', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanel = await loader.getHarness(MatExpansionPanelHarness);
        expect(await expansionPanel.isExpanded()).toBeTrue();
    });

    it('displays hide panel message if panel is open', async () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
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
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
            { userGuid: '2', userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        const expansionPanels = await loader.getAllHarnesses(MatExpansionPanelHarness);
        expect(await expansionPanels[1].getDescription()).toContain('Show test');
    });

    it('calls getActivities with correct param', async () => {
        toolkitConfigMock.useMultiParticipantDashboard = true;
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: '1', userProfile: { firstName: null, lastName: null } } as Participant,
            { userGuid: '2', userProfile: { firstName: null, lastName: null } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();

        expect(userActivityServiceAgentSpy.getActivities.calls.allArgs()).toEqual([
            [jasmine.anything()],
            // we have shareReplay in the code, so in fact it will be only one http call for operator activities
            [jasmine.anything()],
            [jasmine.anything(), '1'],
            [jasmine.anything(), '2']]);
    });

    it('clear participant id in DashboardComponent ngOnInit', async () => {
        const setParticipantSpy = spyOn(sessionMock, 'setParticipant');
        toolkitConfigMock.useMultiParticipantDashboard = true;
        component.ngOnInit();
        fixture.detectChanges();

        expect(setParticipantSpy.calls.allArgs()).toEqual([[null]]);
    });

    it('set participant when user clicks on participant edit button', async () => {
        const participantGuid = 'gdh123';
        toolkitConfigMock.useMultiParticipantDashboard = true;
        toolkitConfigMock.allowEditUserProfile = true;
        userActivityServiceAgentSpy.getActivities.and.returnValue(of([]));
        userActivityServiceAgentSpy.getActivities.withArgs(jasmine.anything(), participantGuid).and.returnValue(of([activityMock]));
        governedParticipantsSpy.getGovernedStudyParticipants.and.returnValue(of([
            { userGuid: participantGuid, userProfile: { firstName: 'My', lastName: 'child' } } as Participant,
        ]));
        component.ngOnInit();
        fixture.detectChanges();
        const setParticipantSpy = spyOn(sessionMock, 'setParticipant');
        const editUserButton = fixture.debugElement.query(By.css('.edit-user-button')).nativeElement;
        editUserButton.click();

        expect(setParticipantSpy.calls.allArgs()).toEqual([[participantGuid], [null]]);
        expect(matDialogSpy.open).toHaveBeenCalledWith(UserPreferencesComponent, {
            width: '650px',
            autoFocus: false,
            data: { userName: 'My child'}
        });
    });
});
