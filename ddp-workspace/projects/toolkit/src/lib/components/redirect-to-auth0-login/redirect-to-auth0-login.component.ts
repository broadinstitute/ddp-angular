import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth0AdapterService } from 'ddp-sdk';

@Component({
    selector: 'redirect-to-auth0-login',
    template: `
        <toolkit-common-landing></toolkit-common-landing>
    `
})
export class RedirectToAuth0LoginComponent implements OnInit {
    private readonly LOGIN_MODE = 'login';

    constructor(
        private activatedRoute: ActivatedRoute,
        private auth0: Auth0AdapterService,
        private router: Router) { }

    public ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            if (params.mode === this.LOGIN_MODE) {
                this.auth0.login();
            } else {
                this.router.navigateByUrl('/');
            }
        });
    }
}
