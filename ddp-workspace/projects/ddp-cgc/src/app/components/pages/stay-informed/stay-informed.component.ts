import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import {
  ConfigurationService,
  LoggingService,
  MailingListServiceAgent,
} from 'ddp-sdk';

import { Route } from '../../../constants/route';

@Component({
  selector: 'app-stay-informed',
  templateUrl: './stay-informed.component.html',
  styleUrls: ['./stay-informed.component.scss'],
})
export class StayInformedComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  uiBlocked = false;
  private readonly LOG_SOURCE = 'StayInformedComponent';

  constructor(
    private router: Router,
    private mailingListService: MailingListServiceAgent,
    private loggingService: LoggingService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.joinMailingList(this.form.value.email);
  }

  private joinMailingList(emailAddress: string): void {
    this.uiBlocked = true;

    this.mailingListService
      .join({
        emailAddress,
        firstName: '',
        lastName: '',
        studyGuid: this.config.studyGuid,
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigateByUrl(Route.Home);
        },
        error: err => {
          this.loggingService.logError(
            this.LOG_SOURCE,
            'Mailing list join error',
            err,
          );

          this.router.navigateByUrl(Route.Error);
        },
      });
  }
}
