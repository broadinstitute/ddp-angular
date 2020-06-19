import { Component, Inject, OnInit } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { ToolkitConfigurationService, HeaderConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { ScrollerService } from '../../services/scroller.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public appRoutes = AppRoutes;

  constructor(
    private session: SessionMementoService,
    private scrollerService: ScrollerService,
    private headerConfig: HeaderConfigurationService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
    this.headerConfig.setupDefaultHeader();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession() || this.session.isAuthenticatedAdminSession();
  }
  
  public scrollToAnchor(anchor: string): void {
    this.scrollerService.scrollToAnchor(anchor);
  }
}
