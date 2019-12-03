import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    SimpleChanges
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CountryService } from '../../services/addressCountry.service';
import { AddressService } from '../../services/address.service';
import { CountryAddressInfoSummary } from '../../models/countryAddressInfoSummary';
import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';
import { CountryAddressInfo } from '../../models/countryAddressInfo';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import * as _ from 'underscore';
import {
    debounceTime,
    delay,
    filter,
    map,
    mergeMap,
    take,
    takeUntil,
    tap,
    distinctUntilChanged,
    startWith,
    catchError
} from 'rxjs/operators';

@Component({
    selector: 'ddp-address-input',
    template: `
        <form [formGroup]="addressForm" novalidate autocomplete="off">
            <div class="address-input-container">
                <mat-form-field>
                    <input matInput [placeholder]="getLabelForControl('name')" formControlName="name"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           uppercase (blur)="blurEventOccurred($event)" required>
                    <mat-error>{{getFieldErrorMessage('name')}}</mat-error>
                </mat-form-field>

                <mat-form-field>
                    <mat-select [placeholder]="getLabelForControl('country')" formControlName="country"
                                (blur)="blurEventOccurred($event)" required>
                        <mat-option [value]="">Choose {{getLabelForControl('country').toLowerCase()}}...</mat-option>
                        <mat-option *ngFor="let theCountry of (countries$ | async)" [value]="theCountry.code">
                            {{theCountry.name | uppercase}}
                        </mat-option>
                    </mat-select>
                    <mat-error>{{getFieldErrorMessage('country')}}</mat-error>
                </mat-form-field>

                <mat-form-field>
                    <input matInput #street1 [placeholder]="getLabelForControl('street1')" formControlName="street1"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           (addressChanged)="showAutocompleteAddress($event)"
                           (focus)="disableStreet1AutoFill()" (blur)="blurEventOccurred($event, 'street1')"
                           uppercase required addressgoogleautocomplete
                           [autocompleteRestrictCountryCode]="addressForm.get('country')?.value">
                    <mat-error>{{getFieldErrorMessage('street1')}}</mat-error>
                </mat-form-field>

                <mat-form-field>
                    <input matInput [placeholder]="getLabelForControl('street2')" formControlName="street2"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           (blur)="blurEventOccurred($event)" uppercase>
                    <mat-error>{{getFieldErrorMessage('street2')}}</mat-error>
                </mat-form-field>

                <mat-form-field>
                    <input matInput [placeholder]="getLabelForControl('city')" formControlName="city"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           (blur)="blurEventOccurred($event)" uppercase required>
                    <mat-error>{{getFieldErrorMessage('city')}}</mat-error>
                </mat-form-field>

                <ng-container *ngIf="getCountryInfo() | async as info; else defaultStateField">
                    <ng-container *ngIf="!info.stateCode">
                        <ng-container *ngIf="info.subnationalDivisionTypeName as stateLabel; else defaultStateField">
                            <ng-container *ngIf="hasStatesList(info); then showStateDropdown else showStateTextField">
                            </ng-container>

                            <ng-template #showStateDropdown>
                                <mat-form-field>
                                    <mat-select [placeholder]="stateLabel" formControlName="state"
                                                [attr.autocomplete]="autocompleteAttributeValue()"
                                                (blur)="blurEventOccurred($event)" required>
                                        <mat-option [value]="">Choose {{stateLabel.toLowerCase()}}...</mat-option>
                                        <mat-option *ngFor="let theState of info.subnationalDivisions"
                                                    [value]="theState.code">{{theState.name | uppercase}}
                                        </mat-option>
                                    </mat-select>
                                    <mat-error>{{getFieldErrorMessage('state')}}</mat-error>
                                </mat-form-field>
                            </ng-template>

                            <ng-template #showStateTextField>
                                <mat-form-field>
                                    <input matInput [placeholder]="stateLabel" formControlName="state"
                                           [name]="disableAutofill"
                                           [attr.autocomplete]="autocompleteAttributeValue()"
                                           (blur)="blurEventOccurred($event)" uppercase required>
                                    <mat-error>{{getFieldErrorMessage('state')}}</mat-error>
                                </mat-form-field>
                            </ng-template>
                        </ng-container>
                    </ng-container>
                </ng-container>

                <ng-template #defaultStateField>
                    <mat-form-field>
                        <input matInput placeholder="State" formControlName="state"
                               [name]="disableAutofill"
                               [attr.autocomplete]="autocompleteAttributeValue()"
                               (blur)="blurEventOccurred($event)" uppercase required>
                        <mat-error>{{getFieldErrorMessage('state')}}</mat-error>
                    </mat-form-field>
                </ng-template>

                <mat-form-field>
                    <input matInput [placeholder]="getLabelForControl('zip')" formControlName="zip"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           (blur)="blurEventOccurred($event)" uppercase required>
                    <mat-error>{{getFieldErrorMessage('zip')}}</mat-error>
                </mat-form-field>

                <mat-form-field>
                    <input matInput [placeholder]="getLabelForControl('phone')" formControlName="phone"
                           [name]="disableAutofill"
                           [attr.autocomplete]="autocompleteAttributeValue()"
                           (blur)="blurEventOccurred($event)" uppercase>
                    <mat-error>{{getFieldErrorMessage('phone')}}</mat-error>
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
        }`]
})

