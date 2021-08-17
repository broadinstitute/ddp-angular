import { Provider } from '@angular/core';

import { ToolkitConfigurationService } from 'toolkit';

import { Route } from '../constants/Route';

declare const DDP_ENV: any;

const toolkitConfig: ToolkitConfigurationService = new ToolkitConfigurationService();

toolkitConfig.errorUrl = Route.Error;
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;
toolkitConfig.dashboardUrl = Route.Dashboard;
toolkitConfig.activityUrl = Route.Activity;

export const toolkitConfigProvider: Provider = {
  provide: 'toolkit.toolkitConfig',
  useValue: toolkitConfig,
};
