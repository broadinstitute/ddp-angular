import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { mockComponent } from 'ddp-sdk';
import { ColorectalPageComponent } from './colorectal-page.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code= ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    HomePage: {},
                    FAQ: {},
                    ColorectalPage: {
                        LearnMoreSection: {
                            Paragraphs: []

                        }
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('ColorectalPageComponent', () => {
    let component: ColorectalPageComponent;
    let fixture: ComponentFixture<ColorectalPageComponent>;
    const participationSection = mockComponent({ selector: 'app-participation-section', inputs: ['isColorectalTheme'] });
    const faqSection = mockComponent({ selector: 'app-faq-section', inputs: ['isColorectal'] });
    const stayInformedSection = mockComponent({ selector: 'app-stay-informed-section', inputs: ['isColorectal'] });
    const joinCmiSection = mockComponent({ selector: 'app-join-cmi-section', inputs: ['isColorectalTheme'] });
    const splashPageFooter = mockComponent({ selector: 'app-splash-page-footer', inputs: ['phone', 'email']});

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
                    ColorectalPageComponent,
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
        fixture = TestBed.createComponent(ColorectalPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
