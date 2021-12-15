import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { WelcomeComponent } from './welcome.component';
import { AnalyticsEventsService, mockComponent } from 'ddp-sdk';
import { CommunicationService } from 'toolkit';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    HomePage: {
                        ParticipateSection: { Steps: [] }
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    const participationSection = mockComponent({ selector: 'app-participation-section'});
    const faqSection = mockComponent({ selector: 'app-faq-section'});
    const stayInformedSection = mockComponent({ selector: 'app-stay-informed-section'});
    const joinCmiSection = mockComponent({ selector: 'app-join-cmi-section'});

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('communicationServiceSpy', ['openJoinDialog']);
        await TestBed.configureTestingModule({
            declarations: [
                WelcomeComponent,
                participationSection,
                faqSection,
                stayInformedSection,
                joinCmiSection
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                RouterTestingModule,
                NoopAnimationsModule,
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
                }),
            ],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy},
                { provide: AnalyticsEventsService, useValue: {} }
            ],
        })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WelcomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
