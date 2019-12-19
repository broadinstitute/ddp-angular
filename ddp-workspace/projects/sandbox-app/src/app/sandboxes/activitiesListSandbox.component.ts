import { Component } from '@angular/core';

@Component({
    selector: 'app-sandbox-activities-list',
    templateUrl: 'activitiesListSandbox.component.html'
})
export class ActivitiesListSandboxComponent {
    public activitiesStudyGuid = 'TESTSTUDY1';
    public selectedActivity: string;
    public totalCount = 0;

    public handleAction(guid: string): void {
        this.selectedActivity = guid;
        this.totalCount++;
    }
}
