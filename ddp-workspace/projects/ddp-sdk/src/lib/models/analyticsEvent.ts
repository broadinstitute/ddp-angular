export interface AnalyticsEvent {
    hitType: string;
    page: string;
    location: string;
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string | null;
    eventValue?: string | null;
}
