import { Component, Input, OnInit } from '@angular/core';
import { ScriptLoaderService } from 'ddp-sdk';
import { take } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'toolkit-instagram-feed-lightswitch-plugin',
  template: `
  <iframe [src]="iframeSrc"
          allowtransparency="true"
          class="lightwidget-widget"
          style="width:100%; border:0; overflow:hidden;">
  </iframe>`
})
/**
 * Wrapper for Lightwidget Instagram feed component
 * @see {@link https://lightwidget.com/} for further information
 */
export class InstagramFeedLightwidgetPluginComponent implements OnInit {
  /**
   * This is the widget id that has been setup in the Lightwidget website. Defines what an how feed
   * is displayed
   */
  @Input() widgetId: string;
  public iframeSrc: SafeResourceUrl;

  constructor(
    private scriptLoader: ScriptLoaderService,
    private sanitizer: DomSanitizer) { }

  public ngOnInit(): void {
    if (!this.widgetId) {
      throw new TypeError('widgetId is required');
    }
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`//lightwidget.com/widgets/${this.widgetId}.html`);
    this.scriptLoader.load({
      name: 'instagram-feed-plugin',
      src: 'https://cdn.lightwidget.com/widgets/lightwidget.js'
    }).pipe(
      take(1)
    ).subscribe();
  }
}
