/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    Address,
    ConfigurationService,
    MailAddressBlock,
    mockComponent,
    SubmitAnnouncementService,
    UserProfileDecorator,
    UserProfileField,
    UserProfileServiceAgent,
    ValidationMessageComponent,
    UserPreferencesComponent,
} from 'ddp-sdk';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DateService } from '../../services/dateService.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'ddp-address-embedded',
    template: `<div>test address component</div>`
})
class FakeAddressComponent {
    @Output() validStatusChanged = new EventEmitter<boolean>();
    @Output() componentBusy = new EventEmitter<boolean>();
    @Output() errorOrSuggestionWasShown = new EventEmitter();
    @Output() valueChanged = new EventEmitter<Address | null>();
    @Output() dirtyStatusChanged = new EventEmitter<boolean>();
    @Input() block: MailAddressBlock;
    @Input() country = null;
    @Input() readonly = false;
}

describe('UserPreferencesComponent', () => {
    let fixture: ComponentFixture<UserPreferencesComponent>;
    let component: UserPreferencesComponent;
    let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<UserPreferencesComponent>>;
    let submitAnnouncementServiceSpy: jasmine.SpyObj<SubmitAnnouncementService>;
    let dateServiceSpy: jasmine.SpyObj<DateService>;
    let userProfileServiceAgentMock: UserProfileServiceAgent;
    const config: ConfigurationService = {} as ConfigurationService;

    const validationMessageForDate = 'date is invalid test';
    class TranslateLoaderMock implements TranslateLoader {
        getTranslation(code: string = ''): Observable<object> {
            const TRANSLATIONS = {
                en: {
                    SDK : {
                        Validators: {
                            DateNavyValidationRule: validationMessageForDate
                        }
                    }
                }
            };
            return of(TRANSLATIONS[code]);
        }
    }

    beforeEach(async () => {
        const loadingMock = mockComponent({ selector: 'ddp-loading', inputs: ['loaded'] });
        const dateMock = mockComponent({ selector: 'ddp-date', inputs: ['readonly', 'renderMode', 'startYear', 'endYear', 'dateValue'] });
        matDialogRefSpy = jasmine.createSpyObj('matDialogRefSpy', ['close']);
        submitAnnouncementServiceSpy = jasmine.createSpyObj('submitAnnouncementServiceSpy', ['announceSubmit']);
        dateServiceSpy = jasmine.createSpyObj('dateServiceSpy', { checkExistingDate: true });
        userProfileServiceAgentMock = {
            get profile(): Observable<UserProfileDecorator> {
                return of({ profile: {}, newProfile: false } as UserProfileDecorator);
            },
            saveProfile: () => of(null)
        } as unknown as UserProfileServiceAgent;
        await TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock }}),
                ReactiveFormsModule
            ],
            providers: [
                { provide: UserProfileServiceAgent , useValue: userProfileServiceAgentMock },
                { provide: DateService , useValue: dateServiceSpy },
                { provide: 'ddp.config', useFactory: () => config },
                { provide: MatDialogRef, useValue: matDialogRefSpy },
                { provide: MAT_DIALOG_DATA, useValue: {} }
            ],
            declarations: [UserPreferencesComponent, FakeAddressComponent, loadingMock, dateMock, ValidationMessageComponent],
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

    it('displays birthday form group', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.detectChanges();

        const birthdayForm = fixture.debugElement.query(By.css('.ddp-user-preferences-birthday'));
        expect(birthdayForm).toBeTruthy();
    });

    it('does not display birthday form group', () => {
        config.userProfileFieldsForEditing = [];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.detectChanges();

        const birthdayForm = fixture.debugElement.query(By.css('.form-subgroup--birthday'));
        expect(birthdayForm).toBeFalsy();
    });


    it('generates correct startYear and endYear', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        const currentDate = new Date(2013, 9, 23);
        jasmine.clock().mockDate(currentDate);

        fixture = TestBed.createComponent(UserPreferencesComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();

        expect(component.endYear).toBe(2013);
        expect(component.startYear).toBe(1893);
    });

    it('calls for user profile when userProfileFieldsForEditing is not empty', () => {
        const profileSpy = spyOnProperty(userProfileServiceAgentMock, 'profile').and.callThrough();
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.detectChanges();

        expect(profileSpy).toHaveBeenCalled();
    });

    it('does not call for user profile when userProfileFieldsForEditing is empty', () => {
        const profileSpy = spyOnProperty(userProfileServiceAgentMock, 'profile').and.callThrough();
        config.userProfileFieldsForEditing = [];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.detectChanges();

        expect(profileSpy).not.toHaveBeenCalled();
    });

    it('prefills birthday date value from user profile', () => {
        spyOnProperty(userProfileServiceAgentMock, 'profile').and.returnValue(of({
            profile: {
                birthYear: 2001,
                birthMonth: 1,
                birthDayInMonth: 1
            }}));
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        component = fixture.debugElement.componentInstance;
        fixture.detectChanges();

        expect(component.birthDate.value).toEqual({ year: 2001, month: 1, day: 1 });
    });

    it('shows validation message and disables submit button if birthday date is empty and form is dirty', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.componentInstance.birthDateValueChanged({ month: null, day: null, year: null });
        fixture.detectChanges();

        const validationMessage = fixture.debugElement.query(By.css('ddp-validation-message'));
        expect(validationMessage.nativeElement.textContent).toContain(validationMessageForDate);

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeTrue();
    });

    it('shows validation message and disables submit button if birthday date is not complete and form is dirty', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.componentInstance.birthDateValueChanged({ month: 1, day: null, year: null });
        fixture.detectChanges();

        const validationMessage = fixture.debugElement.query(By.css('ddp-validation-message'));
        expect(validationMessage.nativeElement.textContent).toContain(validationMessageForDate);

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeTrue();
    });

    it('shows validation message and disables submit button if birthday date does not exist and form is dirty', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        dateServiceSpy.checkExistingDate.and.returnValue(false);
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.componentInstance.birthDateValueChanged({ month: 2, day: 30, year: 1991 });
        fixture.detectChanges();

        const validationMessage = fixture.debugElement.query(By.css('ddp-validation-message'));
        expect(validationMessage.nativeElement.textContent).toContain(validationMessageForDate);

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button')).componentInstance;
        expect(saveButtonElement.disabled).toBeTrue();
    });

    it('disables submit button if address component is busy', () => {
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

    it('calls announceSubmit and does not save profile when when address was changed but profile was not', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);

        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.dirtyStatusChanged.emit(true);
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        const saveProfileSpy = spyOn(userProfileServiceAgentMock, 'saveProfile').and.callThrough();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button'));
        expect(saveButtonElement.componentInstance.disabled).toBeFalse();
        saveButtonElement.nativeElement.click();

        expect(submitAnnouncementServiceSpy.announceSubmit).toHaveBeenCalled();
        expect(saveProfileSpy).not.toHaveBeenCalled();
    });

    it('does not call for announceSubmit and calls for save profile when address was not changed but profile was', () => {
        config.userProfileFieldsForEditing = [UserProfileField.DATE_OF_BIRTH];
        fixture = TestBed.createComponent(UserPreferencesComponent);
        fixture.componentInstance.birthDateValueChanged({ month: 1, day: 30, year: 1991 });

        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();
        const saveProfileSpy = spyOn(userProfileServiceAgentMock, 'saveProfile').and.callThrough();

        const saveButtonElement = fixture.debugElement.query(By.css('.save-button'));
        expect(saveButtonElement.componentInstance.disabled).toBeFalse();
        saveButtonElement.nativeElement.click();

        expect(submitAnnouncementServiceSpy.announceSubmit).not.toHaveBeenCalled();
        expect(saveProfileSpy).toHaveBeenCalledWith(
            false,
            jasmine.objectContaining({ birthMonth: 1, birthDayInMonth: 30, birthYear: 1991 }));
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });

    it('disables address component when user clicks save', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.dirtyStatusChanged.emit(true);
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        fixture.detectChanges();

        expect(addressComponent.componentInstance.readonly).toBe(true);
    });

    it('enables address component and does not close dialog when address submit call is failed', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.dirtyStatusChanged.emit(true);
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        addressComponent.componentInstance.valueChanged.emit(false);
        fixture.detectChanges();

        expect(addressComponent.componentInstance.readonly).toBe(false);
        expect(matDialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('enables address component and closes dialog when address submit call is succeed', () => {
        const addressComponent = fixture.debugElement.query(By.directive(FakeAddressComponent));
        addressComponent.componentInstance.dirtyStatusChanged.emit(true);
        addressComponent.componentInstance.componentBusy.emit(false);
        fixture.detectChanges();

        fixture.debugElement.query(By.css('.save-button')).nativeElement.click();
        addressComponent.componentInstance.valueChanged.emit(true);
        fixture.detectChanges();

        expect(addressComponent.componentInstance.readonly).toBe(false);
        expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
});
