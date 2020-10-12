import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier, NGXTranslateService } from 'ddp-sdk';
import { SessionWillExpireComponent } from 'toolkit';
import { filter, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private anchor = new CompositeDisposable();
  private titles: Record<string, string> = {};
  private readonly DIALOG_BASE_SETTINGS = {
    width: '740px',
    position: { top: '30px' },
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy()
  };
  private readonly appRoutes = AppRoutes;
  private readonly ANCHOR = '/#';
  private readonly DEFAULT = 'DEFAULT';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private titleService: Title,
    private translate: NGXTranslateService,
    private renewNotifier: RenewSessionNotifier) { }

  public ngOnInit(): void {
    this.setupTitles();
    this.initSessionExpiredDialogListener();
    this.initTitlesListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  private initSessionExpiredDialogListener(): void {
    const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, { ...this.DIALOG_BASE_SETTINGS, disableClose: true });
    });
    const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });
    this.anchor.addNew(modalOpen).addNew(modalClose);
  }

  private initTitlesListener(): void {
    const router = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => this.getTranslationKey(event.url)),
      distinctUntilChanged(),
      switchMap(translationKey => this.translate.getTranslation(translationKey))
    ).subscribe(title => this.titleService.setTitle(title));
    this.anchor.addNew(router);
  }

  private getTranslationKey(url: string): string {
    if (url.startsWith(this.ANCHOR)) {
      return this.titles[this.ANCHOR];
    } else if (this.titles[url]) {
      return this.titles[url];
    } else {
      return this.titles[this.DEFAULT];
    }
  }

  private setupTitles(): void {
    this.titles[`/${this.appRoutes.UPS}`] = 'SDK.Title.UPS';
    this.titles[`/${this.appRoutes.Dashboard}`] = 'SDK.Title.Dashboard';
    this.titles['/'] = 'SDK.Title.Home';
    this.titles[this.ANCHOR] = 'SDK.Title.Home';
    this.titles[this.DEFAULT] = 'SDK.Title.Default';
  }
}
