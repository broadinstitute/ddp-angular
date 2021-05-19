import { Inject, Injectable } from '@angular/core';
import { DESTINATION_QUERY_PARAM, LANGUAGE_QUERY_PARAM } from 'ddp-sdk';
import { MbcConfigurationService } from './mbcConfiguration.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageHostRedirector  {
  constructor(@Inject('ddp.config') private mbcConfig: MbcConfigurationService) {
      const matchingHostName = mbcConfig.languageHostNames.find(each => each.hostName === window.location.hostname);
      if (matchingHostName) {
        this.redirectToBaseHostName(matchingHostName.languageCode);
      }
  }

  private redirectToBaseHostName(languageCode: string): void {
    const location = window.location;
    const baseUrlString = `${location.protocol}//${this.mbcConfig.baseHostName}${location.port ? ':' + location.port : ''}`;
    const redirectUrl = new URL(baseUrlString);
    redirectUrl.pathname = '/change-language-redirect';
    redirectUrl.searchParams.append(LANGUAGE_QUERY_PARAM, languageCode);
    redirectUrl.searchParams.append(DESTINATION_QUERY_PARAM, '/');
    location.href = redirectUrl.href;
  }
}
