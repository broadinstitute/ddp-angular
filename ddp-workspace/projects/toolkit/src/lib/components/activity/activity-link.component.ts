import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { WorkflowServiceAgent } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
    selector: 'toolkit-activity-link',
    template: `<p></p>`
})
export class ActivityLinkComponent implements OnInit {

    // This component handles redirecting the user when they come back into the app
    // through an email link. If we have a faulty link with the below placeholder,
    // we try to find their next step in the workflow and show that instead.
    private ACTIVITY_ID_PLACEHOLDER = '-ddp.activityInstanceGuid-';

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private workflowService: WorkflowServiceAgent,
        private workflowBuilder: WorkflowBuilderService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe(x => {
            if (x.id === this.ACTIVITY_ID_PLACEHOLDER) {
                this.workflowService.getNext()
                    .pipe(take(1))
                    .subscribe(response => response && this.workflowBuilder.getCommand(response).execute());
            } else {
                this.router.navigateByUrl(`/activity/${x.id}`);
            }
        });
    }
}
