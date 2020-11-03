import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXTranslateService } from 'ddp-sdk';
import { RedirectToLoginLandingComponent } from 'toolkit';

@Component({
  selector: 'app-redirect-to-auth0-landing',
  templateUrl: './redirect-to-auth0-landing.component.html',
  styleUrls: ['./redirect-to-auth0-landing.component.scss']
})
export class RedirectToAuth0Landing extends RedirectToLoginLandingComponent {
  constructor(
    route: ActivatedRoute,
    translate: NGXTranslateService) {
    super(route, translate);
  }
}
