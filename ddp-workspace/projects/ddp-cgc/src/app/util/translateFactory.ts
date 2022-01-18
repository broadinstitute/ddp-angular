import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LoggingService, LanguageService } from 'ddp-sdk';

export function translateFactory(
  translate: TranslateService,
  injector: Injector,
  logger: LoggingService,
  languageService: LanguageService,
): () => Promise<any> {
  return () =>
    new Promise<any>(resolve => {
      const LOG_SOURCE = 'TranslateFactory';
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();

        translate.setDefaultLang(locale);

        translate.use(locale).subscribe({
          next: () => {
            logger.logEvent(
              LOG_SOURCE,
              `Successfully initialized '${locale}' language as default.`,
            );
          },
          error: err => {
            logger.logError(
              LOG_SOURCE,
              `Problem with '${locale}' language initialization:`,
              err,
            );
          },
          complete: () => {
            resolve(null);
          }
        });
      });
    });
}
