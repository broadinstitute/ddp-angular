import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionWillExpireComponent } from 'toolkit';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';

@Component({
  selector: 'app-session-expired-dialog',
  templateUrl: './session-expired-dialog.component.html',
  styleUrls: ['./session-expired-dialog.component.scss'],
})
export class SessionExpiredDialogComponent implements OnInit {
  private anchor: CompositeDisposable = new CompositeDisposable();

  constructor(private readonly dialog: MatDialog, private readonly renewNotifier: RenewSessionNotifier) {}

  ngOnInit(): void {
    this.initSessionWillExpireListener();
  }

  private initSessionWillExpireListener(): void {
    const modalOpen: Subscription = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, {
        width: '740px',
        position: { top: '30px' },
        data: {
          showClearButton: false,
        },
        autoFocus: false,
        panelClass: 'session-expire-dialog',
        scrollStrategy: new NoopScrollStrategy(),
      });
    });

    const modalClose: Subscription = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });

    this.anchor.addNew(modalOpen).addNew(modalClose);
  }
}
