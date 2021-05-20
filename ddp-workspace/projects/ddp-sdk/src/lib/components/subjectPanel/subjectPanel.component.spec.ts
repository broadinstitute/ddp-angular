/* tslint:disable:max-classes-per-file */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SubjectPanelComponent, SessionMementoService, InvitationPipe } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('SubjectPanelComponent', () => {
    @Component({
        template: `
        <ddp-subject-panel [name]="name" [shortId]="shortId" [email]="email" [invitationId]="invitationId">
        </ddp-subject-panel>`
    })
    class TestHostComponent {
        name: string;
        shortId: string;
        email: string;
        invitationId: string;
    }

    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;
    let component: SubjectPanelComponent;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;

    beforeEach(async() => {
        sessionSpy = jasmine.createSpyObj('sessionSpy', { isAuthenticatedAdminSession: true });
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
                { provide: SessionMementoService , useValue: sessionSpy },
                { provide: InvitationPipe , useValue: invitationPipeSpy },
                { provide: 'ddp.config', useValue: { lookupPageUrl: 'lookupPageUrl' } },
            ],
            declarations: [TestHostComponent, SubjectPanelComponent],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.debugElement.componentInstance;
        component = fixture.debugElement.query(By.directive(SubjectPanelComponent)).componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should not display subject panel for not admins', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(false);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeFalsy();
    });

    it('should not display subject panel for admins if no selected user data', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(true);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeFalsy();
    });

    it('should not display subject panel for admins if there is some user data', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(true);
        hostComponent.email = 'testEmail@gmail.com';
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-subject-panel'));
        expect(panel).toBeTruthy();
    });

    it('sets subjectFields correctly', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(true);
        hostComponent.email = 'testEmail@gmail.com';
        hostComponent.shortId = 'testShortId';
        hostComponent.name = 'test user name';
        hostComponent.invitationId = 'TB6QTVAGHAHT';
        fixture.detectChanges();

        expect(component.subjectFields).toEqual([
            {label: 'SDK.SubjectPanel.Name', value: 'test user name'},
            {label: 'SDK.SubjectPanel.Email', value: 'testEmail@gmail.com'},
            {label: 'SDK.SubjectPanel.ShortId', value: 'testShortId'},
            {label: 'SDK.SubjectPanel.InvitationCode', value: 'transformedInvitation'},
        ]);
    });

    it('sets subjectFields correctly if some data is missed', () => {
        sessionSpy.isAuthenticatedAdminSession.and.returnValue(true);
        hostComponent.shortId = 'testShortId';
        hostComponent.name = 'test user name';
        fixture.detectChanges();

        expect(component.subjectFields).toEqual([
            {label: 'SDK.SubjectPanel.Name', value: 'test user name'},
            {label: 'SDK.SubjectPanel.ShortId', value: 'testShortId'},
        ]);
    });
});
