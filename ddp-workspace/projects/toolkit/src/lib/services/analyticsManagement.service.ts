import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

declare const DDP_ENV: any;
declare const ga: Function;

@Injectable()
export class AnalyticsManagementService {

  constructor(private cookie: CookieService) {
  }

  public trackAnalytics(): void {
    this.startGATracking();
  }

  public doNotTrackAnalytics(): void {
    this.doNotTrackGA();
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
  }
}
