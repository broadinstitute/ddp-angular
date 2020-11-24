import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PopupMessage } from '../models/popupMessage';
import { CommunicationService } from 'toolkit';

@Injectable()
export class AtcpCommunicationService extends CommunicationService {
  private showPopupMessageSubject: Subject<PopupMessage> = new Subject<PopupMessage>();
  private closePopupMessageSubject: Subject<void> = new Subject<void>();
  public showPopupMessage$: Observable<PopupMessage> = this.showPopupMessageSubject.asObservable();
  public closePopupMessage$: Observable<void> = this.closePopupMessageSubject.asObservable();

constructor() {
  super();
}
  public showPopupMessage(message: PopupMessage): void {
    this.showPopupMessageSubject.next(message);
  }

  public closePopupMessage(): void {
    this.closePopupMessageSubject.next();
  }
}
