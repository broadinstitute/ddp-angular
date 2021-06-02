import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DashboardColumns } from '../models/dashboardColumns';

@Component({
    selector: 'ddp-dashboard',
    template: `
    <h2 class="PageContent-subtitle PageContent-subtitle-dashboard" translate>
        SDK.Dashboard.Title
    </h2>
    <p class="PageContent-text PageContent-text-dashboard" translate>
        SDK.Dashboard.Text
    </p>
    <ddp-user-activities [studyGuid]="studyGuid"
                         [selectedUserGuid]="selectedUserGuid"
                         [displayedColumns]="activitiesColumns"
                         (open)="open($event)"
                         (loadedEvent)="load($event)">
    </ddp-user-activities>`
})
export class DashboardComponent implements OnInit {
    @Input() studyGuid: string;
    @Input() selectedUserGuid: string;
    @Output('open') public openEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() public loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public activitiesColumns: DashboardColumns[];

    ngOnInit(): void {
        // todo: return the actions column back once new prism would support actions for selected user
        const baseColumns: DashboardColumns[] = ['name', 'summary', 'date', 'status'];
        this.activitiesColumns = this.selectedUserGuid ? baseColumns : [...baseColumns, 'actions'];
    }

    public open(instanceGuid: string): void {
        this.openEvent.emit(instanceGuid);
    }

    public load(isLoaded: boolean): void {
        this.loadedEvent.emit(isLoaded);
    }
}
