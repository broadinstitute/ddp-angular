import { Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public inHome: boolean = true;
  public phone: string;
  public email: string;
  public phoneHref: string;
  public emailHref: string;
  public facebookUrl: string;

  constructor(
    private router: Router,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.trackNavigation(event.urlAfterRedirects);
      }
    });
  }

  public ngOnInit(): void {
    this.phone = this.toolkitConfiguration.phone;
    this.email = this.toolkitConfiguration.infoEmail;
    this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
    this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
    this.facebookUrl = `https://www.facebook.com/${this.toolkitConfiguration.facebookGroupId}`;
  }

  public toTop(): void {
    window.scrollTo(0, 0);
  }

  private trackNavigation(route: string): void {
    if (route === null || route === undefined || route === '/' || route.indexOf('/password') === 0) {
      this.inHome = true;
      return;
    }

    this.inHome = false;
  }
}
