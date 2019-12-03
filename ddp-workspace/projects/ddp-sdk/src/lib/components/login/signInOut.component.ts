import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ddp-sign-in-out',
    template: `
    <button class="SimpleButton"
            [ngClass]="{'SimpleButton--Scrolled': isScrolled}"
            data-ddp-test="signInButton"
            *ngIf="!isAuthenticated"
            (click)="doSignIn()">
        {{ signInCaption ? signInCaption : signInText }}
    </button>
    <button class="SimpleButton"
            [ngClass]="{'SimpleButton--Scrolled': isScrolled}"
            data-ddp-test="signOutButton"
            *ngIf="isAuthenticated"
            (click)="doSignOut()">
        {{ signOutCaption ? signOutCaption : signOutText }}
    </button>`
})
export class SignInOutComponent implements OnInit, OnDestroy {
    @Input() signInCaption: string;
    @Input() signOutCaption: string;
    @Input() isScrolled: boolean;
    public buttonText: string;
    public signInText: string;
    public signOutText: string;
    private anchor: Subscription;

    constructor(
        private session: SessionMementoService,
        private ngxTranslate: NGXTranslateService,
        private auth0: Auth0AdapterService) {
        this.anchor = new Subscription();
    }

    public ngOnInit(): void {
        const translationKeys = ['SDK.SignInOut.SignIn', 'SDK.SignInOut.SignOut'];
        const translate = this.ngxTranslate.getTranslation(translationKeys).subscribe((translationValues: object) => {
            this.signInText = translationValues[translationKeys[0]];
            this.signOutText = translationValues[translationKeys[1]];
        });
        this.anchor.add(translate);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }

    public doSignIn(): void {
        this.auth0.login();
    }

    public doSignOut(): void {
        this.auth0.logout();
    }
}
