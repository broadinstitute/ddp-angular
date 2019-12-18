import { Component, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { MedicalProvidersServiceAgent } from '../../../services/serviceAgents/medicalProvidersServiceAgent.service';
import { ActivityInstitutionInfo } from '../../../models/activity/activityInstitutionInfo';
import { ActivityInstitutionBlock } from '../../../models/activity/activityInstitutionBlock';
import { InstitutionType } from '../../../models/activity/institutionType';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { filter, scan, map, startWith, distinctUntilChanged, concatMap, tap } from 'rxjs/operators';

@Component({
    selector: 'ddp-institutions-form',
    template: `
    <div class="ddp-institutions-form">
        <p *ngIf="block.titleText" class="ddp-institutions-form__title" [innerHTML]="block.titleText"></p>
        <p *ngIf="block.subtitleText" class="ddp-institutions-form__subtitle" [innerHTML]="block.subtitleText"></p>
        <ddp-institution *ngIf="block.showFieldsInitially"
                         [value]="savedAnswers.length > 0 ? savedAnswers[0] : null"
                         [studyGuid]="studyGuid"
                         [readonly]="readonly"
                         [institutionType]="block.institutionType"
                         [normalizedInstitutionType]="normalizedInstitutionType"
                         (valueChanged)="emitChange(0, $event)"
                         (componentBusy)="requestsInProgress.next($event)">
        </ddp-institution>
        <ng-container *ngFor="let answer of savedAnswers; let i = index">
            <div *ngIf="block.showFieldsInitially ? i >= 1 : i >= 0" [id]="block.institutionType + i">
                <p class="PageContent-subtitle Normal ddp-institutions-form__additional-text">
                    <span *ngIf="isPhysician">Other physician</span>
                    <span *ngIf="isInstitution">Other institution</span>
                    <button mat-icon-button *ngIf="!readonly" (click)="removeProvider(i)">
                        <mat-icon class="ddp-close-button">close</mat-icon>
                    </button>
                </p>
                <ddp-institution [value]="answer"
                                 [studyGuid]="studyGuid"
                                 [readonly]="readonly"
                                 [institutionType]="block.institutionType"
                                 [normalizedInstitutionType]="normalizedInstitutionType"
                                 (valueChanged)="emitChange(i, $event)"
                                 (componentBusy)="requestsInProgress.next($event)">
                </ddp-institution>
            </div>
        </ng-container>
        <div class="ddp-institutions-form__button">
            <button *ngIf="block.allowMultiple && !readonly"
                    class="ButtonFilled ButtonFilled--white margin-5 button button_medium button_secondary button_new-item"
                    (click)="addProvider()">
                {{ block.addButtonText }}
            </button>
        <div>
    </div>`,
    styles: [`
    .ddp-institutions-form__additional-text {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }`]
})
export class InstitutionsFormComponent implements OnInit, OnDestroy {
    @Input() block: ActivityInstitutionBlock;
    @Input() studyGuid: string;
    @Input() readonly: boolean;
    @Output() componentBusy = new EventEmitter<boolean>();
    public normalizedInstitutionType: string;
    public requestsInProgress = new BehaviorSubject<number>(1);
    public savedAnswers: Array<ActivityInstitutionInfo> = new Array<ActivityInstitutionInfo>();
    private deleteSubject = new Subject<string>();
    private outputAnswers: Array<ActivityInstitutionInfo> = new Array<ActivityInstitutionInfo>();
    private anchor: Subscription = new Subscription();
    private subjectsAnchor: Subscription = new Subscription();

    constructor(private providersServiceAgent: MedicalProvidersServiceAgent) { }

    public ngOnInit(): void {
        this.savedAnswers = [];
        this.outputAnswers = [];
        this.normalizedInstitutionType = this.normalizeInstitutionType(this.block.institutionType);
        const get = this.providersServiceAgent.getMedicalProviders(this.studyGuid, this.normalizedInstitutionType)
            .pipe(
                filter(providers => providers !== null)
            ).subscribe(providers => {
                if (providers.length > 0) {
                    providers.forEach((provider) => {
                        const answer = new ActivityInstitutionInfo(provider.physicianName,
                            provider.institutionName,
                            provider.city,
                            provider.state,
                            provider.medicalProviderGuid);
                        this.setAnswer(answer);
                    });
                } else if (providers.length === 0 && this.block.showFieldsInitially) {
                    const answer = new ActivityInstitutionInfo();
                    this.setAnswer(answer);
                }
                this.requestsInProgress.next(-1);
            });

        const sub = this.requestsInProgress.pipe(
            scan((accumulator, value) => accumulator + value, 0),
            map(result => result > 0),
            startWith(false),
            distinctUntilChanged()
        ).subscribe(status => this.componentBusy.emit(status));

        const del = this.deleteSubject.pipe(
            tap(() => this.requestsInProgress.next(1)),
            concatMap(guid => this.providersServiceAgent.deleteMedicalProvider(this.studyGuid,
                this.normalizedInstitutionType, guid))
        ).subscribe(() => this.requestsInProgress.next(-1));

        this.anchor.add(get);
        this.subjectsAnchor
            .add(sub)
            .add(del);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
        this.subjectsAnchor.unsubscribe();
    }

    public emitChange(index: number, value: ActivityInstitutionInfo): void {
        console.log(value);
        this.outputAnswers[index] = value;
    }

    public addProvider(): void {
        const answer = new ActivityInstitutionInfo();
        this.setAnswer(answer);
    }

    public removeProvider(index: number): void {
        const guid = this.outputAnswers[index].guid;
        if (guid) {
            this.deleteSubject.next(guid);
        }
        this.savedAnswers.splice(index, 1);
        this.outputAnswers.splice(index, 1);
    }

    public get isPhysician(): boolean {
        return this.block.institutionType === InstitutionType.Physician;
    }

    public get isInstitution(): boolean {
        return this.block.institutionType === InstitutionType.Institution;
    }

    private setAnswer(answer: ActivityInstitutionInfo): void {
        this.savedAnswers.push(answer);
        this.outputAnswers.push(answer);
    }

    private normalizeInstitutionType(institutionType: string): string {
        return institutionType.replace(/_/g, '-').toLowerCase();
    }
}
