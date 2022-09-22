import { Provider } from '@angular/core';
import { Route } from '../constants/route';
import { ToolkitConfigurationService } from 'toolkit';


declare const DDP_ENV: any;

const toolkitConfig: ToolkitConfigurationService = new ToolkitConfigurationService();

toolkitConfig.errorUrl = Route.Error;
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.dashboardUrl = Route.Dashboard;
toolkitConfig.activityUrl = Route.Activity;
toolkitConfig.participantListUrl = Route.ParticipantList;
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;
toolkitConfig.recaptchaSiteClientKeyForAutoTests = DDP_ENV.recaptchaSiteClientKeyForAutoTests;

export const toolkitConfigProvider: Provider = {
  provide: 'toolkit.toolkitConfig',
  useValue: toolkitConfig,
};
