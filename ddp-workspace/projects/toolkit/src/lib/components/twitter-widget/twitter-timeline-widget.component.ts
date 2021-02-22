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

  private readonly observer = new IntersectionObserver(
    this.onIntersectionChanged.bind(this),
    {
      rootMargin: '0px',
      threshold: 0
    }
  );

  constructor(
    private root: ElementRef,
    private scriptLoader: ScriptLoaderService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.observer.observe(this.root.nativeElement);
  }

  private loadScript(): void {
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

  private onIntersectionChanged(entries: IntersectionObserverEntry[]): void {
    if (!entries.length) {
      console.warn('No entries found!');
      return;
    }
    if (entries[0].isIntersecting) {
      this.observer.disconnect();
      this.loadScript();
    }
  }
}
