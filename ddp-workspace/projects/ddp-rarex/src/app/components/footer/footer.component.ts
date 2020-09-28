import { Component, OnInit } from '@angular/core';

import { RoutePaths } from '../../router-resources';

interface NavLink {
  translationKey: string;
  routePath: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  navLinks: NavLink[] = [
    { translationKey: 'Footer.Links.Home', routePath: RoutePaths.Welcome },
    { translationKey: 'Footer.Links.TermsAndConditions', routePath: RoutePaths.TermsAndConditions },
    { translationKey: 'Footer.Links.PrivacyPolicy', routePath: RoutePaths.PrivacyPolicy }
  ];

  constructor() { }

  public ngOnInit(): void { }
}
