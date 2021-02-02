import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PopupMessage } from '../models/popupMessage';
import { CommunicationService } from 'toolkit';

@Injectable()
export class AtcpCommunicationService extends CommunicationService {
  public showPopupMessage$: Observable<PopupMessage>;
  public closePopupMessage$: Observable<void>;
  private showPopupMessageSubject: Subject<PopupMessage> = new Subject<PopupMessage>();
  private closePopupMessageSubject: Subject<void> = new Subject<void>();

  constructor() {
    super();
    this.showPopupMessage$ = this.showPopupMessageSubject.asObservable();
    this.closePopupMessage$ = this.closePopupMessageSubject.asObservable();
  }

  public showPopupMessage(message: PopupMessage): void {
    this.showPopupMessageSubject.next(message);
  }

  public closePopupMessage(): void {
    this.closePopupMessageSubject.next();
  }
}
