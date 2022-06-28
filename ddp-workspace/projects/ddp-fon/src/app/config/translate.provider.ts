import { APP_INITIALIZER, Injector, Provider } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { LoggingService, LanguageService } from 'ddp-sdk';

export function translateFactory(
  translate: TranslateService,
  injector: Injector,
  logger: LoggingService,
  language: LanguageService,
): () => Promise<any> {
  return () =>
    new Promise<any>((resolve: any) => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

      locationInitialized.then(() => {
        const locale = language.getAppLanguageCode();

        translate.setDefaultLang(locale);

        translate.use(locale).subscribe({
          next: () => {
            logger.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
          },
          error: err => {
            logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
          },
          complete: () => {
            resolve(null);
          },
        });
      });
    });
}

export const translateProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: translateFactory,
  deps: [TranslateService, Injector, LoggingService, LanguageService],
  multi: true,
};
