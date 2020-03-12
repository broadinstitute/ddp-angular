import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier, AnalyticsEventsService, AnalyticsEvent } from 'ddp-sdk';
import { CommunicationService, JoinMailingListComponent, SessionWillExpireComponent } from 'toolkit';

declare const ga: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private anchor = new CompositeDisposable();
  private readonly DIALOG_BASE_SETTINGS = {
    width: '740px',
    position: { top: '30px' },
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy()
  };

  constructor(
    private analytics: AnalyticsEventsService,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private renewNotifier: RenewSessionNotifier) { }

  public ngOnInit(): void {
    this.initMailingListDialogListener();
    this.initSessionExpiredDialogListener();
    this.initAnalyticsListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  private initMailingListDialogListener(): void {
    const modalOpen = this.communicationService.openJoinDialog$.subscribe(() => {
      this.dialog.open(JoinMailingListComponent, this.DIALOG_BASE_SETTINGS);
    });
    this.anchor.addNew(modalOpen);
  }

  private initSessionExpiredDialogListener(): void {
    const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, this.DIALOG_BASE_SETTINGS);
    });
    const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });
    this.anchor.addNew(modalOpen).addNew(modalClose);
  }

  private initAnalyticsListener(): void {
    const events = this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
    this.anchor.addNew(events);
  }
}
