import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { delay, filter, switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ConfigurationService, MailingListServiceAgent, Person } from 'ddp-sdk';

import { AtcpCommunicationService } from '../../toolkit/services/communication.service';
import { PopupMessage } from '../../toolkit/models/popupMessage';
import { UserInfo } from '../../models/userInfo';

@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss'],
})
export class MailingListComponent implements OnInit, OnDestroy {
  emailForm: FormGroup;
  formSubmitted$ = new Subject<Person>();

  private sub: Subscription;
  private shouldUnsub = true;

  private readonly SUCCESS_JOIN_MAILING_LIST_STATUS = 204;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private mailingListServiceAgent: MailingListServiceAgent,
    private communicationService: AtcpCommunicationService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    const userInfo = this.route.snapshot.queryParams as UserInfo;

    if (!userInfo.firstName || !userInfo.lastName) {
      this.router.navigate(['']);
    }

    this.emailForm = this.makeEmailForm(userInfo);
    this.setupSubmitListener();
  }

  ngOnDestroy(): void {
    if (this.sub && this.shouldUnsub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();

      return;
    }

    this.formSubmitted$.next({
      firstName: this.emailForm.value.firstName,
      lastName: this.emailForm.value.lastName,
      emailAddress: this.emailForm.value.email,
      studyGuid: this.config.studyGuid,
    });
  }

  signIn(): void {
      //TODO: check if we need the empty method?
  }

  private makeEmailForm(userInfo: UserInfo): FormGroup {
    return new FormGroup({
      firstName: new FormControl(userInfo.firstName, [Validators.required]),
      lastName: new FormControl(userInfo.lastName, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private setupSubmitListener(): void {
    this.sub = this.formSubmitted$
      .pipe(
        switchMap(person => this.mailingListServiceAgent.join(person)),
        filter(
          (res: HttpResponse<null>) =>
            res.status === this.SUCCESS_JOIN_MAILING_LIST_STATUS,
        ),
        tap(() => {
          this.shouldUnsub = false;
          this.router.navigate(['']);

          this.communicationService.showPopupMessage(
            new PopupMessage(
              this.translate.instant('Toolkit.StayInformed.Text'),
              false,
            ),
          );
        }),
        delay(4000),
        tap(() => {
          this.communicationService.closePopupMessage();
        }),
      )
      .subscribe(() => {
        this.sub.unsubscribe();
      });
  }
}
