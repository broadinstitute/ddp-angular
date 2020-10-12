import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';
import { SessionWillExpireComponent } from 'toolkit';

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
    private dialog: MatDialog,
    private renewNotifier: RenewSessionNotifier) { }

  public ngOnInit(): void {
    this.initSessionExpiredDialogListener();
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
}
