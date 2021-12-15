import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ErrorComponent } from './error.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code= ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                ErrorPage: {
                    Text: 'a default error message'
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('ErrorComponent', () => {
    let component: ErrorComponent;
    let fixture: ComponentFixture<ErrorComponent>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);
        routerSpy.getCurrentNavigation.and.returnValue({} as any);

        await TestBed.configureTestingModule({
                imports: [
                    TranslateModule.forRoot({loader: {provide: TranslateLoader, useClass: TranslateLoaderMock}}),
                ],
                providers: [
                    {provide: Router, useValue: routerSpy}
                ],
                declarations: [ErrorComponent],
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default error message', () => {
        const errorMessage = fixture.debugElement.query(By.css('.error-message'));
        expect(errorMessage.nativeElement.textContent.trim()).toEqual('a default error message');
    });

    it('should have a custom error message which is set in NavigationExtras state', () => {
        const customErrorMessage = 'User need to register first in order to login';
        routerSpy.getCurrentNavigation.and.returnValue({
            extras: {
                state: {
                    errorMessage: customErrorMessage
                }
            }
        } as any);
        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('.error-message'));
        expect(errorMessage.nativeElement.textContent.trim()).toEqual(customErrorMessage);
    });
});
