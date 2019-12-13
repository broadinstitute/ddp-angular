import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CommunicationService {
  private openSidePanelSubject: Subject<void> = new Subject<void>();
  private closeSidePanelSubject: Subject<void> = new Subject<void>();
  private openJoinDialogSubject: Subject<void> = new Subject<void>();
  public openSidePanel$: Observable<void> = this.openSidePanelSubject.asObservable();
  public closeSidePanel$: Observable<void> = this.closeSidePanelSubject.asObservable();
  public openJoinDialog$: Observable<void> = this.openJoinDialogSubject.asObservable();

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
