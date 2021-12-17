/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SubjectPanelComponent, SessionMementoService, InvitationPipe, EnrollmentStatusType } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { Session } from '../../models/session';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('SubjectPanelComponent', () => {
    let fixture: ComponentFixture<SubjectPanelComponent>;
    let component: SubjectPanelComponent;
    let sessionMock: SessionMementoService;

    beforeEach(async () => {
        sessionMock = { isAuthenticatedAdminSession: () => true, session: {} as Session } as SessionMementoService;
        const invitationPipeSpy = jasmine.createSpyObj('invitationPipeSpy', { transform: 'transformedInvitation' });
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MatIconModule,
                RouterTestingModule,
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
            ],
            providers: [
                { provide: SessionMementoService , useValue: sessionMock },
                { provide: InvitationPipe , useValue: invitationPipeSpy },
                { provide: 'ddp.config', useValue: { lookupPageUrl: 'lookupPageUrl' } },
            ],
            declarations: [SubjectPanelComponent],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SubjectPanelComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should not display subject panel for not admins', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(false);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeFalsy();
    });

    it('should not display subject panel for admins if no subject was passed', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(true);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeFalsy();
    });

    it('should display subject panel for admins if subject was passed', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(true);
        component.subject = {
            guid: '1234',
            hruid: '5678',
            status: EnrollmentStatusType.COMPLETED,
        };
        component.ngOnInit();
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeTruthy();
    });

    it('sets subjectFields correctly', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(true);
        component.subject = {
            guid: '1234',
            hruid: 'testShortId',
            status: EnrollmentStatusType.COMPLETED,
            email: 'testEmail@gmail.com',
            firstName: 'test user',
            lastName: 'name',
            invitationId: 'TB6QTVAGHAHT'
        };
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.subjectFields).toEqual([
            {label: 'SDK.SubjectPanel.Name', value: 'test user name'},
            {label: 'SDK.SubjectPanel.Email', value: 'testEmail@gmail.com'},
            {label: 'SDK.SubjectPanel.ShortId', value: 'testShortId'},
            {label: 'SDK.SubjectPanel.InvitationCode', value: 'transformedInvitation'},
        ]);
    });

    it('sets subjectFields correctly if some data is missed', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(true);
        component.subject = {
            guid: '1234',
            hruid: 'testShortId',
            status: EnrollmentStatusType.COMPLETED,
            firstName: 'test user',
            lastName: 'name',
        };
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.subjectFields).toEqual([
            {label: 'SDK.SubjectPanel.Name', value: 'test user name'},
            {label: 'SDK.SubjectPanel.ShortId', value: 'testShortId'},
        ]);
    });
});
