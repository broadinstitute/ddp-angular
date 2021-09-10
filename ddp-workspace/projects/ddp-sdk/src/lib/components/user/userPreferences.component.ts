import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompositeDisposable } from '../../compositeDisposable';
import { UserProfileServiceAgent } from '../../services/serviceAgents/userProfileServiceAgent.service';
import { DateService } from '../../services/dateService.service';
import { UserProfileDecorator } from '../../models/userProfileDecorator';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'ddp-user-preferences',
    template: `
        <h2 mat-dialog-title translate>SDK.UserPreferences.UserPreferencesTitle</h2>
        <mat-dialog-content>
            <mat-form-field class="field-row" data-ddp-test="birthday::month">
                <mat-select placeholder="Month" [(value)]="monthOfBirth">
                    <mat-option *ngFor="let month of months" [value]="month">
                        {{ month }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field class="field-row" data-ddp-test="birthday::day">
                <mat-select placeholder="Date" [(value)]="dayOfBirth">
                    <mat-option *ngFor="let day of days" [value]="day">
                        {{ day }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field class="field-row" data-ddp-test="birthday::year">
                <mat-select placeholder="Year" [(value)]="yearOfBirth" >
                    <mat-option *ngFor="let year of years" [value]="year">
                        {{ year }}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <div class="row">
                <mat-form-field data-ddp-test="gender">
                    <mat-select placeholder="{{'SDK.UserPreferences.UserPreferencesGender' | translate}}"
                                [(value)]="sex"
                                [disabled]="!loaded">
                        <mat-option value="MALE" data-ddp-test="sex::Male">Male</mat-option>
                        <mat-option value="FEMALE" data-ddp-test="sex::Female">Female</mat-option>
                        <mat-option value="INTERSEX" data-ddp-test="sex::Other">Intersex</mat-option>
                        <mat-option value="PREFER_NOT_TO_ANSWER" data-ddp-test="sex::Other">Prefer not to answer</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </mat-dialog-content>
        <ddp-validation-message *ngIf="!isDateValid" message="invalid date">
        </ddp-validation-message>
        <ddp-loading [loaded]="loaded"></ddp-loading>
        <mat-dialog-actions>
            <button mat-button
                    [disabled]="!loaded"
                    (click)="save()"
                    data-ddp-test="okButton"
                    [innerHTML]="'SDK.SaveButton' | translate">
            </button>
            <button mat-button
                    mat-dialog-close
                    data-ddp-test="cancelButton"
                    [innerHTML]="'SDK.CancelButton' | translate">
            </button>
        </mat-dialog-actions>
    `,
    styles: [`
        .field-row {
            float: left;
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
    `]
})
export class UserPreferencesComponent implements OnDestroy {
    public locales: Array<string>;
    public sex: string | null;
    public dayOfBirth: number | null;
    public monthOfBirth: number | null;
    public yearOfBirth: number | null;
    public days: Array<number> = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
    ];
    public months: Array<number> = [
        1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12
    ];
    public years: Array<number> = [];
    public loaded = false;
    public showError = false;
    private anchor: CompositeDisposable;
    private model: UserProfileDecorator | null;

    constructor(
        private serviceAgent: UserProfileServiceAgent,
        public dialogRef: MatDialogRef<UserPreferencesComponent>,
        private dateService: DateService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.locales = ['en', 'ru', 'fr'];
        this.anchor = new CompositeDisposable();

        for (let i = 0; i < 50; i++) {
            this.years.push(2005 - i);
        }
        const profile = serviceAgent.profile.pipe(
            tap(() => this.loaded = true)
        ).subscribe(x => {
            this.model = x;
            if (x && x.profile) {
                this.sex = x.profile.sex;
                this.yearOfBirth = x.profile.birthYear;
                this.monthOfBirth = x.profile.birthMonth;
                this.dayOfBirth = x.profile.birthDayInMonth;
            }
        });
        this.anchor.addNew(profile);
    }

    public ngOnDestroy(): void {
        this.anchor.removeAll();
    }

    public isDateReadyForSave(isFirstInput: boolean): boolean {
        if (!this.yearOfBirth && !this.monthOfBirth && !this.dayOfBirth) {
            return true;
        }
        if (!this.yearOfBirth || !this.monthOfBirth || !this.dayOfBirth) {
            return !isFirstInput;
        }
        return this.dateService.checkExistingDate(this.yearOfBirth, this.monthOfBirth, this.dayOfBirth);
    }

    public get isDateValid(): boolean {
        return this.isDateReadyForSave(this.showError);
    }

    public save(): void {
        if (!this.isDateReadyForSave(true)) {
            this.showError = true;
            return;
        }

        if (this.model) {
            if (this.yearOfBirth && this.monthOfBirth && this.dayOfBirth) {
                this.model.profile.birthYear = this.yearOfBirth;
                this.model.profile.birthMonth = this.monthOfBirth;
                this.model.profile.birthDayInMonth = this.dayOfBirth;
            }
            this.model.profile.sex = this.sex;
        }

        if (this.model) {
            const profile = this.serviceAgent
                .saveProfile(this.model.newProfile, this.model.profile)
                .subscribe(() => {
                    location.reload();
                });
            this.anchor.addNew(profile);
        }
    }
}
