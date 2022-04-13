import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivityResponse, CompositeDisposable } from 'ddp-sdk';
import { pluck } from 'rxjs/operators';
import {
    HeaderConfigurationService,
    ToolkitConfigurationService,
    WorkflowBuilderService,
} from 'toolkit';

@Component({
    selector: 'app-activity-page',
    template: `
        <app-activity [studyGuid]="studyGuid"
                        [activityGuid]="instanceGuid"
                        [agreeConsent]="config.agreeConsent"
                        (submit)="navigate($event)"
                        (stickySubtitle)="showStickySubtitle($event)"
                        (activityCode)="activityCodeChanged($event)">
        </app-activity>
    `,
})
export class ActivityPageComponent implements OnInit, OnDestroy {
    instanceGuid: string;
    studyGuid: string;
    private subs = new CompositeDisposable();

    constructor(
        private headerConfig: HeaderConfigurationService,
        private route: ActivatedRoute,
        private workflowBuilder: WorkflowBuilderService,

        @Inject('toolkit.toolkitConfig')
        public config: ToolkitConfigurationService
    ) {}

    public ngOnInit(): void {
        this.studyGuid = this.config.studyGuid;

        const sub = this.route.params
        .pipe(pluck('id'))
        .subscribe((instanceGuid) => (this.instanceGuid = instanceGuid));

        this.subs.addNew(sub);

        this.headerConfig.setupActivityHeader();
    }

    public ngOnDestroy(): void {
        this.subs.removeAll();
    }

    public showStickySubtitle(stickySubtitle: string): void {
        this.headerConfig.stickySubtitle = stickySubtitle;
    }

    public activityCodeChanged(code: string): void {
        this.headerConfig.currentActivityCode = code;
    }

    public navigate(response: ActivityResponse): void {
        const currentActivityCode =
            this.headerConfig && this.headerConfig.currentActivityCode;

        this.workflowBuilder
            .getCommand(response, currentActivityCode)
            .execute();
    }
}
