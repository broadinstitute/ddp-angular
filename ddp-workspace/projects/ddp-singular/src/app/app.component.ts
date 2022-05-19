import { Component, ElementRef, HostListener } from '@angular/core';
import { AnalyticsEventsService } from 'ddp-sdk';

import { GTagEvent } from './constants/gtag-event';
import { Route } from './constants/route';
import { IGNORE_ANALYTICS_CLASS } from './constants/analytics';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ddp-singular';

  constructor(
    private elRef: ElementRef,
    private analytics: AnalyticsEventsService
  ) {}

  onActivate(): void {
    this.elRef.nativeElement.scrollTo(0,0);
  }

  // based on https://plausible.io/blog/track-outbound-link-clicks#:~:text=%3C-,script,-%3E%0A%20%20document
  @HostListener('document:click', ['$event'])
  monitorOutboundLinks(event: Event): void {
    const link = this.findNearestAnchorElement(event.target);

    // stop if it's the same origin navigation
    if (this.shouldNotSendAnalytics(link)) {
      return;
    }

    this.analytics.emitCustomGtagEvent(GTagEvent.OUTBOUND_LINK_CLICK, link.innerText, link.href);

    // Allow event to be sent before the page is unloaded, if we're navigating in the same page
    if (!link.target || link.target.match(/^_(self|parent|top)$/i)) {
      setTimeout(function() { location.href = link.href; }, 100);
      event.preventDefault();
    }
  }

  private shouldNotSendAnalytics(link: HTMLAnchorElement): boolean {
    return !link || !link.href || !link.host || link.host === location.host || link.classList.contains(IGNORE_ANALYTICS_CLASS);
  }

  @HostListener('window:beforeunload')
  beforeUnload(): void {
    if (window.location.pathname.endsWith(Route.PreScreening)) {
      this.analytics.emitCustomGtagEvent(GTagEvent.SURVEY_CLOSE);
    }
  }

  private findNearestAnchorElement(target: EventTarget): HTMLAnchorElement {
    let link = target as HTMLAnchorElement;

    while (link && (!link.href || typeof link.tagName === 'undefined' || link.tagName.toLowerCase() !== 'a')) {
      link = link.parentNode as HTMLAnchorElement;
    }

    return link;
  }
}
