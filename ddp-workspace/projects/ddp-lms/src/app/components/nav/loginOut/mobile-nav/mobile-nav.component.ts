import { Component, OnInit } from '@angular/core';
import { CommunicationService, HeaderConfigurationService } from 'toolkit';
import { SessionMementoService } from 'ddp-sdk';
import { Route } from '../../../../constants/Route';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent implements OnInit {
  constructor(
    private communicationService: CommunicationService,
    private session: SessionMementoService,
    public headerConfig: HeaderConfigurationService
  ) {}

  readonly Route = Route;

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  ngOnInit(): void {}
}
