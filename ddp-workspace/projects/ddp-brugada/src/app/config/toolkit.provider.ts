import { Provider } from '@angular/core';
import { Route } from '../constants/Route';
import { ToolkitConfigurationService } from 'toolkit';


declare const DDP_ENV: any;

const toolkitConfig: ToolkitConfigurationService = new ToolkitConfigurationService();
toolkitConfig.errorUrl = Route.Error;
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;

export const toolkitConfigProvider: Provider = {
  provide: 'toolkit.toolkitConfig',
  useValue: toolkitConfig,
};
