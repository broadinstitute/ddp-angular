import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardRedesignedComponent, HeaderConfigurationService } from 'toolkit';
import {
    ParticipantsSearchServiceAgent,
    EnrollmentStatusType,
    AnnouncementsServiceAgent,
    mockComponent,
    SessionMementoService,
    UserInvitationServiceAgent,
    Session,
} from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DashboardRedesignedComponent', () => {
    let fixture: ComponentFixture<DashboardRedesignedComponent>;
    let component: DashboardRedesignedComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;
    let sessionMock: SessionMementoService;

    beforeEach(async () => {
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', {
            getParticipant: of({
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.REGISTERED,
            })
        });
        const announcementsSpy = jasmine.createSpyObj('participantsSearchSpy', { getMessages: of([]) });
        sessionMock = {
            isAuthenticatedAdminSession: () => true,
            session: ({ participantGuid: '1243' } as Session)
        } as SessionMementoService;
        const headerConfigSpy = jasmine.createSpyObj('participantsSearchSpy', ['setupDefaultHeader']);
        const userInvitationSpy = jasmine.createSpyObj('userInvitationSpy', { getInvitations: of([]) });

        const dashboard = mockComponent({ selector: 'ddp-user-activities', inputs: ['studyGuid', 'selectedUserGuid', 'displayedColumns'] });
        const subjectPanel = mockComponent({ selector: 'ddp-subject-panel', inputs: ['subject'] });
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: ParticipantsSearchServiceAgent, useValue: participantsSearchSpy },
                { provide: AnnouncementsServiceAgent, useValue: announcementsSpy },
                { provide: 'toolkit.toolkitConfig', useValue: {} },
                { provide: HeaderConfigurationService, useValue: headerConfigSpy },
                { provide: SessionMementoService, useValue: sessionMock },
                { provide: UserInvitationServiceAgent, useValue: userInvitationSpy },
            ],
            declarations: [DashboardRedesignedComponent, dashboard, subjectPanel],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardRedesignedComponent);
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

    it('should display dashboard content if user is admin and session contains participantGuid', () => {
        component.ngOnInit();
        fixture.detectChanges();

        const dashboardContent = fixture.debugElement.query(By.css('.dashboard-content'));
        expect(dashboardContent).toBeTruthy();
    });
});
