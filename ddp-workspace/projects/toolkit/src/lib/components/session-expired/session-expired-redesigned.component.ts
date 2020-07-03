import { Component, OnInit } from '@angular/core';
import { SessionExpiredComponent } from './session-expired.component';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { Auth0AdapterService } from 'ddp-sdk';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'toolkit-session-expired-redesigned',
    template: `
        <main class="main">
            <section class="section session-content-section">
                <div class="content content_tight">
                    <p translate>Toolkit.SessionExpired.Text</p>
                    <div class="session-content-section__button">
                        <button (click)="signin()"
                                [attr.aria-label]="'Common.Buttons.Login.AriaLabel' | translate"
                                class="button button_medium button_primary"
                                translate>
                            Common.Buttons.Login.Title
                        </button>
                    </div>
                </div>
            </section>
        </main>`
})
export class SessionExpiredRedesignedComponent extends SessionExpiredComponent implements OnInit {
    private isAdminSessionExpired: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private headerConfig: HeaderConfigurationService,
        private _auth0: Auth0AdapterService) {
        super(_auth0);
    }

    public ngOnInit(): void {
        this.headerConfig.setupDefaultHeader();
        this.isAdminSessionExpired = !!this.activatedRoute.snapshot.data.admin;
    }

    public signin(): void {
        if (this.isAdminSessionExpired) {
            this._auth0.adminLogin();
        } else {
            super.signin();
        }
    }
}
