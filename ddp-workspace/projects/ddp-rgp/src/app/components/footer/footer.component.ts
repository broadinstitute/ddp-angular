import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  inHome: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.trackNavigation(event.urlAfterRedirects);
      }
    });
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
