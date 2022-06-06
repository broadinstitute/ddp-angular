import {Component, Inject, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AnalyticsEventCategories, AnalyticsEventsService} from 'ddp-sdk';
import {CommunicationService, ToolkitConfigurationService} from "toolkit";
import { Route } from '../../constants/Route'


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
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
    private communicationService: CommunicationService,
  ) {
    this.twitterUrl = `https://twitter.com/${this.toolkitConfiguration.twitterAccountId}`;
    this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
    this.instagramUrl = `https://www.instagram.com/${this.toolkitConfiguration.instagramId}`;
  }

  public sendSocialMediaAnalytics(event: string): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
  }

  readonly Route = Route;

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }
}
