import { Component } from '@angular/core';

import { RoutePaths } from '../../router-resources';

interface NavLink {
  translationKey: string;
  routePath: string;
  external?: boolean;
  openNewTab: boolean;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  readonly rarexUrl = 'https://rare-x.org/';
  navLinks: NavLink[] = [
    {
      translationKey: 'Footer.Links.Home',
      routePath: this.rarexUrl,
      external: true,
      openNewTab: true
    },
    {
      translationKey: 'Footer.Links.TermsOfUse',
      routePath: RoutePaths.TermsOfUse,
      openNewTab: true
    },
    {
      translationKey: 'Footer.Links.PrivacyPolicy',
      routePath: RoutePaths.PrivacyPolicy,
      openNewTab: true
    },
  ];
}
