import { Injectable, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UrlCommand } from './commands/urlCommand.service';
import { MailingListCommand } from './commands/mailingListCommand.service';
import { RegistrationCommand } from './commands/registrationCommand.service';
import { WorkflowRule } from './../models/workflowRule';
import { WorkflowActionType } from '../models/workflowActionType';
import { MailingListWorkflowAction } from './../models/actions/mailingListWorkflowAction';
import { UrlWorkflowAction } from './../models/actions/urlWorkflowAction';
import { RegistrationWorkflowAction } from './../models/actions/registrationWorkflowAction';
import { WorkflowCommand } from '../models/workflowCommand';
import { WorkflowMapperService } from './workflowMapper.service';
import { ToolkitConfigurationService } from './toolkitConfiguration.service';
import { ActivityResponse, UserProfileServiceAgent, Auth0AdapterService } from 'ddp-sdk';

@Injectable()
export class WorkflowBuilderService {
    private workflowBuilders: Array<WorkflowRule>;

    constructor(
        private router: Router,
        private dialog: MatDialog,
        private userProfile: UserProfileServiceAgent,
        private workflowMapper: WorkflowMapperService,
        private auth0: Auth0AdapterService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
        this.workflowBuilders = [
            {
                type: WorkflowActionType.URL,
                func: (action: UrlWorkflowAction) => new UrlCommand(action.url, this.router)
            },
            {
                type: WorkflowActionType.MAILING_LIST,
                func: (action: MailingListWorkflowAction) => new MailingListCommand(this.dialog, this.userProfile)
            },
            {
                type: WorkflowActionType.REGISTRATION,
                func: (action: RegistrationWorkflowAction) => new RegistrationCommand(this.auth0)
            }
        ];
    }

    public getCommand(response: ActivityResponse): WorkflowCommand {
        const action = this.workflowMapper.convert(response);
        const builder = this.workflowBuilders.find(x => x.type === action.actionType);
        if (builder) {
            return builder.func(action);
        } else {
            return new UrlCommand(this.toolkitConfiguration.errorUrl, this.router);
        }
    }
}
