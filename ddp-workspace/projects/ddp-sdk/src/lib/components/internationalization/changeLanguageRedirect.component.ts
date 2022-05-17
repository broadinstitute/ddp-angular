import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, zip } from 'rxjs';
import { catchError, finalize, map, take, tap } from 'rxjs/operators';

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
  private readonly LOG_SOURCE = 'ChangeLanguageRedirectComponent';

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
    const queryParams$: Observable<any> = this.route.queryParamMap.pipe(
      map((queryParams) => ({
        language: queryParams.get(LANGUAGE_QUERY_PARAM),
        destination: queryParams.get(DESTINATION_QUERY_PARAM)
      })),
      tap(({language, destination}) => {
        if (!language) {
          this.logger.logError(this.LOG_SOURCE, 'Missing language query parameter!');
        }
        if (!destination) {
          this.logger.logError(this.LOG_SOURCE, 'Missing destination query parameter!');
        }
      })
    );

    // Get the study's configured languages codes and store for later
    const supportedLanguagesCodes$: Observable<string[]> = this.languageServiceAgent.getConfiguredLanguages(this.config.studyGuid)
      .pipe(
        map((supportedLanguages: StudyLanguage[]) => supportedLanguages.map(lang => lang.languageCode))
      );

    let destinationFromQuery: string;

    // Attempt to change language and redirect
    zip(queryParams$, supportedLanguagesCodes$).pipe(
      tap(([queryParams, supportedLanguagesCodes]) => {
        // Add the configured languages
        this.languageService.addLanguages(supportedLanguagesCodes);
      }),
      switchMap(([{language, destination}, supportedLanguagesCodes]) => {
        destinationFromQuery = destination;
        return this.languageService.changeLanguageObservable(language).pipe(
          catchError(err => {
            throw new Error(`Could not change language to ${language}: ` + JSON.stringify(err));
          })
        );
      }),
      take(1),
      finalize(() => {
        // Do the redirect
        this.router.navigate([destinationFromQuery], {relativeTo: this.route.root});
      })
    ).subscribe({
      next: () => {
        this.logger.logEvent(this.LOG_SOURCE, `Changed language to ${this.languageService.getCurrentLanguage()}`);
      },
      error: err => {
        this.logger.logError(this.LOG_SOURCE, err);
      }
    });
  }
}
