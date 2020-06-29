import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService, SubjectInvitationServiceAgent } from 'ddp-sdk';
import { AppRoutes } from '../../app-routes';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent {
  public appRoutes = AppRoutes;

  constructor(
    private router: Router,
    private session: SessionMementoService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public get invitationId(): string {
    return this.session.session.invitationId;
  }

  public enroll(): void {
    this.subjectInvitation.createStudyParticipant(this.invitationId).pipe(
      take(1)
    ).subscribe(userGuid => {
      this.session.setParticipant(userGuid);
      this.router.navigateByUrl(this.appRoutes.Dashboard);
    });
  }
}
