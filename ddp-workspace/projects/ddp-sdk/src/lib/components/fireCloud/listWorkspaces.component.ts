import { Subscription } from 'rxjs';
import { LoggingService } from '../../services/logging.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FireCloudServiceAgent } from '../../services/serviceAgents/fireCloudServiceAgent.service';
import { FireCloudWorkspacesDataSource } from './fireCloudWorkspacesDataSource';

@Component({
    selector: 'ddp-firecloud-workspaces',
    template: `
        <mat-table #table [dataSource]="dataSource" data-ddp-test="workspacesTable">
            <ng-container matColumnDef="workspaceName">
                <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.ListWorkspaces.WorkspaceName' | translate"></mat-header-cell>
                <mat-cell *matCellDef="let workspace">
                    <mat-checkbox [(ngModel)]="isChecked"
                                  [disableRipple]="true"
                                  (change)="newMessage(workspace.name, workspace.namespace, isChecked)"
                                  style="cursor: pointer">
                        {{workspace.name}}
                    </mat-checkbox>
                </mat-cell>
            </ng-container>

            <ng-container matColumnDef="workspaceNamespace">
                <mat-header-cell *matHeaderCellDef [innerHTML]="'SDK.ListWorkspaces.WorkspaceNamespace' | translate"></mat-header-cell>
                <mat-cell *matCellDef="let workspace">{{workspace.namespace}}</mat-cell>
            </ng-container>

            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"
                     [ngClass] = "{'highlight': selectedHighlightedRowIndex == row.id}"
                     (mouseover)="highlight(row);"
                     (mouseleave)="leaveRow(row);">
            </mat-row>
        </mat-table>`,
    styles: [`
        .highlight{
            background: #f2f2f2;
        }
    `]
})
export class FireCloudListWorkspacesComponent implements OnInit, OnDestroy {
    public displayedColumns = ['workspaceName', 'workspaceNamespace'];
    public dataSource: FireCloudWorkspacesDataSource;
    public isChecked: boolean;
    public selectedHighlightedRowIndex = -1;
    public listWorkspacesMessage: string;
    public listWorkspaceNamespacesMessage: string;
    private anchor: Subscription;

    constructor(
        private serviceAgent: FireCloudServiceAgent,
        private logger: LoggingService) {
    }

    public ngOnInit(): void {
        this.anchor = new Subscription();
        this.dataSource = new FireCloudWorkspacesDataSource(this.serviceAgent, this.logger);
        const message = this.serviceAgent.currentListWorkspacesMessage.subscribe(listWorkspaceMessage =>
            this.listWorkspacesMessage = listWorkspaceMessage);
        const nameSpace = this.serviceAgent.currentListWorkspaceNamespacesMessage.subscribe(listWorkspaceNamespacesMessage =>
            this.listWorkspaceNamespacesMessage = listWorkspaceNamespacesMessage);
        this.anchor
            .add(message)
            .add(nameSpace);
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

    public newMessage(workspaceName: string, workspaceNamespace: string, isChecked: boolean): void {
        const message = 'default message';
        if (isChecked) {
            this.serviceAgent.changeListWorkspacesMessage(workspaceName);
            this.serviceAgent.changeListWorkspaceNamespacesMessage(workspaceNamespace);
        } else {
            this.serviceAgent.changeListWorkspacesMessage(message);
            this.serviceAgent.changeListWorkspaceNamespacesMessage(message);
        }
    }
}
