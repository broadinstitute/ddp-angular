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
import { FormBuilder, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'ddp-user-preferences',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <h2 mat-dialog-title translate>{{'SDK.UserPreferences.UserPreferencesTitle' | translate}}{{data.userName ? ': ' + data.userName : ''}}</h2>
        <ddp-loading [loaded]="loaded"></ddp-loading>
        <mat-dialog-content>
            <ng-container *ngIf="userProfileFieldsForEditing.size">
                <div *ngIf="userProfileFieldsForEditing.has(UserProfileField.DATE_OF_BIRTH)" class="form-subgroup form-subgroup--birthday">
                    <h3 class="form-subgroup-title">User date of birth</h3>
                    <ddp-date [readonly]="!loaded"
                              [renderMode]="DateRenderMode.Picklist"
                              [startYear]="startYear"
                              [endYear]="endYear"
                              [dateValue]="birthDate.value"
                              (valueChanged)="birthDateValueChanged($event)">
                    </ddp-date>
                </div>
            </ng-container>
            <div class="form-subgroup">
                <h3 class="form-subgroup-title">User Mailing Address</h3>
                <ddp-address-embedded [block]="addressFormBlock"
                                      [country]="supportedCountry"
                                      [readonly]="addressReadonly"
                                      (validStatusChanged)="isAddressValid = $event"
                                      (valueChanged)="addressSubmitFinalized$.next($event)"
                                      (componentBusy)="isAddressComponentBusy$.next($event)"
                                      (inputAddress)="addressDirty = true"
                                      (errorOrSuggestionWasShown)="scrollToTheBottom()">
                </ddp-address-embedded>
            </div>
        </mat-dialog-content>
        <ddp-validation-message *ngIf="birthDate.dirty && birthDate.invalid"
                                [message]="'SDK.Validators.DateNavyValidationRule' | translate">
        </ddp-validation-message>
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
    private profileForm = this.formBuilder.group({
        birthDate: ['', this.getBirthDateValidator()],
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
            // let's allow to save preferences if user didn't touch empty birthday date since s/he can fill it later at action forms
            && (this.birthDate.valid || (this.birthDate.invalid && this.birthDate.pristine));
    }

    public save(): void {
        const shouldProfileBeUpdated = this.profileForm.dirty;
        if (shouldProfileBeUpdated) {
            this.userProfileModel.profile.birthYear = this.birthDate.value.year;
            this.userProfileModel.profile.birthMonth = this.birthDate.value.month;
            this.userProfileModel.profile.birthDayInMonth = this.birthDate.value.day;
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
