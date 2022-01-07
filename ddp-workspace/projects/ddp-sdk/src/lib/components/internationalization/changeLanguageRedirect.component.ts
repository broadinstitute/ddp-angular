import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StudyLanguage } from '../../models/studyLanguage';
import { ConfigurationService } from '../../services/configuration.service';
import { LanguageService } from '../../services/internationalization/languageService.service';
import { LanguageServiceAgent } from '../../services/serviceAgents/languageServiceAgent.service';
import { LoggingService } from '../../services/logging.service';

export const LANGUAGE_QUERY_PARAM = 'language';
export const DESTINATION_QUERY_PARAM = 'destination';

@Component({
  selector: 'ddp-change-language-redirect',
  template: `<ng-container></ng-container>`
})
export class ChangeLanguageRedirectComponent implements OnInit {
  private lang: string = null;
  private supportedLanguages: StudyLanguage[] = null;
  private readonly LOG_SOURCE = 'ChangeLanguageRedirectComponent';

  // The destination to redirect to, relative to the main site
  private dest: string = null;

  constructor(
    private languageService: LanguageService,
    private languageServiceAgent: LanguageServiceAgent,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggingService,
    @Inject('ddp.config') private config: ConfigurationService) {
  }

  public ngOnInit(): void {
    // Get the specified language and specified destination and store for later
    const queryParamPromise: Promise<void> = this.getQueryParamInfo();

    // Get the study's configured languages and store for later
    const supportedLanguagesPromise: Promise<void> = this.getSupportedLanguagesPromise();

    // Attempt to change language and redirect
    Promise.all([queryParamPromise, supportedLanguagesPromise])
      .then(() => {
        // Add the configured languages
        this.languageService.addLanguages(this.supportedLanguages.map(x => x.languageCode));

        // Try to switch to the specified language
        const langChangeObservable: Observable<any> = this.languageService.changeLanguageObservable(this.lang);
        langChangeObservable.subscribe({
          next: () => {
            this.logger.logEvent(this.LOG_SOURCE, `Changed language to ${this.languageService.getCurrentLanguage()}`);
          },
          error: (err) => {
            this.logger.logError(this.LOG_SOURCE, `Could not change language to ${this.lang}:`, err);
          },
          complete: () => {
            // Do the redirect
            this.router.navigate([this.dest], {relativeTo: this.route.root});
          }
        });
      });
  }

  private getSupportedLanguagesPromise(): Promise<void> {
    return this.getPromiseFromObservable(this.languageServiceAgent.getConfiguredLanguages(this.config.studyGuid),
      (languages => { this.supportedLanguages = languages; }));
  }

  private getQueryParamInfo(): Promise<void> {
    return this.getPromiseFromObservable(this.route.queryParamMap, (queryParams => {
      if (queryParams.has(LANGUAGE_QUERY_PARAM)) {
        this.lang = queryParams.get(LANGUAGE_QUERY_PARAM);
      } else {
        this.logger.logError(this.LOG_SOURCE, 'Missing language query parameter!');
      }

      if (queryParams.has(DESTINATION_QUERY_PARAM)) {
        this.dest = queryParams.get(DESTINATION_QUERY_PARAM);
      } else {
        this.logger.logError(this.LOG_SOURCE, 'Missing destination query parameter!');
      }
    }));
  }

  private getPromiseFromObservable(obs: Observable<any>, callback: (obsResult: any) => any): Promise<void> {
    // Return a promise that calls the provided callback with the first value returned from the observable
    return obs.pipe(take(1))
      .pipe(map(x => callback(x))).toPromise();
  }
}
