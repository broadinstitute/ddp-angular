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

export const toolkitConfigProvider: Provider = {
  provide: 'toolkit.toolkitConfig',
  useValue: toolkitConfig,
};
