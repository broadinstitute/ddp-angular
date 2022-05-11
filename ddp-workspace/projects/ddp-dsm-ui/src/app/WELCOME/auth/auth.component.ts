import {Component, OnInit} from '@angular/core';
import {Auth} from '../../services/auth.service';
import {ComponentService} from '../../services/component.service';
import {Title} from '@angular/platform-browser';
import {Observable, tap} from 'rxjs';


@Component({
  selector: 'app-auth',
  template: `
    <div class="container">
      <mat-spinner *ngIf="loading" mode="indeterminate"></mat-spinner>
      <div *ngIf="(authError | async) as errorMessage">
        <h2>{{ errorMessage }}</h2>
        <button mat-raised-button color="primary" (click)="showAuthPopUp()">Try again</button>
      </div>
    </div>
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
    }
    ::ng-deep.auth0-lock-close-button {
      display: none !important;
    }
  `]
})

export class AuthComponent implements OnInit {
  loading = false;
  authError: Observable<string | null>;

  constructor(private auth: Auth, private title: Title) {}

  ngOnInit(): void {
    this.startAppAuth();
  }

  startAppAuth(): void {
    this.title.setTitle('DDP Study Management');
    localStorage.removeItem(ComponentService.MENU_SELECTED_REALM);
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
    this.auth.authError.next(null);
    this.title.setTitle('DDP Study Management');
  }

  private popUpHidden(): void {
    this.loading = true;
    this.title.setTitle('Logging in...');
    this.authError = this.auth.authError.pipe(tap(error => {
      if(error) {
        this.loading = false;
        this.title.setTitle(error);
      }
    }));
  }

}
