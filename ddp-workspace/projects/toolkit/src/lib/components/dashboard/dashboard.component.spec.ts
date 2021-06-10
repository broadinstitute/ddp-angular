import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from 'toolkit';
import { ParticipantsSearchServiceAgent, EnrollmentStatusType, AnnouncementsServiceAgent, mockComponent } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
    let fixture: ComponentFixture<DashboardComponent>;
    let component: DashboardComponent;
    let participantsSearchSpy: jasmine.SpyObj<ParticipantsSearchServiceAgent>;

    beforeEach(async() => {
        participantsSearchSpy = jasmine.createSpyObj('participantsSearchSpy', {
            getParticipant: of({
                guid: '1234',
                hruid: '5678',
                status: EnrollmentStatusType.REGISTERED,
            })
        });
        const announcementsSpy = jasmine.createSpyObj('participantsSearchSpy', { getMessages: of([]) });
        const toolkitHeader = mockComponent({ selector: 'toolkit-header', inputs: ['showButtons'] });
        const dashboard = mockComponent({ selector: 'ddp-dashboard', inputs: ['studyGuid', 'selectedUserGuid'] });
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
});
