import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RedirectToAuth0LoginComponent } from './redirect-to-auth0-login.component';
import { Auth0AdapterService } from 'ddp-sdk';

@Component({
    selector: 'redirect-to-auth0-login-redesigned',
    template: `
        <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>`
})
export class RedirectToAuth0LoginRedesignedComponent extends RedirectToAuth0LoginComponent {
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _auth0: Auth0AdapterService,
        private _router: Router) {
        super(_activatedRoute, _auth0, _router)
    }
}
