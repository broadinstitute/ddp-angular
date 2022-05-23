import { GTagEvent } from './gtagEvent';
import { AnalyticsEvent } from './analyticsEvent';

export type GoogleAnalyticsEvent = AnalyticsEvent | GTagEvent;

export function isGtagEvent(event: GoogleAnalyticsEvent): event is GTagEvent {
    return 'event_name' in event && 'parameters' in event;
}

export function isAnalyticsEvent(event: GoogleAnalyticsEvent): event is AnalyticsEvent {
    return 'hitType' in event;
}
