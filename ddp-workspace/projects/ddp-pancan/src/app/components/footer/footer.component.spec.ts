import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockComponent, WindowRef } from 'ddp-sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let component: FooterComponent;
    let nativeWindowSpy: jasmine.SpyObj<Window>;

    beforeEach(async () => {
        const auth = mockComponent({ selector: 'app-auth' });
        const navigation = mockComponent({ selector: 'app-navigation' });
        nativeWindowSpy = jasmine.createSpyObj('nativeWindowSpy', ['scrollTo']);
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }, }),
                MatIconModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: WindowRef, useValue: { nativeWindow: nativeWindowSpy }},
                { provide: 'toolkit.toolkitConfig', useValue: {} },
            ],
            declarations: [FooterComponent, auth, navigation],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should scroll to the top when click on back-to-top button', () => {
        const backToTopButton = fixture.debugElement.query(By.css('.back-to-top')).nativeElement;
        backToTopButton.click();
        expect(nativeWindowSpy.scrollTo).toHaveBeenCalled();
    });
});
