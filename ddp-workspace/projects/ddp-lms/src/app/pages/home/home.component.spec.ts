import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { mockComponent } from 'ddp-sdk';
import { HomeComponent } from './home.component';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    HomePage: {},
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    const participationSection = mockComponent({ selector: 'app-how-to-participate' });
    const participantSection = mockComponent({ selector: 'app-how-to-participate' });
    const scientificImpactSection = mockComponent({ selector: 'app-scientific-impact' });
    const faqSection = mockComponent({ selector: 'app-faq' });
    const aboutUsSection = mockComponent({ selector: 'app-about' });
    const physicianSection = mockComponent({ selector: 'app-for-your-physician' });
    const footer = mockComponent({ selector: 'app-footer' });

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
                    HomeComponent,
                    aboutUsSection,
                    participationSection,
                    faqSection,
                    scientificImpactSection,
                    participantSection,
                    footer,
                    physicianSection
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
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
