import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AnalyticsEvent } from '../models/analyticsEvent';
import { GTagEvent } from '../models/gtagEvent';
import { filter } from 'rxjs/operators';
import { GoogleAnalyticsEvent, isAnalyticsEvent, isGtagEvent } from '../models/googleAnalyticsEvent';


@Injectable()
export class AnalyticsEventsService {

  private events = new Subject<GoogleAnalyticsEvent>();

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
    this.events.next(this.buildGTagEvent(eventCategory, eventAction));
  }

  public emitCustomGtagEvent(eventName: string, clickText?: string, clickUrl?: string): void {
    const newEvent = this.buildGTagEvent(eventName, clickText, clickUrl);
    this.events.next(newEvent);
    return;
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
    // this is a gtag "recommended event" https://developers.google.com/tag-platform/gtagjs/reference/events#page_view
    this.events.next(this.buildGTagEvent('page_view'));
  }

  public get analyticEvents(): Observable<AnalyticsEvent> {
    return this.events.pipe(filter(anEvent => isAnalyticsEvent(anEvent))) as Observable<AnalyticsEvent>;
  }

  public get gTagEvents(): Observable<GTagEvent> {
    return this.events.pipe(filter(anEvent => isGtagEvent(anEvent))) as Observable<GTagEvent>;
  }

  private get location(): string {
    return `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ``}${location.pathname}`;
  }

  // Build gtag.js events that correspond to https://developers.google.com/tag-platform/gtagjs/reference#event
  // click_text and click_url are optional custom parameters
  private buildGTagEvent(eventName: string, clickText?: string, clickUrl?: string): GTagEvent {
    const newEvent: GTagEvent = {
      event_name: eventName,
      parameters: {
        page_location: this.location,
        click_text: clickText,
        click_url: clickUrl,
      }
    };
    return newEvent;
  }
}
