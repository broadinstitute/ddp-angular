import { Component } from '@angular/core';
import { RedirectToAuth0LoginComponent } from "toolkit";
import { ActivatedRoute, Router } from "@angular/router";
import { Auth0AdapterService } from "ddp-sdk";

@Component({
  selector: 'prion-redirect-to-auth0-login',
  template: `<prion-common-landing></prion-common-landing>`
})
export class PrionRedirectToAuth0LoginComponent extends RedirectToAuth0LoginComponent {
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _auth0: Auth0AdapterService,
    private _router: Router) {
    super(_activatedRoute, _auth0, _router);
  }
}
