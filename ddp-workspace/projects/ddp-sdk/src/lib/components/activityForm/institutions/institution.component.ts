import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { NgForm } from '@angular/forms';
import { InstitutionServiceAgent } from '../../../services/serviceAgents/institutionServiceAgent.service';
import { MedicalProvidersServiceAgent } from '../../../services/serviceAgents/medicalProvidersServiceAgent.service';
import { Institution } from '../../../models/institution';
import { ActivityInstitutionInfo } from '../../../models/activity/activityInstitutionInfo';
import { ActivityInstitutionForm } from '../../../models/activity/activityInstitutionForm';
import { MedicalProviderResponse } from '../../../models/medicalProviderResponse';
import { InstitutionType } from '../../../models/activity/institutionType';
import { Subscription, BehaviorSubject, Subject, iif, Observable } from 'rxjs';
import { filter, debounceTime, tap, distinctUntilChanged, concatMap } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
    selector: 'ddp-institution',
    template: `
    <form autocomplete="off" #institutionForm="ngForm">
        <mat-form-field *ngIf="isPhysician" class="width">
            <input matInput
                   [(ngModel)]="physicianName"
                   name="physician"
                   placeholder="Physician Name"
                   [autocomplete]="AUTOCOMPLETE_VALUE"
                   [readonly]="readonly"
                   (change)="saveValue()"
                   [required]="required">
        </mat-form-field>
        <mat-form-field class="width">
            <input matInput
                   [(ngModel)]="institutionName"
                   name="institution"
                   [placeholder]="isPhysician ? 'Institution (if any)' : 'Institution'"
                   [disabled]="readonly"
                   (input)="find($event.target.value)"
                   (change)="saveInstitution()"
                   [matAutocomplete]="auto"
                   #textInput="ngModel">
            <mat-autocomplete #auto="matAutocomplete"
                              #autocomplete
                              (optionSelected)="selectInstitution(textInput.value)">
                <mat-option *ngFor="let institution of institutions"
                            [value]="institution.name">
                    {{ institution.name }}
                </mat-option>
            </mat-autocomplete>
        </mat-form-field>
        <mat-form-field class="width">
            <input matInput
                   [(ngModel)]="city"
                   name="city"
                   placeholder="City"
                   [autocomplete]="AUTOCOMPLETE_VALUE"
                   [readonly]="readonly"
                   (change)="saveValue()"
                   [required]="required">
        </mat-form-field>
        <mat-form-field class="width">
            <input matInput
                   [(ngModel)]="state"
                   name="state"
                   placeholder="State"
                   [autocomplete]="AUTOCOMPLETE_VALUE"
                   [readonly]="readonly"
                   (change)="saveValue()"
                   [required]="required">
        </mat-form-field>
    </form>
    <div class="ddp-activity-validation" *ngIf="validationRequested && required && !this.institutionForm.valid && this.institutionForm.touched">
        <ddp-validation-message message="Fill all fields">
        </ddp-validation-message>
    </div>`,
    styles: [`
    .width {
        width: 100%;
    }`]
})
export class InstitutionComponent implements OnInit, OnChanges, OnDestroy {
    @Input() readonly: boolean;
    @Input() value: ActivityInstitutionInfo | null;
    @Input() institutionType: string;
    @Input() normalizedInstitutionType: string;
    @Input() studyGuid: string;
    @Input() required: boolean;
    @Input() validationRequested: boolean;
    @Output() valueChanged: EventEmitter<ActivityInstitutionInfo | null> = new EventEmitter();
    @Output() componentBusy: EventEmitter<number> = new EventEmitter<number>();
    @ViewChild(MatAutocompleteTrigger, { static: true }) autocomplete: MatAutocompleteTrigger;
    @ViewChild('institutionForm', { static: true }) private institutionForm: NgForm;
    public institutions: Array<Institution> = [];
    public institutionName: string;
    public physicianName: string;
    public city: string;
    public state: string;
    public readonly AUTOCOMPLETE_VALUE: string = 'nothing';
    private guid: string | null;
    private timer: any;
    private findSubject: Subject<string> = new Subject<string>();
    private answerSubject: BehaviorSubject<ActivityInstitutionInfo | null> = new BehaviorSubject<ActivityInstitutionInfo | null>(this.value);
    private anchor: Subscription = new Subscription();

