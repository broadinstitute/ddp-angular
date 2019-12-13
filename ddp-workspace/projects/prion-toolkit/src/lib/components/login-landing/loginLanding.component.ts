import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { GovernedParticipantsServiceAgent, Participant } from 'ddp-sdk';

import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

import { Subscription } from 'rxjs';
import { filter, take, mergeMap, tap } from 'rxjs/operators';

import {
    SessionMementoService,
    Auth0AdapterService,
    ConfigurationService,
    WorkflowServiceAgent
} from 'ddp-sdk';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
    selector: 'toolkit-login-landing',
    template: `
      <toolkit-common-landing></toolkit-common-landing>
  `
})
export class LoginLandingComponent implements OnInit, OnDestroy {
    private anchor: Subscription;

    constructor(
        private router: Router,
        private auth0: Auth0AdapterService,
        private sessionService: SessionMementoService,
        private participantService: GovernedParticipantsServiceAgent,
        private workflowService: WorkflowServiceAgent,
        private workflowBuilder: WorkflowBuilderService,
        private jwtHelper: JwtHelperService,
        @Inject('ddp.config') private config: ConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        if (!this.config.doLocalRegistration && location.hash) {
            // if we're doing local registration, session has already been set
            // and logging out and parsing hash will fail
            this.auth0.handleAuthentication(this.handleAuthError.bind(this));
        } else if (!this.config.doLocalRegistration && !location.hash) {
            this.redirect();
        }

        // Subscribe to session observable, so once auth session is set, then we redirect.
        this.anchor = this.sessionService.sessionObservable.pipe(
            filter(session => session !== null && !!session.idToken),
            take(1),
            mergeMap(() => this.participantService.getGovernedStudyParticipants(this.config.studyGuid)),
            tap(participants => this.setFirstParticipant(participants))
        ).subscribe(() => {
            this.redirect();
        });
    }

    public ngOnDestroy(): void {
        // Subscription might not have been initialized if we encountered auth error and get unloaded.
        this.anchor && this.anchor.unsubscribe();
    }

    private handleAuthError(error: any | null): void {
        if (error) {
            console.error(error);
        }
        this.router.navigateByUrl(this.toolkitConfiguration.errorUrl);
    }

    private redirect(): void {
        let nextUrlFromStorage = sessionStorage.getItem('nextUrl');
        const tokenFromStorage = localStorage.getItem('token');

        if (tokenFromStorage && nextUrlFromStorage && nextUrlFromStorage.indexOf('account-verification') !== 0){
            // If we have the token and are redirecting, add the email address from the token as a parameter
            //TODO: I should change this to check whether the user has verified their email rather than checking whether
            // we passed in a nextUrl and do the redirect if they haven't verified their email
            const decodedJwt = this.jwtHelper.decodeToken(tokenFromStorage);
            const email = decodedJwt['name'];
            sessionStorage.removeItem('nextUrl');
            const directTo: string = this.router.createUrlTree([nextUrlFromStorage], {queryParams: {'email': email}}).toString();
            this.auth0.logout(directTo);
        }
        else if (nextUrlFromStorage) {
            // `nextUrl` is set before redirecting to auth0. If it exists, then pick up where we left off.
            sessionStorage.removeItem('nextUrl');
            this.router.navigateByUrl(nextUrlFromStorage);
        } else {
            // No `nextUrl` set before going to auth0, query the workflow service to get where to go next.
            this.workflowService.getNext(this.config.studyGuid)
                .pipe(take(1))
                .subscribe(response => response && this.workflowBuilder.getCommand(response).execute());
        }
    }

    private setFirstParticipant(participants: Array<Participant>): void {
        if (participants && participants.length) {
            const participantGuid = participants[0].userGuid;
            this.sessionService.setParticipant(participantGuid);
        }
    }
}
