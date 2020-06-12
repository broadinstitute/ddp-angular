import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';
import { CommunicationService, JoinMailingListComponent, SessionWillExpireComponent } from 'toolkit';
import { Router } from '@angular/router';
import * as RouterResource from '../../router-resources';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private anchor = new CompositeDisposable();
  public isWelcomePage: boolean = false;
  public isBasePage: boolean = false;

  private readonly DIALOG_BASE_SETTINGS = {
    width: '740px',
    position: { top: '30px' },
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy()
  };

  private baseUrls = [
    RouterResource.Auth,
    RouterResource.Error,
    RouterResource.Password,
    RouterResource.PasswordResetDone,
    RouterResource.SessionExpired
  ];

  constructor(
    private router: Router,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private renewNotifier: RenewSessionNotifier) { }

  public ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isWelcomePage = this.router.url === '/';
      this.isBasePage = this.baseUrls.includes(this.router.url.substr(1).split('?')[0]);
    });
    this.mailingListDialogListener();
    this.sessionExpiredDialogListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  private mailingListDialogListener(): void {
    const modalOpen = this.communicationService.openJoinDialog$.subscribe(() => {
      this.dialog.open(JoinMailingListComponent, this.DIALOG_BASE_SETTINGS);
    });
    this.anchor.addNew(modalOpen);
  }

  private sessionExpiredDialogListener(): void {
    const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, this.DIALOG_BASE_SETTINGS);
    });
    const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });
    this.anchor.addNew(modalOpen).addNew(modalClose);
  }
}
