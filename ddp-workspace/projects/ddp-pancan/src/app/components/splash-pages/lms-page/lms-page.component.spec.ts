import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { mockComponent } from 'ddp-sdk';
import { LmsPageComponent } from './lms-page.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    HomePage: {},
                    FAQ: {},
                    LmsPage: {}
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('LmsPageComponent', () => {
    let component: LmsPageComponent;
    let fixture: ComponentFixture<LmsPageComponent>;
    const participationSection = mockComponent({selector: 'app-participation-section'});
    const faqSection = mockComponent({selector: 'app-faq-section'});
    const stayInformedSection = mockComponent({selector: 'app-stay-informed-section'});
    const joinCmiSection = mockComponent({selector: 'app-join-cmi-section'});
    const splashPageFooter = mockComponent({selector: 'app-splash-page-footer', inputs: ['phone', 'email']});


    beforeEach(async () => {
        await TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    NoopAnimationsModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                    }),
                ],
                declarations: [
                    LmsPageComponent,
                    participationSection,
                    faqSection,
                    stayInformedSection,
                    joinCmiSection,
                    splashPageFooter
                ],
                providers: [
                    { provide: 'toolkit.toolkitConfig', useValue: {} }
                ]
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LmsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
