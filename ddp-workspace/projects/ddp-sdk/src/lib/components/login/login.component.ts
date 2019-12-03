import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { LoggingService } from '../../services/logging.service';
import { Subscription } from 'rxjs';
import { Auth0Mode } from '../../models/auth0-mode';

@Component({
  selector: 'ddp-login',
  template: `
  <button mat-button
    class="mat-button ddp-login-button"
    data-ddp-test="loginButton"
    *ngIf="!isAuthenticated"
    (click)="this.showAuth0()">
      {{ loginCaption ? loginCaption : loginText }}
  </button>
  <button mat-button
    class="mat-button ddp-login-button"
    data-ddp-test="logoutButton"
    *ngIf="isAuthenticated"
    (click)="doLogout()">
    {{ logoutCaption ? logoutCaption : logoutText }}
  </button>`
})
export class LoginComponent implements OnDestroy, OnInit {
  @Input() loginCaption: string;
  @Input() logoutCaption: string;
  @Input() auth0Mode: Auth0Mode = Auth0Mode.SignupAndLogin;
  @Output() logout: EventEmitter<void> = new EventEmitter();
  public loginText: string;
  public logoutText: string;
  private anchor: Subscription;

  constructor(
    private session: SessionMementoService,
    private auth0: Auth0AdapterService,
    private logger: LoggingService,
    private ngxTranslate: NGXTranslateService) {
    this.anchor = new Subscription();
  }

  public ngOnInit(): void {
    const translationKeys = ['SDK.Login.Login', 'SDK.Login.Logout'];
    const translate = this.ngxTranslate.getTranslation(translationKeys).subscribe((translationValues: object) => {
      this.loginText = translationValues[translationKeys[0]];
      this.logoutText = translationValues[translationKeys[1]];
    });
    this.anchor.add(translate);
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  /**
   * Shows the auth0 signing screen with the appropriate
   * sign/login/both option.
   */
  public showAuth0(): void {
    if (this.auth0Mode === Auth0Mode.SignupAndLogin) {
      this.auth0.signupOrLogin();
    } else if (this.auth0Mode === Auth0Mode.SignupOnly) {
      this.auth0.signup();
    } else if (this.auth0Mode === Auth0Mode.LoginOnly) {
      this.auth0.login();
    }
  }

  public doLogout(): void {
    this.auth0.logout();
    this.logger.logEvent('LoginComponent', 'Logout event occured');
    this.logout.emit();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
