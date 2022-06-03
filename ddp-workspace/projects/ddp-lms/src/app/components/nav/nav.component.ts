import {Component} from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { Route } from '../../constants/Route';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  readonly Route = Route;

  constructor(
    private session: SessionMementoService,
  ){}

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
