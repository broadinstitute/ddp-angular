import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AnalyticsEventsService, ConfigurationService } from 'ddp-sdk';
import { GTagEvent } from './constants/gtag-event';
import { Route } from './constants/route';
import { IGNORE_ANALYTICS_CLASS } from './constants/analytics';
import { FeatureFlagsToggleComponent } from './components/feature-flags-toggle/feature-flags-toggle.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ddp-singular';
  isProdMode: boolean;

  constructor(
    private elRef: ElementRef,
    private analytics: AnalyticsEventsService,
    private dialog: MatDialog,
    @Inject('ddp.config') private config: ConfigurationService
  ) {
    this.isProdMode = this.config.logLevel.toString() === '2';
  }

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

  // Opens a dialog by 'Ctrl+Alt+Home' to setup/toggle feature flags
  // it is used for feature flags testing only.
  // should not be available on production
  @HostListener('window:keydown.control.alt.home', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isProdMode) {
      this.openFeatureFlagsSetupDialog();
    }
  }

  private findNearestAnchorElement(target: EventTarget): HTMLAnchorElement {
    let link = target as HTMLAnchorElement;

    while (link && (!link.href || typeof link.tagName === 'undefined' || link.tagName.toLowerCase() !== 'a')) {
      link = link.parentNode as HTMLAnchorElement;
    }

    return link;
  }

  private openFeatureFlagsSetupDialog(): void {
    this.dialog.closeAll();

    this.dialog.open(FeatureFlagsToggleComponent, {
      width: '95%',
      maxWidth: 'max-content',
      autoFocus: false,
    });
  }
}
