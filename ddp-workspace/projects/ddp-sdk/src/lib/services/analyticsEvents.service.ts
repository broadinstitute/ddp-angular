import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AnalyticsEvent } from '../models/analyticsEvent';

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
}
