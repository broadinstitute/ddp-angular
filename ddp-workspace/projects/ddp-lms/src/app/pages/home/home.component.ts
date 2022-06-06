import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AnalyticsEventCategories, AnalyticsEventsService} from 'ddp-sdk';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  @Input() isColorectal: boolean;
  readonly twitterUrl: string;
  readonly facebookUrl: string;
  readonly instagramUrl: string;

  constructor(
    private dialog: MatDialog,
    private analytics: AnalyticsEventsService,
  ) {
    this.twitterUrl = `https://twitter.com/count_me_in`;
    this.facebookUrl = `https://www.facebook.com/joincountmein`;
    this.instagramUrl = `https://www.instagram.com/countmein`;
  }

  public sendSocialMediaAnalytics(event: string): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
  }
}
