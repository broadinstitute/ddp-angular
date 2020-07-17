import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {ServerMessage} from "../models/serverMessage";

@Injectable()
export class CommunicationService {
  private openSidePanelSubject: Subject<void> = new Subject<void>();
  private closeSidePanelSubject: Subject<void> = new Subject<void>();
  private openJoinDialogSubject: Subject<void> = new Subject<void>();
  private showMessageFromServerSubject: Subject<ServerMessage> = new Subject<ServerMessage>();
  private closeMessageFromServerSubject: Subject<void> = new Subject<void>();
  public openSidePanel$: Observable<void> = this.openSidePanelSubject.asObservable();
  public closeSidePanel$: Observable<void> = this.closeSidePanelSubject.asObservable();
  public openJoinDialog$: Observable<void> = this.openJoinDialogSubject.asObservable();
  public showMessageFromServer$: Observable<ServerMessage> = this.showMessageFromServerSubject.asObservable();
  public closeMessageFromServer$: Observable<void> = this.closeMessageFromServerSubject.asObservable();

  public openSidePanel(): void {
    this.openSidePanelSubject.next();
  }

  public closeSidePanel(): void {
    this.closeSidePanelSubject.next();
  }

  public openJoinDialog(): void {
    this.openJoinDialogSubject.next();
  }
  public showMessageFromServer(message: ServerMessage): void {
    this.showMessageFromServerSubject.next(message);
  }

  public closeMessageFromServer(): void {
    this.closeMessageFromServerSubject.next();
  }
}
