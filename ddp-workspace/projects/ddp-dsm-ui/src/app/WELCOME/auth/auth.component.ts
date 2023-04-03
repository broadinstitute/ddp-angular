import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {fromEvent, Observable, tap} from 'rxjs';
import {Auth} from '../../services/auth.service';
import {ComponentService} from '../../services/component.service';
import {SessionService} from '../../services/session.service';


@Component({
  selector: 'app-auth',
  template: `
    <div class='container' *ngIf='!(pickList$ | async)?.length else pickStudy'>
      <mat-spinner *ngIf='loading' mode='indeterminate'></mat-spinner>
      <div *ngIf='(authError | async) as errorMessage'>
        <h2>{{ errorMessage }}</h2>
        <button mat-raised-button color='primary' (click)='showAuthPopUp()'>Try again</button>
      </div>
    </div>

    <ng-template #pickStudy>
      <app-pick-study *ngIf="!popUpIsShown" [pickList]='pickList$ | async'></app-pick-study>
    </ng-template>
  `,
  styles: [`
    .container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h2  {
      color: red;
      font-size: 1.5em;
    }
    ::ng-deep.auth0-lock-close-button {
      display: none !important;
    }
  `]
})

export class AuthComponent implements OnInit {
  loading = false;
  popUpIsShown = true;
  authError: Observable<string | null>;
  pickList$: Observable<any>;
  private source$: Observable<StorageEvent>;

  constructor(private auth: Auth, private title: Title, private router: Router) {}

  ngOnInit(): void {

    this.source$ = fromEvent<StorageEvent>(window, 'storage');
    this.source$.subscribe(
      event => {
        if (event.key === SessionService.DSM_TOKEN_NAME && event.newValue === null) {
          this.auth.doLogout();
          this.router.navigateByUrl('/');
        }
      }
    );

    if (this.auth.authenticated()) {
      const selectedRealm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      this.router.navigate([selectedRealm]);
    } else {
      this.startAppAuth();
      this.pickList$ = this.auth.getRealmListObs();
    }
  }

  startAppAuth(): void {
    this.title.setTitle('DDP Study Management');
    this.auth.sessionLogout();
    this.showAuthPopUp();
    this.runAuth0Listeners();
  }

  showAuthPopUp(): void {
    this.auth.lock.show();
  }

  private runAuth0Listeners(): void {
    this.auth.lock.on('show', this.popUpShown.bind(this));
    this.auth.lock.on('hide', this.popUpHidden.bind(this));
  }

  private popUpShown(): void {
    this.loading = false;
    this.popUpIsShown = true;
    this.auth.authError.next(null);
    this.title.setTitle('DDP Study Management');
  }

  private popUpHidden(): void {
    this.loading = true;
    this.popUpIsShown = false;
    this.title.setTitle('Logging in...');
    this.authError = this.auth.authError.pipe(tap(error => {
      if(error) {
        this.loading = false;
        this.title.setTitle(error);
      }
    }));
  }
}
