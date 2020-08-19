import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { CountryService } from '../../services/addressCountry.service';
import { CountryAddressInfoSummary } from '../../models/countryAddressInfoSummary';
import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';
import { CountryAddressInfo } from '../../models/countryAddressInfo';
import { merge, Observable, of, Subject, zip } from 'rxjs';
import * as _ from 'underscore';
import { mergeMap, take, takeUntil, tap } from 'rxjs/operators';
import { AddressInputService } from '../address/addressInput.service';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'ddp-address-input',
  template: `
    <form [formGroup]="ais.addressForm" novalidate autocomplete="off">
      <div class="address-input-container">
        <mat-form-field>
          <input matInput [placeholder]="getLabelForControl('name') | async"
                 [name]="disableAutofill"
                 [attr.autocomplete]="autocompleteAttributeValue()"
                 formControlName="name"
                 uppercase
                 required>
          <mat-error>{{getFieldErrorMessage('name') | async}}</mat-error>
        </mat-form-field>
        <mat-form-field *ngIf="!country">
          <mat-select [placeholder]="getLabelForControl('country') | async"
                      formControlName="country"
                      required>
            <mat-option [value]="">{{'SDK.MailAddress.Fields.Choose' | translate: {field: (getLabelForControl('country') | async)} }}</mat-option>
            <mat-option *ngFor="let theCountry of (countries$ | async)" [value]="theCountry.code">
              {{theCountry.name | uppercase}}
            </mat-option>
          </mat-select>
          <mat-error>{{getFieldErrorMessage('country') | async}}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput #street1 [placeholder]="getLabelForControl('street1') | async"
                 formControlName="street1"
                 uppercase
                 required
                 addressgoogleautocomplete
                 (addressChanged)="ais.googleAutocompleteAddress$.next($event)"
                 [autocompleteRestrictCountryCode]="ais.addressForm.get('country')?.value || country">
          <mat-error>{{getFieldErrorMessage('street1') | async}}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput [placeholder]="getLabelForControl('street2') | async"
                 [name]="disableAutofill"
                 [attr.autocomplete]="autocompleteAttributeValue()"
                 formControlName="street2"
                 uppercase>
          <mat-error>{{getFieldErrorMessage('street2') | async}}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput [placeholder]="getLabelForControl('city') | async" formControlName="city"
                 [name]="disableAutofill"
                 [attr.autocomplete]="autocompleteAttributeValue()"
                 uppercase required>
          <mat-error>{{getFieldErrorMessage('city') | async}}</mat-error>
        </mat-form-field>

        <ng-container *ngIf="ais.countryInfo$ | async as info; else defaultStateField">
          <ng-container *ngIf="hasStatesList(info); then showStateDropdown else showStateTextField">
          </ng-container>

          <ng-template #showStateDropdown>
            <mat-form-field>
              <mat-select [placeholder]="getLabelForControl('state') | async" formControlName="state" required>
                <mat-option [value]="">{{'SDK.MailAddress.Fields.Choose' | translate: {field: (getLabelForControl('state') | async)} }}</mat-option>
                <mat-option *ngFor="let theState of info.subnationalDivisions"
                            [value]="theState.code">{{theState.name | uppercase}}
                </mat-option>
              </mat-select>
              <mat-error>{{getFieldErrorMessage('state') | async}}</mat-error>
            </mat-form-field>
          </ng-template>

          <ng-template #showStateTextField>
            <mat-form-field>
              <input matInput [placeholder]="getLabelForControl('state') | async"
                     [name]="disableAutofill"
                     [attr.autocomplete]="autocompleteAttributeValue()"
                     formControlName="state"
                     uppercase
                     required>
              <mat-error>{{getFieldErrorMessage('state') | async}}</mat-error>
            </mat-form-field>
          </ng-template>
        </ng-container>

        <ng-template #defaultStateField>
          <mat-form-field>
            <input matInput [placeholder]="getLabelForControl('state') | async"
                   [name]="disableAutofill"
                   [attr.autocomplete]="autocompleteAttributeValue()"
                   formControlName="state"
                   uppercase
                   required>
            <mat-error>{{getFieldErrorMessage('state') | async}}</mat-error>
          </mat-form-field>
        </ng-template>

        <mat-form-field>
          <input matInput [placeholder]="getLabelForControl('zip') | async"
                 [name]="disableAutofill"
                 [attr.autocomplete]="autocompleteAttributeValue()"
                 formControlName="zip"
                 uppercase
                 required>
          <mat-error>{{getFieldErrorMessage('zip') | async}}</mat-error>
        </mat-form-field>

        <mat-form-field>
          <input matInput [placeholder]="getLabelForControl('phone') | async"
                 [name]="disableAutofill"
                 [attr.autocomplete]="autocompleteAttributeValue()"
                 formControlName="phone"
                 uppercase
                 [required]="phoneRequired">
          <mat-error>{{getFieldErrorMessage('phone') | async}}</mat-error>
        </mat-form-field>

        <input type="hidden" formControlName="guid"/>
      </div>
    </form>
  `,
  styles: [
      `.address-input-container {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin:0;
    }`],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class AddressInputComponent implements OnInit, OnDestroy {
  /**
   * Country codes that will be included as options in form. Need to make sure they are supported in { CountryService }.
   * see (link https://en.wikipedia.org/wiki/List_of_postal_codes) for further info
   */

  /**
   * Address to edit with this form.
   */
  @Input()
  set address(address: Address) {
    console.debug('setting address:' + JSON.stringify(address));
    this.ais.inputAddress$.next(address);
  }
  @Input()
  set readonly(val: boolean) {
    this.ais.inputIsReadOnly$.next(val);
  }
  @Input()
  country: string | null;

  /**
   * Set the errors in the input component. If list is empty, errors will be cleared.
   */
  @Input()
  set addressErrors(addressErrors: AddressError[]) {
    this.displayVerificationErrors(addressErrors);
  }

  @Input()
  phoneRequired = false;

  /**
   * Will emit event with address as it changes in form
   * If contents of form elements are modified we will emit null
   * type {EventEmitter<Address|null>}
   */
  @Output()
  valueChanged = new EventEmitter<Address | null>();

  /**
   * Emit flag indicating if component is busy doing work, particularly communicating with an external service
   */
  @Output()
  componentBusy = new EventEmitter<boolean>(true);

  countries$: Observable<CountryAddressInfoSummary[]>;

  // Get a handle on the street1 input field. Sometimes Google Autocomplete plays games on us
  @ViewChild('street1', {static: true})
  street1Input: ElementRef;

  public ais: AddressInputService;

  private ngUnsubscribe = new Subject();

  // See if we can continue making stuff in form observable as much as possible
  constructor(
    private countryService: CountryService,
    private addressService: AddressService,
    private cdr: ChangeDetectorRef,
    private ngxTranslate: NGXTranslateService) {
    this.ais = new AddressInputService(this.countryService, this.addressService, this.cdr, this.phoneRequired);
  }

  ngOnInit(): void {
    // countries is constant
    this.countries$ = this.countryService.findAllCountryInfoSummaries();

    // update street1 field if needed
    const syncStreet1FieldValue$ = this.ais.addressOutputStream$.pipe(
      tap(newAddress => this.syncNativeStreet1WithForm(newAddress.street1))
    );

    const valueChangedEmit$ = this.ais.addressOutputStream$.pipe(
      tap(val => this.valueChanged.emit(val)),
    );
    const componentBusyEmit$ = this.ais.isBusy$.pipe(
      tap(val => this.componentBusy.emit(val))
    );


    // shoot for single subscribe
    merge(
      syncStreet1FieldValue$,
      valueChangedEmit$,
      componentBusyEmit$,
    ).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

    this.valueChanged.subscribe((address) => console.debug('the address we got was:' + JSON.stringify(address)));
    this.componentBusy.subscribe((isBusy) => console.debug('is busy?:' + isBusy));
    this.setupBlockChromeStreet1Autofill();

  }
  // latest hack to try and block Chrome's form autofill
  private setupBlockChromeStreet1Autofill(): void {
    const observerHack = new MutationObserver(() => {
      observerHack.disconnect();
      this.street1Input.nativeElement.setAttribute('autocomplete', 'new-password');
    });

    observerHack.observe(this.street1Input.nativeElement, {
      attributes: true,
      attributeFilter: ['autocomplete']
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private syncNativeStreet1WithForm(street1ValFromForm: string | null): void {
    if (this.street1Input.nativeElement.value !== street1ValFromForm) {
      this.street1Input.nativeElement.value = street1ValFromForm;
    }
  }

  /**
   * Will try to disable browser autofill if we have filled the form already from data coming outside
   * of component.
   * returns {string}
   */
  autocompleteAttributeValue(): string {
    // apparently only way to disable Chrome autofill is by giving it an unexpected value
    // Nothing special about 'nothing'
    return 'nothing';
  }

  hasStatesList(info: CountryAddressInfo): boolean {
    return info.subnationalDivisions != null && info.subnationalDivisions.length > 0;
  }

  /**
   * Build the error message to display
   *
   * param {string} formControlName
   * returns {any}
   */
  getFieldErrorMessage(formControlName: string): Observable<string | null> {
    const control: AbstractControl | null = this.ais.addressForm.get(formControlName);
    const errors = control ? control.errors : null;
    const transErrorKeyPrefix = 'SDK.MailAddress.Error.';
    if (errors) {
      return this.getLabelForControl(formControlName).pipe(
          mergeMap(fieldLabel => {
            if (errors.required) {
              return this.ngxTranslate.getTranslation(`${transErrorKeyPrefix}FieldIsRequired`, {field: fieldLabel});
            }
            if (errors.pattern) {
              return this.ngxTranslate.getTranslation(`${transErrorKeyPrefix}FieldIsInvalid`, {field: fieldLabel});
            }
            if (errors.verify) {
              return of(errors.verify);
            }
          }));
    } else {
      of(null);
    }
  }

  /**
   * Return the label to be displayed
   *
   * param {string} formControlName
   * returns {any}
   */

  public getLabelForControl(formControlName: string): Observable<string> {
    const fieldKey = this.buildFieldTranslationKey(formControlName);
    if (formControlName === 'zip') {
      return this.ais.postalCodeLabel$.pipe(
          mergeMap(postalCodeString => this.ngxTranslate.getTranslation(`${fieldKey}.${postalCodeString}`)));

    } else if (formControlName === 'state') {
      return this.ais.stateLabel$.pipe(
          mergeMap(stateString => this.ngxTranslate.getTranslation(`${fieldKey}.${stateString}`)));
    } else {
      return this.ngxTranslate.getTranslation(fieldKey);
    }
  }

  private buildFieldTranslationKey(formControlName: string): string {
    return 'SDK.MailAddress.Fields.' + formControlName[0].toUpperCase() + formControlName.substring(1);
  }

  public displayVerificationErrors(errors: AddressError[]): void {
    if (errors.length > 0) {
      errors.forEach((currError: AddressError) => {
        of(currError.message).pipe(
          take(1))
          .subscribe(errMessage => {
            // Got an error that matches one of our control names? Make sure it is displayed
            const control: AbstractControl | null = this.ais.addressForm.get(currError.field);
            if (control) {
              // Note that we set it as a "verify" error. We will treat this type of error differently
              // than local validation errors
              control.setErrors({ verify: errMessage });
              control.markAsTouched();
            }
          });
      });
    } else {
      this.clearVerificationErrors();
    }
  }
  private clearVerificationErrors(): void {
    _.values(this.ais.addressForm.controls).forEach((control: FormControl) => {
      if (control.errors) {
        control.setErrors(_.omit(control.errors, 'verify'));
      }
    });
  }

  public get disableAutofill(): string {
    return `disable-autofill`;
  }
}
