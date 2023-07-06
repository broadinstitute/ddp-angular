import { Injectable } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie';

declare const DDP_ENV: any;
declare const ga: (...args: any[]) => {};

/* eslint-disable @typescript-eslint/ban-ts-comment */
@Injectable()
export class AnalyticsManagementService {

  constructor(private cookie: CookieService) {
  }

  public trackAnalytics(): void {
    // we are no longer tracking with GA
    // this.startGATracking();
  }

  public doNotTrackAnalytics(): void {
    // we are no longer tracking with GA
    // this.doNotTrackGA();
  }

  private doNotTrackGA(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = true;
    window['ga-disable-' + DDP_ENV.projectGAToken] = true;
    this.removeTrackers();
    this.removeStoredCookies();
  }

  private startGATracking(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = false;
    window['ga-disable-' + DDP_ENV.projectGAToken] = false;

    ga(() => {
      // @ts-ignore, create trackers if non created
      if (!ga.getAll().length) {
        ga('create', DDP_ENV.projectGAToken, 'auto');
        ga('create', DDP_ENV.platformGAToken, 'auto', 'platform');
      }

      // @ts-ignore,
      const trackers = ga.getAll();
      trackers.forEach(x => {
        x.set('page');
        x.send('pageview');
      });
    });
  }

  private removeTrackers(): void {
    ga(() => {
      // @ts-ignore
      if (ga.getAll().length) {
        // @ts-ignore
        const trackers = ga.getAll();
        // @ts-ignore
        trackers.forEach(x => ga.remove(x.get('name')));
      }
    });
  }

  private removeStoredCookies(): void {
    this.cookie.remove('_ga');
    this.cookie.remove('_gid');
    this.cookie.remove('_gat');
    this.cookie.remove('_gat_platform');

    // Sometimes Google Analytics adds a '.' prefix to the domain
    const prefixedOptions: CookieOptions = {domain: '.' + document.location.hostname};
    this.cookie.remove('_ga', prefixedOptions);
    this.cookie.remove('_gid', prefixedOptions);
    this.cookie.remove('_gat', prefixedOptions);
    this.cookie.remove('_gat_platform', prefixedOptions);
  }
}
