import { Component, OnDestroy } from '@angular/core';
import { PrequalifierServiceAgent } from 'ddp-sdk';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sandbox-activity',
    templateUrl: 'activitySandbox.component.html'
})
export class ActivitySandboxComponent implements OnDestroy {
    public studyGuid = 'TESTSTUDY1';
    public activityInstanceGuid: string;
    public stepper = false;
    public totalCount = 0;
    private anchor: Subscription;

    constructor(private prequalifierServiceAgent: PrequalifierServiceAgent) {
        this.anchor = this.prequalifierServiceAgent.getPrequalifier(this.studyGuid)
            .subscribe(x => {
                this.activityInstanceGuid = x;
                this.anchor.unsubscribe();
            });
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public handleAction(): void {
        this.totalCount++;
    }

    public handleLoadResponse(event) {
        // FIXME: do something with event or remove this from template
        console.log(event);
    }
}
