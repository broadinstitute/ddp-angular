/* tslint:disable:max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserPreferencesComponent } from './userPreferences.component';
import {
    Address,
    MailAddressBlock,
    mockComponent,
    SubmitAnnouncementService,
    UserProfileServiceAgent
} from 'ddp-sdk';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DateService } from '../../services/dateService.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ddp-address-embedded',
    template: `<div>test address component</div>`
})
class FakeAddressComponent {
    @Output() validStatusChanged = new EventEmitter<boolean>();
    @Output() componentBusy = new EventEmitter<boolean>();
    @Output() errorOrSuggestionWasShown = new EventEmitter();
    @Output() valueChanged = new EventEmitter<Address | null>();
    @Input() block: MailAddressBlock;
    @Input() country = null;
    @Input() readonly = false;
}

describe('UserPreferencesComponent', () => {
    let fixture: ComponentFixture<UserPreferencesComponent>;
    let component: UserPreferencesComponent;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UserPreferencesComponent>>;
    let submitAnnouncementServiceSpy: jasmine.SpyObj<SubmitAnnouncementService>;

    class TranslateLoaderMock implements TranslateLoader {
        getTranslation(code: string = ''): Observable<object> {
            const TRANSLATIONS = {
                en: {
                    SDK : {}
                }
            };
            return of(TRANSLATIONS[code]);
        }
    }

    beforeEach(async () => {
        const loadingMock = mockComponent({ selector: 'ddp-loading', inputs: ['loaded'] });
        matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['close']);
        submitAnnouncementServiceSpy = jasmine.createSpyObj('submitAnnouncementServiceSpy', ['announceSubmit']);
        await TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }}),
            ],
            providers: [
                { provide: UserProfileServiceAgent , useValue: {} },
                { provide: DateService , useValue: { } },
                { provide: 'ddp.config', useValue: { } },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                {provide: MAT_DIALOG_DATA, useValue: {}}
            ],
            declarations: [UserPreferencesComponent, FakeAddressComponent, loadingMock],
        })
            .overrideComponent(
                UserPreferencesComponent,
                { set: { providers: [{ provide: SubmitAnnouncementService, useValue: submitAnnouncementServiceSpy }] } })
            .compileComponents();
        const translate = TestBed.inject(TranslateService);
        translate.use('en');
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserPreferencesComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('disables submit button if address component is busy', () => {
        // addressMock.componentBusy.emit(true);
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(true);
        fixture.detectChanges();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeTrue();
    });

    it('enables submit button if address component is not busy', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeFalse();
    });

    it('disables submit button if address component is invalid', () => {
        // addressMock.componentBusy.emit(true);
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.validStatusChanged.emit(false);
        fixture.detectChanges();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeTrue();
    });

    it('enables submit button if address component is not invalid', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.validStatusChanged.emit(true);
        fixture.detectChanges();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeFalse();
    });

    it('calls announceSubmit when user clicks save', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        const saveButtonElement = fixture.debugElement.query(By.css('.save-button'));
        expect(saveButtonElement.componentInstance.disabled).toBeFalse();
        saveButtonElement.nativeElement.click();

        expect(submitAnnouncementServiceSpy.announceSubmit).toHaveBeenCalled();
    });

    it('disables address component when user clicks save', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        fixture.detectChanges();

        expect(addressComponent.componentInstance.readonly).toBe(true);
    });

    it('enables address component and does not close dialog when address submit call is failed', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        fixture.detectChanges();
        addressComponent.componentInstance.valueChanged.emit(false);

        expect(addressComponent.componentInstance.readonly).toBe(true);
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('enables address component and closes dialog when address submit call is succeed', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        fixture.detectChanges();
        addressComponent.componentInstance.valueChanged.emit(true);

        expect(addressComponent.componentInstance.readonly).toBe(true);
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
});
