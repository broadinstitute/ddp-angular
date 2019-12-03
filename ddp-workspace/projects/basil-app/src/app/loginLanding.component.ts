import { filter, mergeMap } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService, ActivityServiceAgent } from 'ddp-sdk';
import { UserStateService } from './services/userState.service';
import { UserState } from './model/userState';
import { PrequalifierComponent } from './prequalifier.component'
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-login-landing',
    templateUrl: './loginLanding.component.html',
    styles: [
        `.center {
        margin: auto;
        width: 50%;
        padding: 10px;
    }`
    ]
})
export class LoginLandingComponent implements OnDestroy {
    private anchor: Subscription;

    constructor(
        private router: Router,
        sessionService: SessionMementoService,
        userState: UserStateService,
        private activityServiceAgent: ActivityServiceAgent) {
        this.anchor = sessionService.sessionObservable.pipe(
            filter(x => x != null),
            mergeMap(x => userState.refreshState(), (x, y) => y)
        ).subscribe(x => this.redirect(x));
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    private redirect(state: UserState): void {
        let url: string;
        switch (state) {
            case UserState.Login: url = 'welcome'; break;
            case UserState.Prequalifier: url = 'prequalifier'; break;
            case UserState.Consent: url = 'consent'; break;
            case UserState.Dashboard: url = 'dashboard'; break;
            case UserState.NotQualified: url = 'not-qualified'; break;
            case UserState.NotConsented: url = 'consent-declined'; break;
        }
        if (!url) {
            // bit of a hack: if we don't know the state, create the prequal and go to it
            this.activityServiceAgent.createInstance(PrequalifierComponent.STUDY_GUID, PrequalifierComponent.PREQUALIFIER_GUID)
                .subscribe(x => {
                    this.router.navigateByUrl('prequalifier');
                });
        }
        else {
            this.router.navigateByUrl(url);
        }
    }
}
