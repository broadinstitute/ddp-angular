import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AnalyticsEvent } from '../models/analyticsEvent';

declare const DDP_ENV: any;
declare const ga: Function;

@Injectable()
export class AnalyticsEventsService {
  private events = new Subject<AnalyticsEvent>();

  public emitCustomEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel: string | null = null,
    eventValue: string | null = null): void {
    const event: AnalyticsEvent = {
      hitType: 'event',
      // set page directly in order to exclude sensitive query params
      // and simpler aggregation of stats
      page: location.pathname,
      location: this.location,
      eventCategory,
      eventAction,
      eventLabel: eventLabel === null ? eventAction : eventLabel,
      eventValue
    };
    this.events.next(event);
  }

  public emitNavigationEvent(): void {
    const event: AnalyticsEvent = {
      hitType: 'pageview',
      // set page directly in order to exclude sensitive query params
      // and simpler aggregation of stats
      page: location.pathname,
      location: this.location
    };
    this.events.next(event);
  }

  public get analyticEvents(): Observable<AnalyticsEvent> {
    return this.events.asObservable();
  }

  private get location(): string {
    return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ``}${location.pathname}`;
  }

  public startGATracking(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = false;
    ga('create', DDP_ENV.projectGAToken, 'auto');
    ga('create', DDP_ENV.platformGAToken, 'auto', 'platform');
  }

  public doNotTrackGA(): void {
    window['ga-disable-' + DDP_ENV.platformGAToken] = true;
  }

  public startTCellTracking(): void {
    const tcellScript = document.createElement('script');
    tcellScript.setAttribute('src', 'https://us.jsagent.tcell.insight.rapid7.com/tcellagent.min.js');
    tcellScript.setAttribute('tcellbaseurl', DDP_ENV.tcellbaseurl);
    tcellScript.setAttribute('tcellappid', DDP_ENV.tcellappid);
    tcellScript.setAttribute('tcellapikey', DDP_ENV.tcellapikey);
    tcellScript.async = true;
    document.body.appendChild(tcellScript);
  }
}
