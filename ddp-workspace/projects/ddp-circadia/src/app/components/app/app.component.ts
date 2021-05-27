import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';

import { SessionWillExpireComponent } from '../session-will-expire/session-will-expire.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subs = new CompositeDisposable();
  private readonly MAT_DIALOG_CONFIG: MatDialogConfig = {
    maxWidth: '64rem',
    width: '100%',
    data: {},
    autoFocus: false,
    scrollStrategy: new NoopScrollStrategy(),
    disableClose: true,
  };

  constructor(
    private dialog: MatDialog,
    private renewSessionNotifier: RenewSessionNotifier,
  ) {}

  ngOnInit(): void {
    this.initSessionWillExpireListener();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  private initSessionWillExpireListener(): void {
    const modalOpen = this.renewSessionNotifier.openDialogEvents.subscribe(
      () => {
        this.dialog.open(SessionWillExpireComponent, this.MAT_DIALOG_CONFIG);
      },
    );

    const modalClose = this.renewSessionNotifier.closeDialogEvents.subscribe(
      () => {
        this.dialog.closeAll();
      },
    );

    this.subs.addNew(modalOpen).addNew(modalClose);
  }
}
