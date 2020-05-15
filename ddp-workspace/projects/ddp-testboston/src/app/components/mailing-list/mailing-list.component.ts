import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MailingListServiceAgent, Person } from 'ddp-sdk';
import { ToolkitConfigurationService } from 'toolkit';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss']
})
export class MailingListComponent implements OnInit {
  public mailingListForm: FormGroup;
  private isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private mailingService: MailingListServiceAgent,
    @Inject('toolkit.toolkitConfig') private config: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.mailingListForm = this.formBuilder.group({
      adult: new FormControl('', Validators.required),
      bwhPatient: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S+@\S+\.\S+$/)
      ])
    });
  }

  public fieldHasError(field: string, error: string): boolean {
    return this.isSubmitted && this.mailingListForm && this.mailingListForm.controls[field].errors
      && this.mailingListForm.controls[field].errors[error];
  }

  public onSubmit(): void {
    this.isSubmitted = true;
    if (this.mailingListForm.invalid) {
      return;
    }
    if (this.mailingListForm.value.adult) {
      // this.handleAdultSubject();
    } else {
      // this.handleMinorSubject();
    }
  }

  private handleAdultSubject(): void {
    const subject = this.createSubject(this.mailingListForm.value.email, this.mailingListForm.value.bwhPatient);
    this.mailingService.join(subject).pipe(
      take(1)
    ).subscribe(() => { });
  }

  private handleMinorSubject(): void {
    // do smth if subject < 18
  }

  private createSubject(emailAddress: string, bwhPatient: string): Person {
    return {
      emailAddress,
      studyGuid: this.config.studyGuid,
      info: [
        JSON.stringify({
          over18: true,
          bwhPatient: JSON.parse(bwhPatient)
        })
      ]
    };
  }
}
