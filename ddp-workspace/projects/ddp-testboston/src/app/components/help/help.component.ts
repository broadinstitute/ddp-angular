import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService, NGXTranslateService } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { Subscription, merge, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public video: SafeResourceUrl;
  private anchor: Subscription;

  constructor(
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    private translate: NGXTranslateService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
    this.languageListener();
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  private languageListener(): void {
    this.anchor = merge(
      of(null),
      this.languageService.onLanguageChange()
    ).pipe(
      switchMap(() => this.translate.getTranslation('Help.Collect.Video'))
    ).subscribe(url => {
      this.video = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
}
