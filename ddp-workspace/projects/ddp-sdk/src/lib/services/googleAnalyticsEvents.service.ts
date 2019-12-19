import { Injectable } from '@angular/core';

declare let ga: Function;

@Injectable()
export class GoogleAnalyticsEventsService {
  public emitCustomEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel: string | null = null,
    eventValue: string | null = null): void {
    const event = {
      hitType: 'event',
      eventCategory,
      // set page directly in order to exclude sensitive query params
      // and simpler aggregation of stats
      page: location.pathname,
      location: this.location,
      eventLabel: eventLabel == null ? eventAction : eventLabel,
      eventAction,
      eventValue
    };
    this.emitEvent(event);
  }

  public emitNavigationEvent(): void {
    const event = {
      hitType: 'pageview',
      // set page directly in order to exclude sensitive query params
      // and simpler aggregation of stats
      page: location.pathname,
      location: this.location
    };
    this.emitEvent(event);
  }

  private get location(): string {
    return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ``}${location.pathname}`;
  }

  private emitEvent(event: object): void {
    ga('send', event);
    ga('platform.send', event);
  }
}
