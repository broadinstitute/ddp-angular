import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggingService } from '../../services/logging.service';
import { FireCloudServiceAgent } from '../../services/serviceAgents/fireCloudServiceAgent.service';
import { FireCloudStudiesDataSource } from './fireCloudStudiesDataSource';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ddp-firecloud-studies',
    template: `
        <mat-table #table [dataSource]="dataSource" data-ddp-test="studiesTable">
            <ng-container matColumnDef="studyName">
                <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.ListStudies.StudyName' | translate"></mat-header-cell>
                <mat-cell *matCellDef="let study">
                    <mat-checkbox [(ngModel)]="isChecked"
                                  [disableRipple]="true"
                                  (change)="newMessage(study.studyGuid, isChecked)"
                                  style="cursor: pointer">
                        {{study.studyName}}
                    </mat-checkbox>
                </mat-cell>
            </ng-container>

            <ng-container matColumnDef="participantCount">
                <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.ListStudies.ParticipantCount' | translate"></mat-header-cell>
                <mat-cell *matCellDef="let study">{{study.participantCount}}</mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"
                     [ngClass] = "{'highlight': selectedHighlightedRowIndex == row.id}"
                     (mouseover)="highlight(row);"
                     (mouseleave)="leaveRow(row);"
                      >
            </mat-row>
        </mat-table>`,
    styles: [`
        .highlight{
            background: #f2f2f2;
        }
    `]
})
export class FireCloudListStudiesComponent implements OnInit, OnDestroy {
    public displayedColumns = ['studyName', 'participantCount'];
    public dataSource: FireCloudStudiesDataSource;
    public isChecked: boolean;
    public selectedHighlightedRowIndex = -1;
    public listStudiesMessage: string;
    private anchor: Subscription;

    constructor(
        private serviceAgent: FireCloudServiceAgent,
        private logger: LoggingService) {
    }

    public ngOnInit(): void {
        this.dataSource = new FireCloudStudiesDataSource(this.serviceAgent, this.logger);
        this.anchor = this.serviceAgent.currentListStudiesMessage.subscribe(listStudiesMessage =>
            this.listStudiesMessage = listStudiesMessage);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public highlight(row): void {
        if (this.selectedHighlightedRowIndex === row.id) {
            this.selectedHighlightedRowIndex = -1;
        } else {
            this.selectedHighlightedRowIndex = row.id;
        }
    }

    public leaveRow(row): void {
        this.selectedHighlightedRowIndex = -1;
    }

    public newMessage(studyGuid: string, isChecked: boolean): void {
        let message = 'default message';
        if (isChecked) {
            message = studyGuid;
        }
        this.serviceAgent.changeListStudiesMessage(message);
    }
}
