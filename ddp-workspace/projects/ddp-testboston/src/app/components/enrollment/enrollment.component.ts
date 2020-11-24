import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  SessionMementoService,
  SubjectInvitationServiceAgent,
  UserProfile,
  UserProfileDecorator,
  UserProfileServiceAgent,
  WorkflowServiceAgent
} from 'ddp-sdk';
import { WorkflowBuilderService } from 'toolkit';
import { AppRoutes } from '../../app-routes';
import { of, throwError, Observable } from 'rxjs';
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
  public showError = false;
  private profile: UserProfile;

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
    this.setupInitialState();
  }

  public onSubmit(): void {
    if (this.accountForm.invalid) {
      return;
    }

    const profile = this.createProfile();
    const email = this.accountForm.controls.email.value;
    const invitationId = this.session.session.invitationId;
    const participantGuid = this.session.session.participantGuid;
    const participantGuid$ = participantGuid ? of(participantGuid) : this.createStudyParticipant(invitationId);

    this.isLoading = true;
    this.accountForm.disable();

    participantGuid$.pipe(
      take(1),
      mergeMap(userGuid => email ? this.subjectInvitation.createUserLoginAccount(userGuid, email) : of(null)),
      mergeMap(() => this.isProfileChanged(profile) ? this.userProfile.updateProfile(profile) : of(null)),
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
    const nonWhitespaceRegExp = /\S/;
    const emailRegExp = /^\S+@\S+\.\S+$/;
    this.accountForm = this.formBuilder.group({
      firstName: new FormControl(null, [Validators.required, Validators.pattern(nonWhitespaceRegExp)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(nonWhitespaceRegExp)]),
      email: new FormControl(null, Validators.pattern(emailRegExp))
    });
  }

  private createProfile(): UserProfile {
    const profile = new UserProfile();
    profile.firstName = this.accountForm.controls.firstName.value;
    profile.lastName = this.accountForm.controls.lastName.value;
    return profile;
  }

  private createStudyParticipant(invitationId: string): Observable<string> {
    return this.subjectInvitation.createStudyParticipant(invitationId).pipe(
      tap(userGuid => this.session.setParticipant(userGuid))
    );
  }

  private isProfileChanged(profile: UserProfile): boolean {
    return this.profile.firstName !== profile.firstName || this.profile.lastName !== profile.lastName;
  }

  private setupInitialState(): void {
    const invitationId$ = of(this.session.session.invitationId);

    invitationId$.pipe(
      take(1),
      mergeMap(invitationId => {
        if (invitationId) {
          return this.subjectInvitation.lookupInvitation(invitationId);
        } else {
          return throwError('There is no invitationId!');
        }
      }),
      mergeMap(studySubject => {
        if (studySubject.userLoginEmail) {
          return throwError('The subject already has email-associated account!');
        } else {
          const participantGuid = this.session.session.participantGuid;
          return participantGuid ? this.userProfile.profile : of(new UserProfileDecorator());
        }
      })
    ).subscribe(
      response => {
        if (response) {
          this.accountForm.controls.firstName.patchValue(response.profile.firstName);
          this.accountForm.controls.lastName.patchValue(response.profile.lastName);
          this.profile = response.profile;
        } else {
          this.router.navigateByUrl(this.appRoutes.Error);
        }
      },
      error => {
        this.showError = true;
      }
    );
  }
}
