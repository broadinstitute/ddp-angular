import { Component } from '@angular/core';
import { AnalyticsEventsService } from 'ddp-sdk';

import { GTagEvent } from '../../../constants/gtag-event';

@Component({
  selector: 'app-for-researches',
  templateUrl: './for-researches.component.html',
  styleUrls: ['./for-researches.component.scss']
})
export class ForResearchesComponent {
  readonly TERRA_BIO_URL = 'https://terra.bio/';

  constructor(private analytics: AnalyticsEventsService){}

  public applyHere(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.APPLY_HERE_CLICK, link.innerText, link.href);
  }
}
