import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockComponent, SessionMementoService } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { AuthComponent } from './auth.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('AuthComponent', () => {
    let fixture: ComponentFixture<AuthComponent>;
    let component: AuthComponent;
    let sessionSpy: jasmine.SpyObj<SessionMementoService>;

    beforeEach(async () => {
        const signInOut = mockComponent({ selector: 'ddp-sign-in-out' });
        const languageSelector = mockComponent({ selector: 'ddp-language-selector' });
        sessionSpy = jasmine.createSpyObj('sessionSpy', { isAuthenticatedSession: true });
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
                NoopAnimationsModule
            ],
            providers: [
                { provide: SessionMementoService, useValue: sessionSpy },
            ],
            declarations: [AuthComponent, signInOut, languageSelector],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should display join button if user is not authenticated', () => {
        sessionSpy.isAuthenticatedSession.and.returnValue(false);
        fixture.detectChanges();

        const joinButton = fixture.debugElement.query(By.css('.join-button'));
        expect(joinButton).toBeTruthy();
    });

    it('should hide join button if user is authenticated', () => {
        sessionSpy.isAuthenticatedSession.and.returnValue(true);
        fixture.detectChanges();

        const joinButton = fixture.debugElement.query(By.css('.join-button'));
        expect(joinButton).toBeFalsy();
    });
});
