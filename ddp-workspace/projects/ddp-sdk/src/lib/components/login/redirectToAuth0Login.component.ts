import { Component, OnInit } from '@angular/core';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ddp-redirect-to-auth0-login',
    template: `<ng-content></ng-content>`
})

export class RedirectToAuth0LoginComponent implements OnInit {
    constructor(
        public auth0: Auth0AdapterService,
        private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.route.queryParamMap.subscribe(queryParamMap => {
            const additionalParams = {};
            const emailFromUrl = queryParamMap.get('email');
            emailFromUrl && (additionalParams['user_email'] = emailFromUrl);
            return this.auth0.login(additionalParams);
        });
    }
}
