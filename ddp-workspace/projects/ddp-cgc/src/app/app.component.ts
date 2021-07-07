import { Subscription } from 'rxjs';
import { RouterUtil } from './util';
import { Route } from './constants/route';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionWillExpireComponent } from 'toolkit';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Mode } from './components/header/enums.ts/header-mode';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  Route = Route;
  title = 'ddp-cgc';

  private anchor: CompositeDisposable = new CompositeDisposable();

  constructor(
    private readonly dialog: MatDialog,
    private readonly renewNotifier: RenewSessionNotifier
  ) {}

  ngOnInit(): void {
    this.initSessionWillExpireListener();
  }

  getHeaderMode(): Mode {
    return RouterUtil.isRoute(Route.Home)
      ? Mode.OVERLAY
      : Mode.STANDARD;
  }

  private initSessionWillExpireListener(): void {
    const modalOpen: Subscription = this.renewNotifier.openDialogEvents.subscribe(() => {
      this.dialog.open(SessionWillExpireComponent, {
        width: '740px',
        position: { top: '30px' },
        data: {
          showClearButton: false
        },
        autoFocus: false,
        panelClass: 'session-expire-dialog',
        scrollStrategy: new NoopScrollStrategy()
      });
    });

    const modalClose: Subscription = this.renewNotifier.closeDialogEvents.subscribe(() => {
      this.dialog.closeAll();
    });

    this.anchor.addNew(modalOpen).addNew(modalClose);
  }
}
