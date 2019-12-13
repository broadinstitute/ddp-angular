import { Injectable, Inject } from '@angular/core';
import { ToolkitConfigurationService } from './toolkitConfiguration.service';
import { WorkflowAction } from './../models/actions/workflowAction';
import { UrlWorkflowAction } from '../models/actions/urlWorkflowAction';
import { MailingListWorkflowAction } from '../models/actions/mailingListWorkflowAction';
import { RegistrationWorkflowAction } from '../models/actions/registrationWorkflowAction';
import { WorkflowState } from './../models/workflowState';
import { ActivityResponse, LoggingService } from 'ddp-sdk';

@Injectable()
export class WorkflowMapperService {
    constructor(
        private logger: LoggingService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public convert(activityResponse: ActivityResponse): WorkflowAction {
        if (activityResponse.next === this.toolkitConfiguration.dashboardGuid || activityResponse.next === WorkflowState.DASHBOARD
            || activityResponse.next === WorkflowState.UNKNOWN) {
            return new UrlWorkflowAction(this.toolkitConfiguration.dashboardUrl);
        } else if (activityResponse.next === this.toolkitConfiguration.thankYouGuid || activityResponse.next === WorkflowState.THANK_YOU) {
            return new UrlWorkflowAction(this.toolkitConfiguration.thankYouUrl);
        } else if (activityResponse.next === this.toolkitConfiguration.internationalPatientsUrl
            || activityResponse.next === WorkflowState.INTERNATIONAL_PATIENTS) {
            return new UrlWorkflowAction(this.toolkitConfiguration.internationalPatientsUrl);
        } else if (activityResponse.next === WorkflowState.ACTIVITY) {
            switch (activityResponse.activityCode) {
                case this.toolkitConfiguration.prequalifierGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.prequalifierUrl);
                case this.toolkitConfiguration.consentGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.consentUrl);
                case this.toolkitConfiguration.releaseGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.releaseUrl);
                case this.toolkitConfiguration.tissueConsentGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.tissueConsentUrl);
                case this.toolkitConfiguration.tissueReleaseGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.tissueReleaseUrl);
                case this.toolkitConfiguration.followupGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.followupUrl);
                case this.toolkitConfiguration.bloodConsentGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.bloodConsentUrl);
                case this.toolkitConfiguration.bloodReleaseGuid:
                    return new UrlWorkflowAction(this.toolkitConfiguration.bloodReleaseUrl);
                default:
                    // If we have a next activity instance but no dedicated route, that's okay. Load it on-the-fly.
                    return new UrlWorkflowAction(`activity/${activityResponse.instanceGuid}`);
            }
        } else if (activityResponse.next === WorkflowState.MAILING_LIST) {
            return new MailingListWorkflowAction();
        } else if (activityResponse.next === WorkflowState.REGISTRATION) {
            return new RegistrationWorkflowAction();
        } else {
            this.logger.logWarning('WorkflowMapperService',
                `Unknown server routing: ${JSON.stringify(activityResponse)}`);
        }
        return new UrlWorkflowAction('');
    }
}
