import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CompositeDisposable, RenewSessionNotifier } from 'ddp-sdk';
import {CommunicationService, JoinMailingListComponent, SessionWillExpireComponent, WarningComponent} from 'toolkit';
import { Router } from '@angular/router';
import * as RouterResource from '../../router-resources';
import {ServerMessageComponent} from "../../../../../toolkit/src/lib/components/dialogs/serverMessage.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
    this.subscribeToMessagesFromServer();
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

  private subscribeToMessagesFromServer(): void {
    const modalOpen = this.communicationService.showMessageFromServer$.subscribe(textFromServer => {
      this.dialog.open(ServerMessageComponent, {
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
    const modalClose = this.communicationService.closeMessageFromServer$.subscribe(() => {
      this.dialog.getDialogById('ServerMessage').close();
    });
    this.anchor.addNew(modalOpen).addNew(modalClose);
  }
}
