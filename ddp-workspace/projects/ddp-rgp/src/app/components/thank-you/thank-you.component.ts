import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import {
  CompositeDisposable,
  ConfigurationService,
  MailingListServiceAgent,
} from 'ddp-sdk';

import { Routes } from '../../routes';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss'],
})
export class ThankYouComponent implements OnInit, OnDestroy {
  mailingForm: FormGroup;
  submit$ = new Subject<void>();
  submitBtnDisabled = false;
  private emailRegex = /^\S+@\S+\.\S+$/;
  private anchor = new CompositeDisposable();

  constructor(
    private router: Router,
    private mailingListService: MailingListServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.initMailingForm();
    this.initFormSubmitListener();
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  showError(): boolean {
    const emailControl = this.mailingForm.get('email');

    return (
      emailControl.hasError('required') || emailControl.hasError('pattern')
    );
  }

  private initMailingForm(): void {
    this.mailingForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
    });
  }

  private initFormSubmitListener(): void {
    const sub = this.submit$
      .pipe(
        filter(() => this.mailingForm.valid),
        tap(() => (this.submitBtnDisabled = true)),
        map<void, string>(() => this.mailingForm.get('email').value),
        switchMap(emailAddress =>
          this.mailingListService
            .join({
              emailAddress,
              firstName: '',
              lastName: '',
              studyGuid: this.config.studyGuid,
            })
            .pipe(take(1)),
        ),
      )
      .subscribe((res: HttpResponse<void> | null) => {
        if (res !== null) {
          this.router.navigateByUrl(Routes.Home);
        } else {
          this.router.navigateByUrl(Routes.Error);
        }
      });

    this.anchor.addNew(sub);
  }
}
