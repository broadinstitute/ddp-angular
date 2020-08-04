import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { BrowserContentService, CookiesManagementService, RenewSessionNotifier, UserProfileServiceAgent, WindowRef } from "ddp-sdk";
import { MatDialog } from "@angular/material";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { NoopScrollStrategy } from "@angular/cdk/overlay";
import {
  CommunicationService,
  SessionWillExpireComponent,
  ToolkitConfigurationService,
  WarningComponent
} from "toolkit";


@Component({
  selector: 'app-root',
  template: `
      <toolkit-warning-message *ngIf="unsupportedBrowser" class="warning-message"></toolkit-warning-message>
      <div class="MainContainer">
        <router-outlet></router-outlet>
      </div>
      <prion-footer></prion-footer>
      <ddp-cookies-banner *ngIf="showCookiesBanner" [logoSrc]="'/assets/images/project-logo-dark.svg'"></ddp-cookies-banner>
    `
})
export class PrionAppComponent implements OnInit, OnDestroy {
  public unsupportedBrowser: boolean;
  public showCookiesBanner: boolean;
  private anchor: Subscription = new Subscription();
  private readonly dialogBaseSettings = {
    width: '740px',
    position: { top: '30px' },
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy()
  };

  constructor(
    private translate: TranslateService,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private browserContent: BrowserContentService,
    private renewNotifier: RenewSessionNotifier,
    private windowRef: WindowRef,
    private userProfile: UserProfileServiceAgent,
    private cookiesManagementService: CookiesManagementService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.initBrowserWarningListener();
    this.initSessionWillExpireListener();
    this.initHasToSetCookiesPreferencesListener();
    this.initTranslate();
    this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public openWarningDialog(): void {
    this.dialog.open(WarningComponent, this.dialogBaseSettings);
  }

  public openSessionWillExpireDialog(): void {
    this.dialog.open(SessionWillExpireComponent, this.dialogBaseSettings);
  }

  public closeSessionWillExpireDialog(): void {
    this.dialog.closeAll();
  }

  private initBrowserWarningListener(): void {
    const modal = this.browserContent.events.subscribe(() => {
      this.openWarningDialog();
    });
    this.anchor.add(modal);
  }

  private initSessionWillExpireListener(): void {
    const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.openSessionWillExpireDialog();
    });
    const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.closeSessionWillExpireDialog();
    });
    this.anchor.add(modalOpen).add(modalClose);
  }

  private initHasToSetCookiesPreferencesListener(): void {
    const hasToSetCookiesPolicy =  this.cookiesManagementService.getHasToSetCookiesPreferences().subscribe(x => {
      this.showCookiesBanner = x;
    });
    this.anchor.add(hasToSetCookiesPolicy);
  }


  private initTranslate(): void {
    const session = localStorage.getItem('session_key');
    if (session != null) {
      const locale = JSON.parse(session).locale;
      this.translate.use(locale);
    }
  }
}
