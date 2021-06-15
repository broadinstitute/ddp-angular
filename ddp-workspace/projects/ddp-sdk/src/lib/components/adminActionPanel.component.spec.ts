import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AdminActionPanelComponent, Session, SessionMementoService } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('AdminActionPanelComponent', () => {
    let fixture: ComponentFixture<AdminActionPanelComponent>;
    let component: AdminActionPanelComponent;
    let sessionMock: SessionMementoService;

    beforeEach(async() => {
        sessionMock = {
            isAuthenticatedAdminSession: () => true,
            session: ({ participantGuid: '1243' } as Session)
        } as SessionMementoService;
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
                NoopAnimationsModule
            ],
            providers: [
                { provide: SessionMementoService, useValue: sessionMock },
            ],
            declarations: [AdminActionPanelComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminActionPanelComponent);
        component = fixture.debugElement.componentInstance;
        component.activityReadonly = true;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should not display panel if user is not admin', () => {
        spyOn(sessionMock, 'isAuthenticatedAdminSession').and.returnValue(false);
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-admin-action-panel'));
        expect(panel).toBeFalsy();
    });

    it('should not display panel if participantGuid is not specified', () => {
        sessionMock.session.participantGuid = null;
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-admin-action-panel'));
        expect(panel).toBeFalsy();
    });

    it('should not display panel if activityReadonly is falsy', () => {
        component.activityReadonly = false;
        fixture.detectChanges();

        const panel = fixture.debugElement.query(By.css('.ddp-admin-action-panel'));
        expect(panel).toBeFalsy();
    });

    it('should display panel for admin with participantGuid and readonly activity', () => {
        const panel = fixture.debugElement.query(By.css('.ddp-admin-action-panel'));
        expect(panel).toBeTruthy();
    });
});
