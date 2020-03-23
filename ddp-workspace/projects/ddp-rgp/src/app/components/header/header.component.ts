import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  public inHome: boolean = true;
  public inLGMD: boolean = true;
  public inEligiblityCrit: boolean = true;
  public isCollapsed: boolean = true;
  public isForFamiliesCollapsed: boolean = true;
  public isForResearchersCollapsed: boolean = true;
  public isSpecialtyProjectsCollapsed: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.trackNavigation(event.urlAfterRedirects);
      }
    });
  }

  private trackNavigation(route: string): void {
    if (route === null || route === undefined || route === '/' ||
      route.indexOf('/password') === 0 || route.indexOf('/limb-girdle-muscular-dystrophy') === 0 ||
      route.indexOf('/craniofacial') === 0 || route.indexOf('/eligibility-criteria') === 0) {
      this.inHome = true;
      this.inLGMD = true;
      this.inEligiblityCrit = true;
      return;
    }

    if (route.indexOf('/about-us') === 0) {
      this.inHome = false;
      this.inLGMD = false;
      this.inEligiblityCrit = false;
      return;
    }

    this.inLGMD = false;
    this.inHome = false;
    this.inEligiblityCrit = false;
  }
}
