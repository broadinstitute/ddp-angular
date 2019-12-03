import { Component, Input, Output, EventEmitter } from '@angular/core';

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
                         (open)="open($event)">
    </ddp-user-activities>`
})
export class DashboardComponent {
    @Input() studyGuid: string;
    @Output('open') public openEvent: EventEmitter<string> = new EventEmitter<string>();

    public open(instanceGuid: string): void {
        this.openEvent.emit(instanceGuid);
    }
}
