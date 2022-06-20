import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'toolkit';
import { SessionMementoService } from 'ddp-sdk';
import { Route } from '../../../constants/Route';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss'],
})
export class MobileNavComponent implements OnInit {
  constructor(
    private communicationService: CommunicationService,
    private session: SessionMementoService,
    public headerConfig: HeaderService
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
