import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  SessionMementoService,
  SubjectInvitationServiceAgent,
  UserProfile,
  UserProfileServiceAgent,
  WorkflowServiceAgent
} from 'ddp-sdk';
import { WorkflowBuilderService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { of } from 'rxjs';
import { take, tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
  public appRoutes = AppRoutes;
  public accountForm: FormGroup;
  public isLoading = false;
  public isSubjectEnrolled = false;
  public subjectNotSelected = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private session: SessionMementoService,
    private userProfile: UserProfileServiceAgent,
    private workflow: WorkflowServiceAgent,
    private workflowBuilder: WorkflowBuilderService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.initAccountForm();
    this.isSubjectEnrolled = !!this.session.session.participantGuid;
    this.subjectNotSelected = !!this.session.session.invitationId;
  }

  public onSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }

    const profile = this.createProfile();
    const email = this.accountForm.controls.email.value;
    const participantGuid = this.session.session.participantGuid;
    const invitationId = this.session.session.invitationId;

    this.isLoading = true;
    this.accountForm.disable();

    this.subjectInvitation.createStudyParticipant(invitationId).pipe(
      take(1),
      tap(userGuid => this.session.setParticipant(userGuid)),
      mergeMap(() => this.userProfile.saveProfile(false, profile)),
      mergeMap(() => email ? this.subjectInvitation.createUserLoginAccount(participantGuid, email) : of(null)),
      mergeMap(() => this.workflow.getStart())
    ).subscribe(response => {
      if (response) {
        this.workflowBuilder.getCommand(response).execute();
      } else {
        this.router.navigateByUrl(this.appRoutes.Error);
      }
    });
  }

  public fieldHasError(field: string, error: string): boolean {
    return this.accountForm && this.accountForm.controls[field].errors
      && this.accountForm.controls[field].errors[error];
  }

  private initAccountForm(): void {
    this.accountForm = this.formBuilder.group({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.pattern(/^\S+@\S+\.\S+$/))
    });
  }

  private createProfile(): UserProfile {
    const profile = new UserProfile();
    profile.firstName = this.accountForm.controls.firstName.value;
    profile.lastName = this.accountForm.controls.lastName.value;
    return profile;
  }
}
