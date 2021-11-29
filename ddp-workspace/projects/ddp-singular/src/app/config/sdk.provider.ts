import { Provider } from '@angular/core';
import { Route } from '../constants/route';
import { ConfigurationService } from 'ddp-sdk';

declare const DDP_ENV: { [key: string]: any };

const base: string = document.querySelector('base')?.getAttribute('href') || '';

const configurationService: ConfigurationService = new ConfigurationService();

configurationService.defaultLanguageCode = 'en';
configurationService.errorPageUrl = Route.Error;
configurationService.logLevel = DDP_ENV.logLevel;
configurationService.studyGuid = DDP_ENV.studyGuid;
configurationService.mapsApiKey = DDP_ENV.mapsApiKey;
configurationService.baseUrl = location.origin + base;
configurationService.passwordPageUrl = Route.Password;
configurationService.auth0Domain = DDP_ENV.auth0Domain;
configurationService.backendUrl = DDP_ENV.basePepperUrl;
configurationService.projectGcpId = DDP_ENV.projectGcpId;
configurationService.dashboardPageUrl = Route.Dashboard;
configurationService.auth0Audience = DDP_ENV.auth0Audience;
configurationService.auth0ClientId = DDP_ENV.auth0ClientId;
configurationService.projectGAToken = DDP_ENV.projectGAToken;
configurationService.loginLandingUrl = DDP_ENV.loginLandingUrl;
configurationService.tooltipIconUrl = 'assets/images/info.png';
configurationService.sessionExpiredUrl = Route.SessionExpired;
configurationService.doLocalRegistration = DDP_ENV.doLocalRegistration;
configurationService.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
configurationService.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
configurationService.auth0CodeRedirect = location.origin + base + 'auth';
configurationService.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
configurationService.localRegistrationUrl = configurationService.backendUrl + '/pepper/v1/register';
configurationService.mailAddressFormErrorFormatter = (formControlName, fieldLabel, error) => {
  if (formControlName === 'state') {
    return `SDK.MailAddress.FormError.${fieldLabel.toLowerCase()}.${error}`;
  }

  return `SDK.MailAddress.FormError.${formControlName}.${error}`;
};

export const SDKConfigProvider: Provider = {
  provide: 'ddp.config',
  useValue: configurationService,
};
