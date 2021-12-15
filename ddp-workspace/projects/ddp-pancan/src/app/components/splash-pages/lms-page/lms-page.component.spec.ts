import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoggingService, mockComponent } from 'ddp-sdk';
import { LmsPageComponent } from './lms-page.component';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { JoinMailingListComponent } from 'toolkit';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';

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
                    LmsPageComponent,
                    participationSection,
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
        fixture = TestBed.createComponent(LmsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open join mailing list dialog', () => {
        const joinButton = fixture.debugElement.query(By.css('.notify-btn ')).nativeElement;
        joinButton.click();
        expect(dialogSpy.open).toHaveBeenCalledWith(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { studyGuid: 'guid123',  useLanguage: 'en' },
        });
    });
});
