import { Component, ViewChild, ElementRef, Input, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { ScriptLoaderService } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
  selector: 'toolkit-twitter-timeline-widget',
  template: `<div #twitter></div>`
})
export class TwitterTimelineWidgetComponent implements OnInit {
  @Input() private twitterAccountId = this.toolkitConfiguration.twitterAccountId;
  @Input() private widgetHeight = 600;
  @ViewChild('twitter', { static: true }) private twitter: ElementRef;

  constructor(
    private scriptLoader: ScriptLoaderService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.scriptLoader.load({
      name: 'twitter-widget',
      src: 'https://platform.twitter.com/widgets.js'
    }).pipe(
      take(1)
    ).subscribe(() => {
      this.createTimelineWidget();
    });
  }

  private createTimelineWidget(): void {
    window.twttr.widgets.createTimeline(
      {
        sourceType: 'profile',
        screenName: this.twitterAccountId
      },
      this.twitter.nativeElement,
      {
        height: this.widgetHeight,
        chrome: 'noscrollbar, noheader, nofooter',
        limit: 20
      }
    );
  }
}
