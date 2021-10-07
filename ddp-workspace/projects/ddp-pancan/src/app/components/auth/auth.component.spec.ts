import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of, Observable } from 'rxjs';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { mockComponent, SessionMementoService } from 'ddp-sdk';
import { AuthComponent } from './auth.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    Navigation: {
                        Dashboard: 'Dashboard test',
                        Join: 'Join test',
                    }
                }
            }
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
                MatIconModule,
                MatButtonModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
                NoopAnimationsModule
            ],
            providers: [
                { provide: SessionMementoService, useValue: sessionSpy },
            ],
            declarations: [AuthComponent, signInOut, languageSelector],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
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

        const actionButton = fixture.debugElement.query(By.css('.action-button')).nativeElement;
        expect(actionButton.textContent.trim()).toBe('Join test');
        expect(actionButton.href).toContain('count-me-in');
    });

    it('should display dashboard button if user is authenticated', () => {
        sessionSpy.isAuthenticatedSession.and.returnValue(true);
        fixture.detectChanges();

        const actionButton = fixture.debugElement.query(By.css('.action-button')).nativeElement;
        expect(actionButton.textContent.trim()).toContain('Dashboard test');
        expect(actionButton.href).toContain('dashboard');
    });
});
