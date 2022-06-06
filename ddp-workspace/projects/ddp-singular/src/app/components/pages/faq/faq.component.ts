import { Component } from '@angular/core';
import { AnalyticsEventsService } from 'ddp-sdk';

import { GTagEvent } from '../../../constants/gtag-event';
import { IGNORE_ANALYTICS_CLASS } from '../../../constants/analytics';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  readonly IGNORE_ANALYTICS_CLASS = IGNORE_ANALYTICS_CLASS;
  readonly VIDEO_URL = 'https://youtu.be/LXJlqotrZNw';

  constructor(private analytics: AnalyticsEventsService){}

  public videoClick(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.VIDEO_CLICK, link.textContent, this.VIDEO_URL);
  }
}
