import { Injectable } from '@angular/core';

declare const DDP_ENV: any;
declare const ga: Function;

@Injectable()
export class AnalyticsManagementService {
  public trackAnalytics(): void {
    this.startGATracking();
    this.startTCellTracking();
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

  private startTCellTracking(): void {
    if (document.getElementById('tcell')) {
      return;
    }
    const tcellScript = document.createElement('script');
    tcellScript.setAttribute('src', 'https://us.jsagent.tcell.insight.rapid7.com/tcellagent.min.js');
    tcellScript.setAttribute('id', 'tcell');
    tcellScript.setAttribute('tcellbaseurl', DDP_ENV.tcellbaseurl);
    tcellScript.setAttribute('tcellappid', DDP_ENV.tcellappid);
    tcellScript.setAttribute('tcellapikey', DDP_ENV.tcellapikey);
    tcellScript.async = true;
    document.body.appendChild(tcellScript);
  }
}
