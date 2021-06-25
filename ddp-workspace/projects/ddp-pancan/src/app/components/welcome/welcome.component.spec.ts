import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { WelcomeComponent } from './welcome.component';
import { mockComponent } from 'ddp-sdk';
import { CommunicationService } from 'toolkit';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {}
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('WelcomeComponent', () => {
    let component: WelcomeComponent;
    let fixture: ComponentFixture<WelcomeComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('communicationServiceSpy', ['openJoinDialog']);
        const faq = mockComponent({ selector: 'app-faq-section'});
        await TestBed.configureTestingModule({
            declarations: [WelcomeComponent, faq],
            imports: [
                MatButtonModule,
                RouterTestingModule,
                NoopAnimationsModule,
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: TranslateLoaderMock},
                }),
            ],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy},
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

    it('should call openJoinDialog', async () => {
        const joinButton = fixture.debugElement.query(By.css('.join-btn')).nativeElement;
        joinButton.click();
        expect(communicationServiceSpy.openJoinDialog).toHaveBeenCalled();
    });
});
