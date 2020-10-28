import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, HostListener, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CompositeDisposable, RenewSessionNotifier, SessionMementoService } from 'ddp-sdk';
import { JoinMailingListComponent, SessionWillExpireComponent } from 'toolkit';
import * as RouterResource from '../../router-resources';
import { PopupMessageComponent } from '../../toolkit/dialogs/popupMessage.component';
import { AtcpCommunicationService } from '../../toolkit/services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private anchor = new CompositeDisposable();
  public isWelcomePage = false;
  public isBasePage = false;
  public isDevMode: boolean = isDevMode();

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
    private communicationService: AtcpCommunicationService,
    private dialog: MatDialog,
    private renewNotifier: RenewSessionNotifier,
    private session: SessionMementoService,
  ) { }

  public ngOnInit(): void {
    this.anchor.addNew(this.router.events.subscribe(() => {
      this.isWelcomePage = this.router.url === '/';
      this.isBasePage = this.baseUrls.includes(this.router.url.substr(1).split('?')[0]);
    }));
    this.mailingListDialogListener();
    this.sessionExpiredDialogListener();
    this.subscribeToPopupMessages();
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

  private subscribeToPopupMessages(): void {
    const modalOpen = this.communicationService.showPopupMessage$.subscribe(textFromServer => {
      this.dialog.open(PopupMessageComponent, {
        id: 'ServerMessage',
        width: '100%',
        position: { top: '0px' },
        data: {
          text: textFromServer.text
        },
        autoFocus: false,
        scrollStrategy: new NoopScrollStrategy(),
        panelClass: textFromServer.isError ? 'server-error-modal-box' : 'server-modal-box'
      });
    });
    const modalClose = this.communicationService.closePopupMessage$.subscribe(() => {
      this.dialog.getDialogById('ServerMessage').close();
    });
    this.anchor.addNew(modalOpen).addNew(modalClose);
  }

  @HostListener('window:beforeunload')
  private beforeUnload(): void {
    this.session.setParticipant(null);
  }
}
