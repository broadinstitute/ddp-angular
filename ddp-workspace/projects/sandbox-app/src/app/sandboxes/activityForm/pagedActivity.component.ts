import { Component } from '@angular/core';
import { ActivityServiceAgent } from 'ddp-sdk';

@Component({
    selector: 'app-paged-activity',
    templateUrl: 'pagedActivity.component.html'
})
export class PagedActivityComponent {
    public instanceGuid: string;
    public activityGuid: string = 'READONLY01';

    constructor(private serviceAgent: ActivityServiceAgent) { }

    public create(): void {
        this.serviceAgent.createInstance('TESTSTUDY1', this.activityGuid)
            .subscribe(x => {
                !!x && (this.instanceGuid = x.instanceGuid);
            });
    }
}