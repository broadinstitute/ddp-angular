import { Inject, Injectable } from '@angular/core';
import { DESTINATION_QUERY_PARAM, LANGUAGE_QUERY_PARAM } from 'ddp-sdk';
import { osteoConfigurationService } from './osteoConfiguration.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Service meant to be used from app initializer to redirect from a hostname that is meant to be in a particular language,
 * e.g., MyStudyInSpanish.org , to the "real" host, making sure after redirection that the proper language is selected
 * Note that we leverage existing ChangeLanguageRedirectComponent
 */
export class LanguageHostRedirector  {
  constructor(@Inject('ddp.config') private osConfig: osteoConfigurationService) {
      const matchingHostName = osConfig.languageHostNames.find(each => each.hostName === window.location.hostname);
      if (matchingHostName) {
        this.redirectToBaseHostName(matchingHostName.languageCode);
      }
  }

  private redirectToBaseHostName(languageCode: string): void {
    const location = window.location;
    const baseUrlString = `${location.protocol}//${this.osConfig.baseHostName}${location.port ? ':' + location.port : ''}`;
    const redirectUrl = new URL(baseUrlString);
    redirectUrl.pathname = '/change-language-redirect';
    redirectUrl.searchParams.append(LANGUAGE_QUERY_PARAM, languageCode);
    redirectUrl.searchParams.append(DESTINATION_QUERY_PARAM, '/');
    location.href = redirectUrl.href;
  }
}
