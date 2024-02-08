import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggingService, mockComponent } from 'ddp-sdk';
import { HomeComponent } from './home.component';
import { MatDialog } from '@angular/material/dialog';

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

describe('LMS HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    const participationSection = mockComponent({selector: 'app-how-to-participate'});
    const aboutUsSection = mockComponent({selector: 'app-about'});
    const faqSection = mockComponent({selector: 'app-faq'});
    const stayInformedSection = mockComponent({selector: 'app-stay-informed'});
    const joinCmiSection = mockComponent({selector: 'app-join-cmi-section'});
    const splashPageFooter = mockComponent({selector: 'app-footer', inputs: ['phone', 'email']});
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let logServiceSpy: jasmine.SpyObj<LoggingService>;

    beforeEach(async () => {
        dialogSpy = jasmine.createSpyObj('dialogSpy', ['open']);
        logServiceSpy = jasmine.createSpyObj('logServiceSpy', ['logError']);
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
                    participationSection,
                    aboutUsSection,
                    faqSection,
                    stayInformedSection,
                    joinCmiSection,
                    splashPageFooter
                ],
                providers: [
                    { provide: MatDialog, useValue: dialogSpy},
                    { provide: 'toolkit.toolkitConfig', useValue: {lmsStudyGuid: 'guid123'} },
                    { provide: LoggingService, useValue: logServiceSpy }
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
