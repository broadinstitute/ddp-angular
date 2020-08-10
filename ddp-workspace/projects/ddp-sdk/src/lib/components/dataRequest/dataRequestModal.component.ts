import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TextInputValidator } from '../../utility/validators/textInputValidator';
import { Subscription } from 'rxjs';
import { DataRequestService } from '../../services/dataRequest.service';
import { DataRequest, DataRequestOptions } from '../../models/dataRequest';

@Component({
  selector: 'ddp-data-request-modal',
  template: `
    <div class="dataRequest dataRequestModal--header">
      <h1 class="PageContent-title" translate>SDK.DataRequest.Title</h1>
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <div class="dataRequestModal--request" *ngIf="!requestSubmitted">
      <div mat-dialog-content>
        <h3 class="Subtitle" translate>SDK.DataRequest.SubTitle</h3>
        <form [formGroup]="form" class="dataRequestModal--form">
          <mat-radio-group formControlName="options" aria-label="Select an option">
            <mat-radio-button value="copy"><span translate>SDK.DataRequest.Copy</span></mat-radio-button>
            <mat-radio-button value="update"><span translate>SDK.DataRequest.Update</span></mat-radio-button>
            <mat-radio-button value="delete"><span translate>SDK.DataRequest.Delete</span></mat-radio-button>
            <mat-radio-button value="other"><span translate>SDK.DataRequest.Other</span></mat-radio-button>
          </mat-radio-group>
          <textarea matInput autofocus formControlName="otherText"
                    *ngIf="showTextField"
                    [placeholder]="placeholder | translate"></textarea>
          <mat-error *ngIf="isTextError" translate>SDK.DataRequest.Error</mat-error>
        </form>
      </div>
      <div mat-dialog-actions align="end">
        <button (click)="submit()"
                class="Button DataRequestButton--DataRequest col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="'SDK.DataRequest.SubmitRequest' | translate"></button>
      </div>
    </div>

    <div class="dataRequestModal--submittedRequest" *ngIf="requestSubmitted">
      <div mat-dialog-content class="dataRequestModal--sendMessage">
        <mat-icon>check_circle_outline</mat-icon>
        <p [innerText]="'SDK.DataRequest.RequestHasBeenSubmitted' | translate"></p>
      </div>
      <div mat-dialog-actions align="end">
        <button (click)="close()"
                class="Button DataRequestButton--DataRequest col-lg-6 col-md-6 col-sm-6 col-xs-12"
                [innerText]="'SDK.DataRequest.Okay' | translate"></button>
      </div>
    </div>
  `,
})
export class DataRequestModalComponent implements OnInit, OnDestroy {
  public placeholder = 'SDK.DataRequest.DescribeRequest';
  public requestSubmitted = false;
  public isTextError = false;
  public showTextField: boolean;
  public form = new FormGroup({
    options: new FormControl('copy'),
    otherText: new FormControl('')
  });

  private selectedOption: DataRequestOptions = this.form.get('options').value;
  private textValue: string;
  private anchor: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<DataRequestModalComponent>,
              private dataRequestService: DataRequestService) {
  }

  ngOnInit(): void {
    const selectedOption = this.form.get('options').valueChanges.subscribe(x => {
      this.selectedOption = x;
      this.setTextField(x);
    });
    this.anchor.add(selectedOption);

    const textFieldError = this.form.get('otherText').valueChanges.subscribe(x => {
      x.trim().length > 0 ? this.textValue = x : this.textValue = null;
      this.isTextError = this.showTextField && x.status === 'INVALID';
    });
    this.anchor.add(textFieldError);
  }

  public ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  setTextField(selectedOption: string): void {
    this.showTextField = selectedOption === 'other' || (this.textValue && this.textValue.length > 0);
    this.setTextValidation();
    this.setTextFieldAvailability(selectedOption);
  }

  setTextValidation(): void {
    const textField = this.form.get('otherText');
    this.showTextField
      ? textField.setValidators([TextInputValidator.containNotOnlySpaces, Validators.required, Validators.minLength(1)])
      : textField.setValidators(null);
  }

  setTextFieldAvailability(selectedOption): void {
    const textField = this.form.get('otherText');
    selectedOption !== 'other' && this.textValue && this.textValue.length
      ? textField.disable()
      : textField.enable();
  }

  submit(): void {
    if (this.form.valid) {
      const request: DataRequest = this.textValue
        ? { option: this.selectedOption, otherText: this.textValue}
        : { option: this.selectedOption};
      this.dataRequestService.sendDataRequest(request).subscribe(() => this.requestSubmitted = true);
      return;
    }

    this.isTextError = this.showTextField && this.form.get('otherText').status === 'INVALID';
  }

  close(): void {
    this.dialogRef.close();
  }
}