    constructor(
        private institutionServiceAgent: InstitutionServiceAgent,
        private providersServiceAgent: MedicalProvidersServiceAgent) {
    }

    public ngOnInit(): void {
        const get = this.institutionServiceAgent
            .getSummary(this.findSubject.pipe(
                debounceTime(200),
                filter(value => value.length > 2)
            )).subscribe(value => this.institutions = value);

        const form = this.answerSubject.pipe(
            filter(answer => answer != null),
            distinctUntilChanged((answer1, answer2) => {
                return _.isEqual(answer1, answer2);
            }),
            tap(() => this.componentBusy.emit(1)),
            concatMap((answer: ActivityInstitutionInfo) => iif(() => !!this.guid,
                this.updateForm(answer),
                this.saveForm(answer)
            ))
        ).subscribe(() => {
            this.componentBusy.emit(-1);
        });

        this.anchor
            .add(get)
            .add(form);
    }

    public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        for (const propName in changes) {
            if (propName === 'value' && this.value) {
                this.institutionName = this.value.institutionName ? this.value.institutionName : '';
                this.physicianName = this.value.physicianName ? this.value.physicianName : '';
                this.city = this.value.city ? this.value.city : '';
                this.state = this.value.state ? this.value.state : '';
                this.guid = this.value.guid ? this.value.guid : '';
            }
            if (propName === 'validationRequested' && this.validationRequested && this.required) {
                for (const controlName in this.institutionForm.controls) {
                    this.institutionForm.controls[controlName].markAsTouched();
                }
            }
        }
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public find(input: string): void {
        this.findSubject.next(input);
        if (input.length < 3) {
            this.institutions = [];
            this.autocomplete.closePanel();
        }
    }

    public saveValue(): void {
        const answer = new ActivityInstitutionInfo(this.physicianName ? this.physicianName : '',
            this.institutionName ? this.institutionName : '',
            this.city ? this.city : '',
            this.state ? this.state : '',
            this.guid ? this.guid : ''
        );
        this.answerSubject.next(answer);
    }

    public saveInstitution(): void {
        // setTimeout is necessary, because if we select value in <mat-autocomplete>,
        // <input> will call (change), then (optionSelected) in <mat-autocomplete>,
        // we will send two request with different values, so, setTimeout postpones (change)
        // handler and if we used <mat-autocomplete> cancels it in (optionSelected) handler,
        // or (change) will handle with small delay.
        this.timer = setTimeout(() => {
            this.saveValue();
        }, 200);
    }

    public selectInstitution(name: string): void {
        // Cancel saveInstitution() if we used autocomplete
        clearTimeout(this.timer);
        const index = this.institutions.findIndex(x => x.name === name);
        if (index > -1) {
            const institution = this.institutions[index];
            this.institutionName = institution.name;
            this.city = institution.city;
            this.state = institution.state;
            this.saveValue();
        }
    }

    public get isPhysician(): boolean {
        return this.institutionType === InstitutionType.Physician;
    }

    private getAnswerForm(answer: ActivityInstitutionInfo): ActivityInstitutionForm {
        return new ActivityInstitutionForm(answer.physicianName, answer.institutionName, answer.city, answer.state);
    }

    private updateForm(answer: ActivityInstitutionInfo): Observable<void> {
        const form = this.getAnswerForm(answer);
        return this.providersServiceAgent.updateMedicalProvider(this.studyGuid,
            this.normalizedInstitutionType, this.guid, form).pipe(
                tap(() => this.valueChanged.emit(answer))
            );
    }

    private saveForm(answer: ActivityInstitutionInfo): Observable<MedicalProviderResponse> {
        const form = this.getAnswerForm(answer);
        return this.providersServiceAgent.createMedicalProvider(this.studyGuid,
            this.normalizedInstitutionType, form).pipe(
                tap(response => {
                    const answer = new ActivityInstitutionInfo(form.physicianName ? form.physicianName : '',
                        form.physicianName ? form.physicianName : '',
                        form.city ? form.city : '',
                        form.state ? form.state : '',
                        response.medicalProviderGuid
                    );
                    this.guid = response.medicalProviderGuid;
                    this.valueChanged.emit(answer);
                })
            );
    }
}
