import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import {
    ActivityResponse,
    ConfigurationService,
    SessionMementoService,
    SessionStorageService,
    TemporaryUserServiceAgent,
    WindowRef,
    WorkflowServiceAgent,
} from 'ddp-sdk';

import {
    HeaderConfigurationService,
    ToolkitConfigurationService,
    WorkflowBuilderService,
    WorkflowStartActivityRedesignedComponent,
} from 'toolkit';

import { Routes } from '../../routes';

@Component({
    selector: 'app-workflow-start-activity',
    templateUrl: './workflow-start-activity.component.html',
    styleUrls: ['./workflow-start-activity.component.scss'],
})
export class WorkflowStartActivityComponent extends WorkflowStartActivityRedesignedComponent {
    private readonly MAILING_LIST_RESPONSE = 'MAILING_LIST';

    constructor(
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private headerConfigurationService: HeaderConfigurationService,
        private workflowBuilderService: WorkflowBuilderService,
        private tempUserService: TemporaryUserServiceAgent,
        private sessionService: SessionMementoService,
        private workflowService: WorkflowServiceAgent,
        private wr: WindowRef,
        private _sessionStorageService: SessionStorageService,
        @Inject('ddp.config') private config: ConfigurationService,
        @Inject('toolkit.toolkitConfig')
        private toolkitConfig: ToolkitConfigurationService,
    ) {
        super(
            headerConfigurationService,
            workflowBuilderService,
            tempUserService,
            sessionService,
            workflowService,
            wr,
            changeDetectorRef,
            _sessionStorageService,
            config,
            toolkitConfig,
        );
    }

    navigate(response: ActivityResponse): void {
        if (response.next === this.MAILING_LIST_RESPONSE) {
            this.router.navigateByUrl(Routes.ThankYou);
        } else {
            super.navigate(response);
        }
    }
}