export class AddressInputComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /**
     * Specify default name. Will be ignored if we get the address from server
     * type {string}
     */
    @Input()
    name = '';
    /**
     * Country codes that will be included as options in form. Need to make sure they are supported in { CountryService }.
     * see (link https://en.wikipedia.org/wiki/List_of_postal_codes) for further info
     */
    @Input()
    countryCodes: string[];
    /**
     * Address to edit with this form.
     */
    @Input()
    address: Address;
    /**
     * Set the default country when blank form is loaded. Form starts with no country selected if this is not set.
     */
    @Input()
    defaultCountryCode: string | null = null;
    @Input()
    readonly = false;
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
    selectedCountryInfo$ = new BehaviorSubject<CountryAddressInfo | null>(null);
    /**
     * Flag to indicate whether this form has been filled out from data coming from outside the component
     * e.g., from Google Autocomplete or from the database
     * type {boolean}
     */
    formHasBeenFilled = false;
    addressForm: FormGroup;
    blurEventStream = new Subject<any>();
    // Get a handle on the street1 input field. Sometimes Google Autocomplete plays games on us
    @ViewChild('street1', { static: true }) street1;

    private ngUnsubscribe = new Subject();
    private cancelStreet1Blur$ = new Subject();

    // See if we can continue making stuff in form observable as much as possible
    constructor(
        private countryService: CountryService,
        private addressService: AddressService,
        private cdr: ChangeDetectorRef) {
        this.createForm();
    }

    ngOnInit(): void {
        this.setupCountryChangeHandler();
        // if we have an address at this point in lifecycle let's apply it
        this.setAddressValues(this.address);
        this.setupAddressChangeHandler();
    }

    ngAfterViewInit(): void {
        this.componentBusy.emit(false);
    }

    ngOnChanges(change: SimpleChanges): void {
        // first ngOnChanges happens before ngOnInit
        if (change['address']) {
            // this check here for first ngOnChanges without the form
            if (this.addressForm) {
                this.setAddressValues(this.address);
            }
        }
        if (!_.isUndefined(change['readonly'])) {
            ['country', 'name', 'street1', 'street2', 'city', 'state', 'zip', 'phone', 'guid'].forEach((propName) => {
                const formControl = this.addressForm.get(propName);
                // additional params to enable disable needed to prevent triggering .valueChanges in form!
                formControl && (this.readonly ? formControl.disable({ emitEvent: false, onlySelf: true }) :
                    formControl.enable({ emitEvent: false, onlySelf: true }));
            });
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    setupAddressChangeHandler(): void {
        // form element blurs will trigger emitting the address on hand
        this.blurEventStream.pipe(
            // the Chrome autofill might generate multiple blurs
            // no need to send multiple change events
            tap(() => this.componentBusy.emit(true)),
            debounceTime(250),
            tap(() => this.componentBusy.emit(false)),
            map(() => this.buildEnteredAddress()),
            // filter here checks that form was indeed user modified, not just
            // from, for example, suggestions being selected
            filter(() => this.addressForm.dirty),
            takeUntil(this.ngUnsubscribe)
        )
            .subscribe(this.valueChanged);
    }

    createForm(): void {
        const initialCountryCode = this.defaultCountryCode ? this.defaultCountryCode : '';
        this.addressForm = new FormGroup({
            name: new FormControl('', Validators.required),
            country: new FormControl(initialCountryCode, Validators.required),
            street1: new FormControl('', Validators.required),
            street2: new FormControl(''),
            zip: new FormControl(''),
            state: new FormControl(''),
            city: new FormControl('', Validators.required),
            phone: new FormControl(''),
            guid: new FormControl('')
        });
    }

    /**
     * When the street1 text field is entered, disable browser auto-fill since we have google's auto-suggestions.
     */
    disableStreet1AutoFill(): void {
        this.street1.nativeElement.autocomplete = 'nothing';
    }

    blurEventOccurred(event: any, label?: string): void {
        if (label === 'street1') {
            // When we exit the street1 text field, put auto-fill attribute back in
            // so it gets picked up when user auto-fills from other fields.
            this.street1.nativeElement.autocomplete = this.autocompleteAttributeValue();
            // filling out street1 can generate a field blur AND an addressChange from Google Places
            // we only want to process 1 of the two.
            // here we receive the blur and wait for a bit before sending it through.
            // takeUntil gives showAutocompleteAddress a chance to cancel the blur
            // and generate an updated address via that path
            of(event).pipe(
                tap(() => this.componentBusy.next(true)),
                delay(500),
                takeUntil(this.cancelStreet1Blur$),
                take(1))
                .subscribe(
                    event1 => this.blurEventStream.next(event1),
                    () => this.componentBusy.next(false),
                    () => this.componentBusy.next(false));
        } else {
            this.blurEventStream.next(event);
        }
    }

    /**
     * Used to directly set values in the form.
     * param {Address | null} address
     * param {boolean} markFieldsAsTouched sometimes we will want to mark the fields touched to trigger validation
     */
    setAddressValues(address: Address | null, markFieldsAsTouched = true): void {
        if (address) {
            // set the flag. Will prevent weird partial autofills from Chrome
            this.formHasBeenFilled = true;
            // If we are populating the form, let's mark the whole form as pure as snow
            this.addressForm.markAsPristine();
            // NB: order important here! Setting country changes what controls are available
            ['country', 'name', 'street1', 'street2', 'city', 'state', 'zip', 'phone', 'guid'].forEach((propName) => {
                const formControl = this.addressForm.get(propName);
                const newFieldValue = address[propName];
                if (formControl && newFieldValue !== formControl.value) {
                    formControl.patchValue(newFieldValue, { emitEvent: markFieldsAsTouched });
                    markFieldsAsTouched && formControl.markAsTouched();
                }
            });
        }
    }

    showAutocompleteAddress(autocompleteAddress: Address): void {
        this.disableStreet1AutoFill();
        if (!autocompleteAddress) {
            return;
        }
        this.componentBusy.next(true);
        // TODO: remove subscription inside subscription
        this.countries$.pipe(
            take(1))
            .subscribe((countries) => {
                // Trying a country we don't have?
                if (countries.filter((country) => country.code === autocompleteAddress.country).length !== 1) {
                    this.componentBusy.next(false);
                } else {
                    // the street1 blur needs to be cancelled. We are getting the address from
                    // autocomplete
                    this.cancelStreet1Blur$.next();
                    // combined the autocomplete address fields with fields that are not included (name and telephone)
                    // Also capitalize them. EasyPost is going to suggest to do it eventually
                    const enteredAddress = this.buildEnteredAddress();
                    // capitalize incoming text
                    _.keys(autocompleteAddress).forEach(key => {
                        _.isString(autocompleteAddress[key]) && (autocompleteAddress[key] = autocompleteAddress[key].toUpperCase());
                    });
                    autocompleteAddress.name = enteredAddress.name;
                    autocompleteAddress.phone = enteredAddress.phone;
                    // Lets see if we can get a suggestion from EasyPost. Might get an extended ZIP code.
                    // if it finds that the address is invalid (an exception occurs), let's just use the cleaned-up autocomplete
                    // address instead.
                    this.componentBusy.emit(true);
                    this.addressService.verifyAddress(autocompleteAddress).pipe(
                        take(1),
                        catchError(() => of(autocompleteAddress)))
                        .subscribe((suggestedAddress) => {
                            suggestedAddress.guid = this.addressForm.value.guid;
                            suggestedAddress.isDefault = true;
                            this.setAddressValues(suggestedAddress, true);
                            // This is a little hacky, but there is a weird interaction between
                            // the Google Autocomplete and the Angular FromGroup processing
                            // that sometimes leaves the input field not reflecting the FormControl value
                            // If we see the problem, here we try to set it right.
                            const street1FormValue = this.addressForm.get('street1') != null
                                ? (this.addressForm.get('street1')).value as AbstractControl : null;
                            if (this.street1.nativeElement.value !== street1FormValue) {
                                this.street1.nativeElement.value = street1FormValue;
                            }
                            this.valueChanged.emit(suggestedAddress);
                        }, () => console.error('Error occurred'),
                            () => this.componentBusy.emit(false));
                }
            });
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

    getCountryInfo(): Observable<CountryAddressInfo | null> {
        return this.selectedCountryInfo$.asObservable();
    }

    hasStatesList(info: CountryAddressInfo): boolean {
        return info.subnationalDivisions != null && info.subnationalDivisions.length > 0;
    }

    setupCountryChangeHandler(): void {
        // We are either going to include only the country codes specified in input param or all if not being used
        this.countries$ = this.countryCodes ?
            this.countryService.findCountryInfoSummariesByCode(this.countryCodes) : this.countryService.findAllCountryInfoSummaries();

        const countryControl = this.addressForm.get('country') as FormControl;
        const countryControlSub = countryControl.valueChanges.pipe(
            // needed to jump start form
            startWith(countryControl.value),
            distinctUntilChanged(),
            mergeMap((countryCode) => countryCode ? this.countryService.findCountryInfoByCode(countryCode) : of(null))
        ).subscribe(this.selectedCountryInfo$);

        this.selectedCountryInfo$.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe((selectedCountry) => {
                if (!selectedCountry) {
                    return;
                }

                let stateValue = this.addressForm.value.state;
                if (selectedCountry.subnationalDivisions && selectedCountry.subnationalDivisions.length > 0) {
                    const stateCodes = selectedCountry.subnationalDivisions.map(s => s.code);
                    if (stateCodes.indexOf(stateValue) === -1) {
                        stateValue = '';    // If current value not in states list, blank it out.
                    }
                }

                // Some countries have states others provinces
                if (selectedCountry.subnationalDivisionTypeName && selectedCountry.subnationalDivisions) {
                    this.addressForm.setControl(
                        'state',
                        new FormControl(
                            {
                                value: stateValue,
                                disabled: this.readonly
                            },
                            { validators: [Validators.required] }));
                }

                // zip, postal code, other? Might have a validator for it.
                this.addressForm.setControl(
                    'zip',
                    new FormControl(
                        {
                            value: this.addressForm.value.zip,
                            disabled: this.readonly
                        },
                        {
                            validators: [Validators.required, Validators.pattern(selectedCountry.postalCodeRegex)]
                        }));
                // Without this, page might still display previous zip errors
                this.cdr.detectChanges();
            },
                () => { },
                // trying to preserve reverse order of subscription here
                () => countryControlSub.unsubscribe());

    }

    /**
     * Build the error message to display
     *
     * param {string} formControlName
     * returns {any}
     */
    getFieldErrorMessage(formControlName: string): string | null {
        const control: AbstractControl | null = this.addressForm.get(formControlName);

        const errors = control ? control.errors : null;
        if (errors) {
            const fieldLabel = this.getLabelForControl(formControlName) ? this.getLabelForControl(formControlName) : '';
            if (errors.required) {
                return `${fieldLabel}  is required`;
            }
            if (errors.pattern) {
                return `${fieldLabel} has an invalid value`;
            }
            if (errors.verify) {
                return errors.verify;
            }
        }
        return null;
    }

    /**
     * Return the label to be displayed
     *
     * param {string} formControlName
     * returns {any}
     */
    getLabelForControl(formControlName: string): string {
        if (formControlName === 'zip') {
            const label = this.selectedCountryInfo$.getValue()
                ? (this.selectedCountryInfo$.getValue() as CountryAddressInfo).postalCodeLabel : '';
            return label ? label : 'Zip Code';
        } else if (formControlName === 'state') {
            const label = this.selectedCountryInfo$.getValue()
                ? (this.selectedCountryInfo$.getValue() as CountryAddressInfo).subnationalDivisionTypeName : '';
            return label ? label : 'State';
        }
        const controNameToLabelName = {
            name: 'Full Name',
            street1: 'Street Address',
            street2: 'Apt/Floor #',
            city: 'City',
            phone: 'Phone Number',
            country: 'Country/Territory'
        };

        return controNameToLabelName[formControlName];
    }

    public buildEnteredAddress(): Address {
        const formValue = this.addressForm.value;
        const country = this.selectedCountryInfo$.getValue();
        const enteredAddress = new Address();
        enteredAddress.country = country ? country.code : '';
        enteredAddress.street1 = formValue.street1 as string;
        enteredAddress.street2 = formValue.street2 as string;
        enteredAddress.city = formValue.city as string;
        // special case here for territories: state and country can be same. Check to see if country info has the state to use
        enteredAddress.state = (country && country.stateCode) ? country.stateCode : (formValue.state ? formValue.state : '');
        enteredAddress.zip = formValue.zip as string;
        enteredAddress.name = formValue.name as string;
        enteredAddress.phone = formValue.phone as string;
        enteredAddress.guid = formValue.guid as string;
        // todo hard-coded here
        enteredAddress.isDefault = true;
        return enteredAddress;

    }

    clearVerificationErrors(): void {
        _.values(this.addressForm.controls).forEach((control: FormControl) => {
            if (control.errors) {
                control.setErrors(_.omit(control.errors, 'verify'));
            }
        });
    }

    getAllErrors(): ValidationErrors[] {
        const errors: (ValidationErrors | null)[] = _.values(this.addressForm.controls).map(control => control.errors);
        return errors.filter(error => error != null) as ValidationErrors[];
    }

    displayVerificationErrors(errors: AddressError[]): void {
        if (errors && errors.length > 0) {
            errors.forEach((currError: AddressError) => {
                const errMessage = this.lookupErrorMessage(currError);
                // Got an error that matches one of our control names? Make sure it is displayed
                const control: AbstractControl | null = this.addressForm.get(currError.field);
                if (control) {
                    // Note that we set it as a "verify" error. We will treat this type of error differently
                    // than local validation errors
                    control.setErrors({ verify: errMessage });
                    control.markAsTouched();
                }
            });
        }
    }

    public get disableAutofill(): string {
        return `disable-autofill`;
    }

    private lookupErrorMessage(currError: AddressError): string {
        if (currError.field === 'country' && currError.message.indexOf('valid ISO 3166-1') !== -1) {
            // EasyPost doesn't have an error code for this, and we don't want to show a scary message to the user,
            // so let's match the string and tone it down.
            return this.getLabelForControl('country') + ' is required';
        }

        const CODE_TO_MESSAGE = {
            'E.HOUSE_NUMBER.INVALID': 'Street number could not be found'
        };
        return CODE_TO_MESSAGE[currError.code] ? CODE_TO_MESSAGE[currError.code] : currError.message;
    }
}
