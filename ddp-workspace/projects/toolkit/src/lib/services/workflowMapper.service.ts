import { Injectable, Inject } from '@angular/core';
import { ToolkitConfigurationService } from './toolkitConfiguration.service';
import { WorkflowAction } from '../models/actions/workflowAction';
import { UrlWorkflowAction } from '../models/actions/urlWorkflowAction';
import { MailingListWorkflowAction } from '../models/actions/mailingListWorkflowAction';
import { RegistrationWorkflowAction } from '../models/actions/registrationWorkflowAction';
import { WorkflowState } from '../models/workflowState';
import { ActivityResponse, LoggingService } from 'ddp-sdk';

@Injectable()
export class WorkflowMapperService {
    private readonly LOG_SOURCE = 'WorkflowMapperService';
    private readonly DASHBOARD_LIST = [this.toolkitConfiguration.dashboardGuid, WorkflowState.DASHBOARD, WorkflowState.UNKNOWN];
    private readonly THANK_YOU_LIST = [this.toolkitConfiguration.lovedOneThankYouGuid, WorkflowState.THANK_YOU];
    private readonly INTERNATIONAL_PATIENTS_LIST = [
        this.toolkitConfiguration.internationalPatientsUrl,
        WorkflowState.INTERNATIONAL_PATIENTS
    ];

    constructor(
        private logger: LoggingService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public convert(activityResponse: ActivityResponse, currentActivityCode?: string): WorkflowAction {
        if (this.DASHBOARD_LIST.includes(activityResponse.next)) {
            return new UrlWorkflowAction(this.toolkitConfiguration.dashboardUrl);
        } else if (activityResponse.next === WorkflowState.PARTICIPANT_LIST) {
            return new UrlWorkflowAction(this.toolkitConfiguration.participantListUrl);
        } else if (currentActivityCode === 'FAMILY_HISTORY' && activityResponse.next === WorkflowState.THANK_YOU) {
            return new UrlWorkflowAction(this.toolkitConfiguration.familyHistoryThankYouUrl);
        } else if (this.THANK_YOU_LIST.includes(activityResponse.next)) {
            return new UrlWorkflowAction(this.toolkitConfiguration.lovedOneThankYouUrl);
        } else if (this.INTERNATIONAL_PATIENTS_LIST.includes(activityResponse.next)) {
            return new UrlWorkflowAction(this.toolkitConfiguration.internationalPatientsUrl);
        } else if (activityResponse.next === WorkflowState.DONE) {
            return new UrlWorkflowAction(this.toolkitConfiguration.doneUrl);
        } else if (activityResponse.next === WorkflowState.ACTIVITY) {
            return this.convertActivityState(activityResponse);
        } else if (activityResponse.next === WorkflowState.MAILING_LIST) {
            return new MailingListWorkflowAction();
        } else if (activityResponse.next === WorkflowState.REGISTRATION) {
            return new RegistrationWorkflowAction();
        } else {
            this.logger.logWarning(this.LOG_SOURCE, `Unknown server routing: ${JSON.stringify(activityResponse)}`);
        }
        return new UrlWorkflowAction('');
    }

    private convertActivityState(activityResponse: ActivityResponse): UrlWorkflowAction {
        switch (activityResponse.activityCode) {
            case this.toolkitConfiguration.aboutYouGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.aboutYouUrl);
            case this.toolkitConfiguration.aboutChildGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.aboutChildUrl);
            case this.toolkitConfiguration.aboutFamilyGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.aboutFamily);
            case this.toolkitConfiguration.consentGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.consentUrl);
            case this.toolkitConfiguration.consentAssentGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.consentAssentUrl);
            case this.toolkitConfiguration.parentalConsentGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.parentalConsentUrl);
            case this.toolkitConfiguration.releaseGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.releaseUrl);
            case this.toolkitConfiguration.releaseMinorGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.releaseMinorUrl);
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
            case this.toolkitConfiguration.lovedOneGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.lovedOneUrl);
            case this.toolkitConfiguration.covidSurveyGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.covidSurveyUrl);
            case this.toolkitConfiguration.addressGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.addressUrl);
            case this.toolkitConfiguration.symptomSurveyGuid:
                return new UrlWorkflowAction(this.toolkitConfiguration.symptomSurveyUrl);
            default:
                // If we have a next activity instance but no dedicated route, that's okay. Load it on-the-fly.
                return new UrlWorkflowAction(`${this.toolkitConfiguration.activityUrl}/${activityResponse.instanceGuid}`);
        }
    }
}
