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

  public scrollToStep(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    if (element.className.includes('scrollable')) {
      const anchor = `anchor-${element.classList[element.classList.length - 1]}`;
      const step = document.getElementsByClassName(anchor)[0];
      if (step) {
        const HEADER_HEIGHT_REM = 7.5;
        const headerHeightPx = HEADER_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const top = step.getBoundingClientRect().top + window.scrollY - headerHeightPx;
        window.scrollTo({
          top,
          behavior: 'smooth'
        });
      }
    }
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
