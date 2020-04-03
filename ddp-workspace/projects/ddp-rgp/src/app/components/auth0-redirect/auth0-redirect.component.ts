import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth0AdapterService } from 'ddp-sdk';
import { RedirectToAuth0LoginComponent } from 'toolkit';

@Component({
  selector: 'app-auth0-redirect',
  templateUrl: './auth0-redirect.component.html',
  styleUrls: ['./auth0-redirect.component.scss']
})
export class Auth0RedirectComponent extends RedirectToAuth0LoginComponent {
  constructor(
    activatedRoute: ActivatedRoute,
    auth0: Auth0AdapterService,
    router: Router) {
    super(activatedRoute, auth0, router);
  }
}
