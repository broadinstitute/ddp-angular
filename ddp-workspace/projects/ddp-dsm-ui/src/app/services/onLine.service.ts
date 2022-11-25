import {Injectable, OnDestroy} from "@angular/core";
import {fromEvent, merge, Observable, of, Subject, Subscription, tap} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
import {MatSnackBar, MatSnackBarConfig, MatSnackBarRef} from "@angular/material/snack-bar";
import {OnLineSnackbarComponent} from "../Shared/components/onLine-snackbar/onLine-snackbar.component";
import {OnLineSnackbarMessages, IOnLineSnackbarModel} from "../Shared/interfaces/snackbars/IOnLineSnackbarModel";


@Injectable({providedIn: 'root'})
export class OnLineService implements OnDestroy {
  public isOnline: boolean = navigator.onLine;

  private onAndOfflineEventsSubject$: Subject<void> = new Subject<void>();
  private activeSnackbar: MatSnackBarRef<OnLineSnackbarComponent>;
  private activeSnackbarDismissalSubscription$: Subscription;

  constructor(private _snackBar: MatSnackBar) {
    !navigator.onLine && this.openOfflineSnackbar();

    this.onAndOfflineEvents
      .pipe(
        map(() => navigator.onLine),
        takeUntil(this.onAndOfflineEventsSubject$)
      )
      .subscribe({next: this.dealWithSnackbar.bind(this)})
  }

  ngOnDestroy() {
    this.onAndOfflineEventsSubject$.next();
    this.onAndOfflineEventsSubject$.complete();
  }

  public openOfflineRequestSnackbar() {
    this.activeSnackbarDismissalSubscription$ &&
      this.activeSnackbarDismissalSubscription$.unsubscribe();

    this.activeSnackbar = this.openSnackbar(OnLineSnackbarMessages.OFFLINE_REQUEST, 3000);

    this.activeSnackbarDismissalSubscription$ = this.activeSnackbar.afterDismissed()
      .pipe(tap(data => console.log(data, 'dismissed')),takeUntil(this.onAndOfflineEventsSubject$))
      .subscribe(this.openOfflineSnackbar.bind(this))
  }

  public openOnlineSnackbar(): void {
    this.activeSnackbar = this.openSnackbar(OnLineSnackbarMessages.ONLINE, 4000);
  }

  public openOfflineSnackbar(): void {
    this.activeSnackbar = this.openSnackbar(OnLineSnackbarMessages.OFFLINE);
  }

  private openSnackbar(message: OnLineSnackbarMessages, duration: number | null = null): MatSnackBarRef<OnLineSnackbarComponent> {
    const data: IOnLineSnackbarModel = {
      text: message,
      online: this.isOnline
    }

    const snackBarConfig: MatSnackBarConfig =
      {data, panelClass: `snackbarRestyle${this.isOnline ? 'Online' : 'Offline'}`, duration};

    return this._snackBar.openFromComponent(OnLineSnackbarComponent, snackBarConfig)
  }


  private get onAndOfflineEvents(): Observable<Event> {
    return merge(
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
  }

  private dealWithSnackbar(isOnline: boolean): void {
    this.isOnline = isOnline;
    isOnline ? this.openOnlineSnackbar() : this.openOfflineSnackbar();
  }



}
