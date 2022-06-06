import {Component} from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { Route } from '../../constants/Route';
import { CommunicationService } from 'toolkit';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {

  constructor(private communicationService: CommunicationService,
              private session: SessionMementoService,) {
  }


  readonly Route = Route;


  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
