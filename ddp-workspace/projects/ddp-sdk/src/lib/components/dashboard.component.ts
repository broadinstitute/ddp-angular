import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityInstance } from '../models/activityInstance';

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
                             [dataSource]="activities"
                             (open)="open($event)"
                             (loadedEvent)="load($event)">
        </ddp-user-activities>`
})
export class DashboardComponent {
    @Input() studyGuid: string;
    @Input() activities: Array<ActivityInstance>;
    @Output('open') public openEvent: EventEmitter<string> = new EventEmitter<string>();
    @Output() public loadedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

    public open(instanceGuid: string): void {
        this.openEvent.emit(instanceGuid);
    }

    public load(isLoaded: boolean): void {
        this.loadedEvent.emit(isLoaded);
    }
}
