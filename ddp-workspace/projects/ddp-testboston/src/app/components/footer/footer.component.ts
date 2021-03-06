import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { ScrollerService } from '../../services/scroller.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public appRoutes = AppRoutes;
  public showLanguageColumn = true;
  private anchor: Subscription;

  constructor(
    private session: SessionMementoService,
    private scrollerService: ScrollerService,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.phone = this.config.phone;
    this.email = this.config.infoEmail;
    this.phoneHref = `tel:${this.phone}`;
    this.emailHref = `mailto:${this.email}`;
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public get isAdmin(): boolean {
    return this.session.isAuthenticatedAdminSession();
  }

  public scrollToAnchor(anchor: string): void {
    this.scrollerService.scrollToAnchor(anchor);
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession() || this.session.isAuthenticatedAdminSession();
  }

  public handleLanguageVisibility(visible: boolean): void {
    this.showLanguageColumn = visible;
  }
}
