import { Component } from '@angular/core';
import { SessionMementoService, AnalyticsEventsService } from 'ddp-sdk';

import { Route } from '../../constants/route';
import { GTagEvent } from '../../constants/gtag-event';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  Route = Route;
  readonly STUDY_PROGRESS_URL = 'https://www.additionalventures.org/initiatives/biomedical-research/foundational-resources/project-singular/';
  readonly CURRENT_YEAR = new Date().getFullYear();

  constructor(
    private readonly sessionService: SessionMementoService,
    private readonly analytics: AnalyticsEventsService
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  signIn(): void {
    this.analytics.emitCustomGtagEvent(GTagEvent.LOG_IN_CLICK);
  }

  signUp(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.SIGN_UP_CLICK, link.innerText, link.href);
  }

  goToTwitter(event: Event): void {
    this.goToSocial(GTagEvent.TWITTER_OUTBOUND_CLICK, event.currentTarget);
  }

  goToFacebook(event: Event): void {
    this.goToSocial(GTagEvent.FACEBOOK_OUTBOUND_CLICK, event.currentTarget);
  }

  goToInstagram(event: Event): void {
    this.goToSocial(GTagEvent.INSTAGRAM_OUTBOUND_CLICK, event.currentTarget);
  }

  goToSocial(event: GTagEvent, link: EventTarget): void {
    this.analytics.emitCustomGtagEvent(event, (link as HTMLAnchorElement).innerText, (link as HTMLAnchorElement).href);
  }
}
