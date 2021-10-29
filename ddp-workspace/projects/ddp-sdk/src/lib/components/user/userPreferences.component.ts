import { ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfileServiceAgent } from '../../services/serviceAgents/userProfileServiceAgent.service';
import { DateService } from '../../services/dateService.service';
import { UserProfileDecorator } from '../../models/userProfileDecorator';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { ConfigurationService } from '../../services/configuration.service';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { Address } from '../../models/address';
import { UserProfileField } from '../../models/userProfileFieldType';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { DateRenderMode } from '../../models/activity/dateRenderMode';
import { DatePickerValue } from '../../models/datePickerValue';
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
    selector: 'ddp-user-preferences',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h2 mat-dialog-title translate>{{'SDK.UserPreferences.UserPreferencesTitle' | translate}}{{data.userName ? ': ' + data.userName : ''}}</h2>
        <ddp-loading [loaded]="loaded"></ddp-loading>
        <mat-dialog-content>
            <ng-container *ngIf="userProfileFieldsForEditing.size" [formGroup]="profileForm">
                <div *ngIf="userProfileFieldsForEditing.has(UserProfileField.NAME)"
                     class="ddp-user-preferences-subgroup ddp-user-preferences-username">
                    <h3 class="ddp-user-preferences-subgroup-title">{{'SDK.UserPreferences.UserName' | translate}}</h3>
                    <div class="ddp-user-preferences-username-container">
                        <mat-form-field class="ddp-user-preferences-first-name">
                            <input matInput
                                   type="text"
                                   formControlName="firstName"
                                   [placeholder]="'SDK.UserPreferences.FirstUserName' | translate"/>
                            <mat-error *ngIf="firstName.invalid">{{'SDK.UserPreferences.FirstNameFieldIsRequired' | translate}}</mat-error>
                        </mat-form-field>
                        <mat-form-field class="ddp-user-preferences-last-name">
                            <input matInput
                                   type="text"
                                   formControlName="lastName"
                                   [placeholder]="'SDK.UserPreferences.LastUserName' | translate"
                            />
                            <mat-error *ngIf="lastName.invalid">{{'SDK.UserPreferences.LastNameFieldIsRequired' | translate}}</mat-error>
                        </mat-form-field>
                    </div>
                </div>
                <div *ngIf="userProfileFieldsForEditing.has(UserProfileField.DATE_OF_BIRTH)"
                     class="ddp-user-preferences-subgroup ddp-user-preferences-birthday">
                    <h3 class="ddp-user-preferences-subgroup-title">{{'SDK.UserPreferences.DateOfBirth' | translate}}</h3>
                    <ddp-date [readonly]="!loaded"
                              [renderMode]="DateRenderMode.Picklist"
                              [startYear]="startYear"
                              [endYear]="endYear"
                              [dateValue]="birthDate.value"
                              (valueChanged)="birthDateValueChanged($event)">
                    </ddp-date>
                    <ddp-validation-message *ngIf="birthDate.dirty && birthDate.invalid"
                                            [message]="'SDK.Validators.DateNavyValidationRule' | translate">
                    </ddp-validation-message>
                </div>
            </ng-container>
            <div class="ddp-user-preferences-subgroup">
                <h3 class="ddp-user-preferences-subgroup-title">{{'SDK.UserPreferences.MailingAddress' | translate}}</h3>
                <ddp-address-embedded [block]="addressFormBlock"
                                      [country]="supportedCountry"
                                      [readonly]="addressReadonly"
                                      (validStatusChanged)="isAddressValid = $event"
                                      (valueChanged)="addressSubmitFinalized$.next($event)"
                                      (componentBusy)="isAddressComponentBusy$.next($event)"
                                      (dirtyStatusChanged)="addressDirty = $event"
                                      (errorOrSuggestionWasShown)="scrollToTheBottom()">
                </ddp-address-embedded>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-flat-button
                    color="primary"
                    class="button button_medium save-button"
                    [disabled]="!this.canSaveUserPreferences()"
                    (click)="save()"
                    data-ddp-test="okButton">
                {{'SDK.SaveButton' | translate}}
            </button>
            <button mat-button
                    class="button button_medium button_secondary"
                    mat-dialog-close
                    data-ddp-test="cancelButton">
                {{'SDK.CancelButton' | translate}}
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        .field-row {
            width: 30%;
            padding-right: 5px;
        }
        .row {
            width: 100%;
        }
        ::ng-deep .mat-option {
            height: 30px !important;
        }
        .mat-dialog-actions {
            justify-content: flex-end;
        }
        /* some space for mat-card box-shadow */
        ddp-address-embedded {
            padding-bottom: 5px;
            display: block;
        }
    `],
    providers: [SubmitAnnouncementService]
})
export class UserPreferencesComponent implements OnDestroy {
    public profileForm = this.formBuilder.group({
        birthDate: ['', this.getBirthDateValidator()],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
    });
    private readonly YEARS_BACK = 100;
    public readonly endYear: number;
    public readonly startYear: number;
    public loaded = true;
    private userProfileModel: UserProfileDecorator | null;
    private ngUnsubscribe = new Subject();
    public readonly addressFormBlock: MailAddressBlock = new MailAddressBlock(null);
    public isAddressValid = true;
    public isAddressComponentBusy$ = new BehaviorSubject(false);
    public addressSubmitFinalized$ = new Subject<Address | null>();
    public addressReadonly = false;
    public addressDirty = false;
    public readonly supportedCountry: string | null;
    public readonly userProfileFieldsForEditing: Set<UserProfileField>;
    public readonly UserProfileField = UserProfileField;
    public readonly DateRenderMode = DateRenderMode;
    public readonly userName: string;
    public get birthDate(): FormControl {
        return this.profileForm.get('birthDate') as FormControl;
    }
    public get firstName(): FormControl {
        return this.profileForm.get('firstName') as FormControl;
    }
    public get lastName(): FormControl {
        return this.profileForm.get('lastName') as FormControl;
    }

    constructor(
        private serviceAgent: UserProfileServiceAgent,
        public dialogRef: MatDialogRef<UserPreferencesComponent>,
        private dateService: DateService,
        private submitAnnouncementService: SubmitAnnouncementService,
        private element: ElementRef,
        private ngZone: NgZone,
        private formBuilder: FormBuilder,
        @Inject('ddp.config') config: ConfigurationService,
        @Inject(MAT_DIALOG_DATA) public data: { userName: string }
        ) {
        this.userName = data.userName;
        this.supportedCountry = config.supportedCountry;
        this.userProfileFieldsForEditing = new Set(config.userProfileFieldsForEditing);

        this.endYear = new Date().getFullYear();
        this.startYear = this.endYear - this.YEARS_BACK;

        if (this.userProfileFieldsForEditing.size) {
            this.loaded = false;
            serviceAgent.profile.pipe(
                finalize(() => this.loaded = true),
                takeUntil(this.ngUnsubscribe)
            ).subscribe(x => {
                this.userProfileModel = x;
                if (x && x.profile) {
                    this.birthDate.setValue({
                        year: x.profile.birthYear,
                        month: x.profile.birthMonth,
                        day: x.profile.birthDayInMonth,
                    });
                    this.firstName.setValue(x.profile.firstName);
                    this.lastName.setValue(x.profile.lastName);
                }
            });
        }

        this.isAddressComponentBusy$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((isBusy) => {
                this.loaded = !isBusy;
            });
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private getBirthDateValidator(): ValidatorFn {
        return (control: FormControl): ValidationErrors | null => {
            const value = control.value;
            if (!value.year || !value.month || !value.day) {
                return { invalidDate: true };
            }
            return this.dateService.checkExistingDate(value.year, value.month, value.day) ? null : { invalidDate: true };
        };
    }

    public canSaveUserPreferences(): boolean {
        return this.loaded && this.isAddressValid
            && (this.profileForm.valid
                // let's allow to save preferences if user didn't touch empty profile fields since s/he can fill it later at action forms
                || Object.values(this.profileForm.controls).filter(control => control.invalid).every(control => control.pristine));
    }

    public save(): void {
        const shouldProfileBeUpdated = this.profileForm.dirty;
        if (shouldProfileBeUpdated) {
            this.userProfileModel.profile.birthYear = this.birthDate.value.year;
            this.userProfileModel.profile.birthMonth = this.birthDate.value.month;
            this.userProfileModel.profile.birthDayInMonth = this.birthDate.value.day;
            this.userProfileModel.profile.firstName = this.firstName.value;
            this.userProfileModel.profile.lastName = this.lastName.value;
        }
        const profileObservable = shouldProfileBeUpdated ?
            this.serviceAgent.saveProfile(this.userProfileModel.newProfile, this.userProfileModel.profile) :
            of(true);

        // emit address update submit
        if (this.addressDirty) {
            this.submitAnnouncementService.announceSubmit();
        }
        const addressObservable = this.addressDirty ? this.addressSubmitFinalized$.pipe(take(1)) : of(true);

        this.loaded = false;
        this.addressReadonly = true;
        forkJoin([profileObservable, addressObservable])
            .pipe(takeUntil(this.ngUnsubscribe), finalize(() => {
                this.loaded = true;
                this.addressReadonly = false;
            }))
            .subscribe(([_, address]) => {
                if (address) {
                    this.dialogRef.close();
                }
            });
    }

    public scrollToTheBottom(): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            const contentElement = this.element.nativeElement.querySelector('mat-dialog-content');
            contentElement.scrollTop = contentElement.scrollHeight;
        });
    }

    public birthDateValueChanged(date: DatePickerValue): void {
        this.birthDate.setValue(date);
        this.birthDate.markAsDirty();
    }
}
