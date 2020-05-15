import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService, Auth0AdapterService } from 'ddp-sdk';
import { AppRoutes } from '../../app-routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private session: SessionMementoService,
    private auth0: Auth0AdapterService,
    private router: Router) { }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public get showButton(): boolean {
    return location.href.indexOf('password') === -1;
  }

  public register(): void {
    this.router.navigateByUrl(AppRoutes.UserRegistrationPrequal);
  }

  public openHomePage(): void {
    this.router.navigateByUrl('');
  }

  public openDashboard(): void {
    this.router.navigateByUrl(AppRoutes.Dashboard);
  }

  public logInOut(): void {
    if (this.isAuthenticated) {
      this.auth0.logout()
    } else {
      this.auth0.login();
    }
  }
}
