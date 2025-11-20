import { Component } from '@angular/core';
import { Route } from '../../../constants/Route';
import { CommunicationService, HeaderConfigurationService} from 'toolkit';
import { SessionMementoService } from 'ddp-sdk';
import { HeaderService } from '../../../services/header.service';

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html',
  styleUrls: ['footer-nav.component.scss'],
})
export class FooterNavComponent {
  readonly Route = Route;

  constructor(
    private communicationService: CommunicationService,
    private session: SessionMementoService,
    public headerConfig: HeaderConfigurationService
  ) {}

  ngOnInit(): void {
    this.headerConfig.showMainButtons = false;
    this.headerConfig.showLoginButton = false;
  }

  public scrollTop(): void {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }
}
