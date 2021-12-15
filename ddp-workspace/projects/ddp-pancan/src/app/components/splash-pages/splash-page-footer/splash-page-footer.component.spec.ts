import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { WindowRef } from 'ddp-sdk';
import { SplashPageFooterComponent } from './splash-page-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    ColorectalPage: {
                        Footer: {}
                    },
                    Footer: {}
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('SplashPageFooterComponent', () => {
    let component: SplashPageFooterComponent;
    let fixture: ComponentFixture<SplashPageFooterComponent>;
    let nativeWindowSpy: jasmine.SpyObj<Window>;

    beforeEach(async () => {
        nativeWindowSpy = jasmine.createSpyObj('nativeWindowSpy', ['scrollTo']);
        await TestBed.configureTestingModule({
                imports: [
                    MatIconModule,
                    RouterTestingModule,
                    NoopAnimationsModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                    }),
                ],
                declarations: [SplashPageFooterComponent],
                providers: [
                    { provide: WindowRef, useValue: { nativeWindow: nativeWindowSpy }}
                ],
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SplashPageFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should scroll to the top when click on back-to-top button', () => {
        const backToTopButton = fixture.debugElement.query(By.css('.back-to-top')).nativeElement;
        backToTopButton.click();
        expect(nativeWindowSpy.scrollTo).toHaveBeenCalled();
    });
});
