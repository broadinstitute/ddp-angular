import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SessionWillExpireComponent } from 'toolkit';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private anchor = new CompositeDisposable();

  constructor(
    private dialog: MatDialog,
    private renewNotifier: RenewSessionNotifier
  ) { }

  public ngOnInit(): void {
    this.initSessionWillExpireListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  private initSessionWillExpireListener(): void {
    const modalOpen = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, {
        width: '740px',
        position: { top: '30px' },
        data: {},
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy()
      });
    });

    const modalClose = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });

    this.anchor.addNew(modalOpen).addNew(modalClose);
  }
}
