import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { StayInformedSectionComponent } from './stay-informed-section.component';
import { JoinMailingListComponent } from 'toolkit';
import { MatDialog } from '@angular/material/dialog';
import { JOIN_MAILING_LIST_DIALOG_SETTINGS } from '../../../utils/join-mailing-list-dialog-confg';
import { AnalyticsEventsService } from 'ddp-sdk';

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
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        dialogSpy = jasmine.createSpyObj('dialogSpy', ['open']);
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
                    { provide: MatDialog, useValue: dialogSpy},
                    { provide: 'toolkit.toolkitConfig', useValue: {} },
                    { provide: AnalyticsEventsService, useValue: {} }
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

    it('should open join mailing list dialog', () => {
        const joinButton = fixture.debugElement.query(By.css('.join-btn')).nativeElement;
        joinButton.click();
        expect(dialogSpy.open).toHaveBeenCalledWith(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info: null },
        });
    });

    it('should open join mailing list dialog for Colorectal page', () => {
        component.isColorectal = true;
        const joinButton = fixture.debugElement.query(By.css('.join-btn')).nativeElement;
        joinButton.click();
        expect(dialogSpy.open).toHaveBeenCalledWith(JoinMailingListComponent, {
            ...JOIN_MAILING_LIST_DIALOG_SETTINGS,
            data: { info: ['Colorectal'] },
        });
    });
});
