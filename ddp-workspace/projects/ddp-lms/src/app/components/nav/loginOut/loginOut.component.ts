import {Component} from '@angular/core';
import { Route } from '../../../constants/Route';

@Component({
  selector: 'app-login-out',
  template: `
    <ul class="loginOutButtons">
      <li>
        <ddp-sign-in-out></ddp-sign-in-out>
      </li>

      <li>
        <a class="button button_primary cmiBtn" [routerLink]="Route.CountMeIn">
          {{ 'Header.Links.CountMeIn' | translate }}
        </a>
      </li>
    </ul>

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
  `]
})

export class loginOutComponent {
  readonly Route = Route;
}
