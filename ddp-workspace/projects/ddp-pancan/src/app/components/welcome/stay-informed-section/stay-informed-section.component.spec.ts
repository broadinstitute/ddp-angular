import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { StayInformedSectionComponent } from './stay-informed-section.component';
import { CommunicationService } from 'toolkit';

class TranslateLoaderMock implements TranslateLoader {
    getTranslation(code: string = ''): Observable<object> {
        const TRANSLATIONS = {
            en: {
                App: {
                    HomePage: {
                        StayInformedSection: {}
                    }
                }
            }
        };
        return of(TRANSLATIONS[code]);
    }
}

describe('StayInformedSectionComponent', () => {
    let component: StayInformedSectionComponent;
    let fixture: ComponentFixture<StayInformedSectionComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('communicationServiceSpy', ['openJoinDialog']);
        await TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule,
                    NoopAnimationsModule,
                    TranslateModule.forRoot({
                        loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                    }),
                ],
                declarations: [StayInformedSectionComponent],
                providers: [
                    { provide: CommunicationService, useValue: communicationServiceSpy },
                    { provide: 'toolkit.toolkitConfig', useValue: {} }
                ],
            })
            .compileComponents();

        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StayInformedSectionComponent);
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
