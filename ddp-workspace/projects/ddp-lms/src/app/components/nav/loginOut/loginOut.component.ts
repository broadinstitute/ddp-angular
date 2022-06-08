import {Component} from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { HeaderConfigurationService } from 'toolkit';
import { Route } from '../../../constants/Route';

@Component({
  selector: 'app-login-out',
  template: `
  <div class="auth">
    <div *ngIf="isAuthenticated && headerConfig.showDashboardButton" class="auth__dashboard">
      <ng-container *ngTemplateOutlet="dashboardButton"></ng-container>
    </div>

    <ul class="loginOutButtons">
      <li>
        <ddp-sign-in-out></ddp-sign-in-out>
      </li>

      <li>
        <a class="button button_primary cmiBtn" *ngIf="!isAuthenticated" [routerLink]="Route.CountMeIn">
          {{ 'Header.Links.CountMeIn' | translate }}
        </a>
      </li>
      <li class="button button_primary cmiBtn" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="link-list__item_active" 
      *ngIf="isAuthenticated">
        <a class="link" [routerLink]="Route.Dashboard">
          {{ 'Toolkit.Dashboard.Title' | translate }}
        </a>
      </li>
    </ul>
  </div>
  `,
  styles: [`

    li {
      list-style-type: none;
    }
    li:not(:first-of-type) {
      margin-left: 16px;
    }

    .loginOutButtons {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cmiBtn {
      padding: 0.625rem 2rem;
      background-color: #9953CE;
      border-color: #9953CE;
      border-radius: 4px;
    }

    .cmiBtn:hover {
      background-color: #7f30b8;
      border-color: #7f30b8;
    } 
    a { color: white; }
  `]
})

export class loginOutComponent {
  readonly Route = Route;

  constructor(
    public headerConfig: HeaderConfigurationService,
    private session: SessionMementoService,
  ){}

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
