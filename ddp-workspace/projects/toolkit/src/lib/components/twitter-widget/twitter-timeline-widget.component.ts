import { Component, ViewChild, ElementRef, Input, Inject, OnInit } from '@angular/core';
import { LazyWidgetComponent } from '../lazy-widget/lazy-widget.component';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
// import { ScriptLoaderService } from 'ddp-sdk';
import {ScriptLoaderService} from "../../../../../ddp-sdk/src/lib/services/scriptLoader.service";
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'toolkit-twitter-timeline-widget',
  template: `<div #twitter></div>`
})
export class TwitterTimelineWidgetComponent extends LazyWidgetComponent implements OnInit {
  @Input() private twitterAccountId = this.toolkitConfiguration.twitterAccountId;
  @Input() private widgetHeight = 600;
  @ViewChild('twitter', { static: true }) private twitter: ElementRef;

  constructor(
    private scriptLoader: ScriptLoaderService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
    root: ElementRef) {
    super(root.nativeElement);
  }

  public ngOnInit(): void {
    const scriptLoading = this.scriptLoader.load({
      name: 'twitter-widget',
      src: 'https://platform.twitter.com/widgets.js'
    });

    this.isWidgetVisible
      .pipe(
        switchMap(() => scriptLoading),
        take(1),
      )
      .subscribe(() => this.createTimelineWidget());
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
