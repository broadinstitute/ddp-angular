import { Component, OnInit } from '@angular/core';
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

  constructor(
    private formBuilder: FormBuilder,
    private session: SessionMementoService,
    private userProfile: UserProfileServiceAgent,
    private workflow: WorkflowServiceAgent,
    private workflowBuilder: WorkflowBuilderService,
    private subjectInvitation: SubjectInvitationServiceAgent) { }

  public ngOnInit(): void {
    this.initAccountForm();
  }

  public get invitationId(): string {
    return this.session.session.invitationId;
  }

  public get participantGuid(): string {
    return this.session.session.participantGuid;
  }

  public onSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }
    const profile = this.createProfile();
    const email = this.accountForm.controls.email.value;
    this.isLoading = true;
    this.accountForm.disable();
    this.subjectInvitation.createStudyParticipant(this.invitationId).pipe(
      take(1),
      tap(userGuid => this.session.setParticipant(userGuid)),
      mergeMap(() => this.userProfile.saveProfile(false, profile)),
      mergeMap(() => {
        if (email) {
          return this.subjectInvitation.createUserLoginAccount(this.session.session.participantGuid, email);
        }
        return of(null);
      }),
      mergeMap(() => this.workflow.getStart())
    ).subscribe(response => {
      if (response) {
        this.workflowBuilder.getCommand(response).execute();
      } else {
        this.isLoading = false;
        this.accountForm.enable();
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
