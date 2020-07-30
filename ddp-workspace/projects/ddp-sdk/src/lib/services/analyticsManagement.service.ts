import { Injectable } from '@angular/core';

declare const DDP_ENV: any;
declare const ga: Function;

@Injectable()
export class AnalyticsManagementService {
  public trackAnalytics(): void {
    this.startGATracking();
  }

  public doNotTrackAnalytics(): void {
    this.doNotTrackGA();
  }

  private doNotTrackGA(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = true;
  }

  private startGATracking(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = false;
    ga(() => {
      // @ts-ignore, create trackers if non created
      if (!ga.getAll().length) {
        ga('create', DDP_ENV.projectGAToken, 'auto');
        ga('create', DDP_ENV.platformGAToken, 'auto', 'platform');
      }
    });
  }
}
