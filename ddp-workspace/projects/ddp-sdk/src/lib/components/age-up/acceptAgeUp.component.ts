import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';

@Component({
    selector: 'ddp-accept-age-up',
    template: `<mat-spinner></mat-spinner>`
})
export class AcceptAgeUpComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private auth0: Auth0AdapterService) { }

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.setNextUrl(params['next']);
            this.signup(params['invitation']);
        });
    }

    private setNextUrl(nextUrl: string): void {
        sessionStorage.setItem('nextUrl', nextUrl);
    }

    private signup(invitationId: string): void {
        this.auth0.signup({ invitation_id: invitationId });
    }
}
