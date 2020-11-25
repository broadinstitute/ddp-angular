import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import {
  SubjectInvitationServiceAgent,
  SessionMementoService,
  LoggingService
} from 'ddp-sdk';

@Component({
  selector: 'app-prism-activity-link',
  template: `<p></p>`
})
export class PrismActivityLinkComponent implements OnInit {
  // This component handles redirecting a study staff to a specific activity for a specific user. This is
  // handy for embedding a URL in a study staff email. The required arguments to this component is the
  // user's invite code and activity instance guid. These are expected to be passed as query parameters.

  private readonly LOG_SOURCE = 'PrismActivityLinkComponent';

  constructor(
    private router: Router,
    private logger: LoggingService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionMementoService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(q => {
      const invitationId = q.invitationId;
      const instanceGuid = q.instanceGuid;
      if (invitationId && instanceGuid) {
        // First, lookup the invitation and setup the session.
        const currentInvitationId = this.sessionService.session.invitationId;
        if (invitationId === currentInvitationId) {
          // Study staff already looking at this invitation, so just navigate.
          this.router.navigateByUrl(`/activity/${instanceGuid}`);
        } else {
          this.subjectInvitation.lookupInvitation(invitationId)
            .pipe(take(1))
            .subscribe(response => {
              if (response) {
                this.sessionService.setInvitationId(response.invitationId);
                this.sessionService.setParticipant(response.userGuid);
                this.router.navigateByUrl(`/activity/${instanceGuid}`);
              } else {
                this.logger.logError(this.LOG_SOURCE, `Error while looking up invitationId: ${invitationId}`);
                this.router.navigateByUrl(`/error`);
              }
            });
        }
      } else {
        this.logger.logError(this.LOG_SOURCE, 'Either `invitationId` or `instanceGuid` query parameters are missing');
        this.router.navigateByUrl(`/error`);
      }
    });
  }
}
