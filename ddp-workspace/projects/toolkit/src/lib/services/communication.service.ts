import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CommunicationService {
  public openSidePanel$: Observable<void>;
  public closeSidePanel$: Observable<void>;
  public openJoinDialog$: Observable<void>;
  private openSidePanelSubject: Subject<void> = new Subject<void>();
  private closeSidePanelSubject: Subject<void> = new Subject<void>();
  private openJoinDialogSubject: Subject<void> = new Subject<void>();

  constructor() {
    this.openSidePanel$ = this.openSidePanelSubject.asObservable();
    this.closeSidePanel$ = this.closeSidePanelSubject.asObservable();
    this.openJoinDialog$ = this.openJoinDialogSubject.asObservable();
  }

  public openSidePanel(): void {
    this.openSidePanelSubject.next();
  }

  public closeSidePanel(): void {
    this.closeSidePanelSubject.next();
  }

  public openJoinDialog(): void {
    this.openJoinDialogSubject.next();
  }
}
