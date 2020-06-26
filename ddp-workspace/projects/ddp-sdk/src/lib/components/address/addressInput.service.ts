import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { CountryAddressInfo } from '../../models/countryAddressInfo';
import { BehaviorSubject, merge, Observable, of, pipe, Subject, UnaryFunction, zip } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  pairwise,
  pluck,
  scan,
  share,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/addressCountry.service';
import * as _ from 'underscore';
import { Address } from '../../models/address';
import { AddressService } from '../../services/address.service';


type CountryCache = Record<string, CountryAddressInfo>;

export interface AddressInputComponentState {
  name: string;
  country: string;
  countryInfo?: CountryAddressInfo;
  street1: string;
  street2: string;
  city: string;
  zip: string;
  phone: string;
  guid: string;
  isReadOnly: boolean;
  formDataSource?: 'INPUT' | 'COMPONENT';
  formData: any;
}

@Injectable()
export class AddressInputService implements OnDestroy {
  /**
   * The formgroup used by the input form
   */
  readonly addressForm: FormGroup = this.createForm();
  /**
   * Incoming addresses
   */
  readonly inputAddress$ = new BehaviorSubject<Address | null>(null);
  /**
   * Set component to readonly mode
   */
  readonly inputIsReadOnly$ = new BehaviorSubject<boolean>(false);
  /**
   * The addresses generated from the input component
   */
  readonly addressOutputStream$: Observable<Address>;
  /**
   * Incoming google autocomplete addresses. Meant to be used with the Google Places Autocomplete
   */
  readonly googleAutocompleteAddress$ = new Subject<Address>();
  /**
   * Country info for currently selected country
   */
  readonly countryInfo$: Observable<CountryAddressInfo | null>;
  /**
   * Component busy indicator
   */
  readonly isBusy$: Observable<boolean>;

  readonly currentAddress$: Observable<Address>;
  /**
   * Postal code label
   */
  readonly postalCodeLabel$: Observable<string>;

  /**
   * Form State label
   */
  readonly stateLabel$: Observable<string>;

  ngUnsubscribe = new Subject<void>();

  constructor(private countryService: CountryService, private addressService: AddressService,
              private cdr: ChangeDetectorRef) {
    const countryCache = new BehaviorSubject<CountryCache>({});
    const countryCacheUpdates$ = new Subject<CountryAddressInfo>();
    // todo: can we factor this out as generic cache?

    countryCacheUpdates$.pipe(
      map(country => ({
          [country.code]: country
        }
      )),
      scan((cacheMap: CountryCache, codeToCountry) =>
        ({ ...cacheMap, ...codeToCountry }), {}),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(countryCache);

    // reusable operator. use or populate cache
    const cachingCountryInfoOp: UnaryFunction<Observable<string>, Observable<CountryAddressInfo>> = pipe(
      distinctUntilChanged(),
      switchMap((code: string) => {
        if (!code) return of(null);
        else if (countryCache.getValue()[code]) {
          return of(countryCache.getValue()[code]);
        } else {
          // if we got here, we did not find in cache
          // let's push into cache for next time
          return this.countryService.findCountryInfoByCode(code as string).pipe(
            tap(country => countryCacheUpdates$.next(country))
          );
        }
      }));


    const componentState$: Observable<AddressInputComponentState> = merge(
      // consolidate updates from form into one update
      // otherwise consumers could get a form value saying country code is US and country info a different
      // value
      // todo maybe some way to introduce derived updates and make it so state is updated atomically?
      this.addressForm.valueChanges.pipe(
        distinctUntilChanged((x, y) => _.isEqual(x, y)),
        concatMap((formValue) => {
          return of(formValue['country']).pipe(
            cachingCountryInfoOp,
            map(countryInfo => ({ country: countryInfo ? countryInfo.code : '', countryInfo })),
            map(countryInfoState => ({ ...{ formData: formValue }, ...countryInfoState, ...{ formDataSource: 'COMPONENT' } }))
          );
        }),
      ),

      this.inputIsReadOnly$.pipe(
        distinctUntilChanged(),
        map(val => ({ isReadOnly: val }))),

      this.inputAddress$.pipe(
        filter(address => !!address),
        concatMap((address) => {
          return of(address['country']).pipe(
            cachingCountryInfoOp,
            map(countryInfo => ({ country: (countryInfo ? countryInfo.code : ''), countryInfo })),
            map(countryInfoState => ({formData: address, ...countryInfoState, formDataSource: 'INPUT' }))
          );
        })
      )
    ).pipe(
      startWith(({
        ...{ formData: {}, formDataSource: 'COMPONENT' },
        ...{ countryInfo: null },
        ...{ isReadOnly: this.inputIsReadOnly$.getValue() }
      }) as AddressInputComponentState),
      scan((acc: AddressInputComponentState, change) => ({ ...acc, ...change })),
      // this replay here turns out to be important. Make sure everyone gets that first event
      shareReplay(1)
    );

    // extract for convenience
    this.countryInfo$ = componentState$.pipe(
      pluck('countryInfo'),
      distinctUntilChanged((x, y) => {
        if (x == null && y == null) return true;
        if (x == null && y != null) return false;
        if (x != null && y == null) return false;
        return x.code === y.code;
      })
    );

    this.postalCodeLabel$ = this.countryInfo$.pipe(
      map(country => (country && country.postalCodeLabel) ? country.postalCodeLabel : 'Zip Code'),
      startWith('Zip Code'),
      shareReplay(1)
    );

    this.stateLabel$ = this.countryInfo$.pipe(
      map(country => (country && country.subnationalDivisionTypeName) ? country.subnationalDivisionTypeName : 'State'),
      startWith('State'),
      shareReplay(1)
    );


    const isReadOnly$: Observable<boolean> = componentState$.pipe(
      pluck<AddressInputComponentState, 'isReadOnly'>('isReadOnly'),
      distinctUntilChanged((x, y) => {
        return x === y;
      }),
      share()
    );

    const isReadOnlyFormChanges$ = isReadOnly$.pipe(
      tap(readOnly => {
        ['country', 'name', 'street1', 'street2', 'city', 'state', 'zip', 'phone', 'guid']
          .forEach(controlName => {
            const formControl = this.addressForm.get(controlName);
            readOnly ?
              formControl.disable({ emitEvent: false, onlySelf: true }) :
              formControl.enable({ emitEvent: false, onlySelf: true });
          });
      })
    );

    const addressInputUpdates$ = this.inputAddress$.pipe(
      tap(address => {
        // want to set values coming in from outside component without triggering value change in form
        this.setAddressValues(address, true, false);
      }));

    // this is the address that we are building from data in the form
    // todo: can we factor out all these distinctUntilChanged. We have them everywhere
    const formAddress$: Observable<Address> = componentState$.pipe(
      filter((compState) => compState.formDataSource === 'COMPONENT'),
      // only care about changes
      distinctUntilChanged((x, y) => _.isEqual(x.formData, y.formData)),
      // but don't care about initial state
      skip(1),
      map(compState => this.buildAddressFromFormData(compState.formData, compState.countryInfo)),
      distinctUntilChanged((x, y) => _.isEqual(x, y)),
      share());

    const street1Changed$: Observable<boolean> = formAddress$.pipe(
      pluck('street1'),
      startWith(null as string | null),
      pairwise(),
      map(([prev, current]) => prev !== current),
      startWith(false),
      share());

    // if street1 changed, user is actually typing a value or trying to use google autocomplete
    // since we don't know what they are up to, we will wait before we push the address
    // if we get an autocomplete google address, then we won't push the form address
    // Note that for this work properly we should always get a properly paired of address and street1Changed
    const cancelableFormAddress$ = street1Changed$.pipe(withLatestFrom(formAddress$)).pipe(
      concatMap(([streetChanged, address]) =>
        of(streetChanged).pipe(
            delay(streetChanged ? 3000 : 0),
            mapTo(address),
            // If autocomplete address has come in during our delay, we don't emit the form address
            takeUntil(this.googleAutocompleteAddress$),
            take(1)
        )),
      share());

    // some processing to add name and phone to Google autocomplete to have a full Pepper address
    const cleanedGoogleAutocompleteAddress$: Observable<Address> = this.googleAutocompleteAddress$.pipe(
      withLatestFrom(componentState$),
      map(([autoComplete, componentState]) =>
        this.buildAutoCompleteAddress(autoComplete, componentState.formData.name, componentState.formData.phone)));

    // See if EasyPost has some fixes and updates to the original Google autocomplete address
    const easyPostFilteredGoogleAddress$ = cleanedGoogleAutocompleteAddress$.pipe(
      withLatestFrom(componentState$),
      concatMap(([googleAddress, componentState]) =>
        this.addressService.verifyAddress(googleAddress).pipe(
          catchError(() => {
            console.debug('had an error calling easypost');
            return of(googleAddress);
          }),
          map(verifyResponse => new Address({ ...verifyResponse, ...{ guid: componentState.formData.guid } }))
        )
      ),
      share());

    interface AddressWithSource {
      address: Address;
      fromGoogle?: boolean;
    }

    // let's merge the two sources of addresses and add attribute fromGoogle to identify which one we have
    const addressWithSource$: Observable<AddressWithSource> = merge(
      easyPostFilteredGoogleAddress$.pipe(map((googleAddress) => ({ address: googleAddress, fromGoogle: true }))),
      cancelableFormAddress$.pipe(map(formAddress => ({ address: formAddress, fromGoogle: false }))))
      .pipe(
        tap((addressWithSource: AddressWithSource) => {
          this.setAddressValues(addressWithSource.address, false, false);
        })
      );

    this.addressOutputStream$ = addressWithSource$.pipe(
      map((addressWithSource) => addressWithSource.address),
      share()
    );

    // We are going to define start of busyness with the form changing
    // and busyness ending with an address coming out on the other end
    const busyCounterInputs$: Observable<number> = merge(
      formAddress$.pipe(mapTo(1)),
      this.addressOutputStream$.pipe(mapTo(-1))
    );

    this.isBusy$ = busyCounterInputs$.pipe(
      scan((acc, val) => acc + val, 0),
      map(val => val > 0),
    );

    // update controls
    const countryInfoFormChanges$ = this.countryInfo$.pipe(
      tap((countryInfo) => {
        if (!countryInfo || !this.addressForm) return;
        this.addressForm.get('zip').setValidators([Validators.required, Validators.pattern(countryInfo.postalCodeRegex)]);
      }));

    // todo: does this not provide the initial state of the form?
    this.currentAddress$ = componentState$.pipe(
      map(compState => this.buildAddressFromFormData(compState.formData, compState.countryInfo)),
      shareReplay(1)
    );

    // shoot for single subscribe
    merge(
      countryInfoFormChanges$,
      isReadOnlyFormChanges$,
      addressInputUpdates$
    ).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

  }

  createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      street1: new FormControl('', Validators.required),
      street2: new FormControl(''),
      zip: new FormControl(''),
      state: new FormControl(''),
      city: new FormControl('', Validators.required),
      phone: new FormControl(''),
      guid: new FormControl('')
    }, { updateOn: 'blur' });
  }

  /**
   * Used to directly set values in the form.
   * param {Address | null} address
   * param {boolean} emitValueChange if true (default) underlying form control will emit valueChange
   * param {boolean} markFieldsAsTouched sometimes we will want to mark the fields touched to trigger validation
   */
  setAddressValues(address: Address | null, markFieldsAsTouched = true, emitValueChange = true): void {
    if (address) {
      // set the flag. Will prevent weird partial autofills from Chrome
      //     this.formHasBeenFilled = true;
      // If we are populating the form, let's mark the whole form as pure as snow
      this.addressForm.markAsPristine();
      // NB: order important here! Setting country changes what controls are available
      ['country', 'name', 'street1', 'street2', 'city', 'state', 'zip', 'phone', 'guid'].forEach((propName) => {
        const formControl = this.addressForm.get(propName);
        const newFieldValue = address[propName];
        if (formControl && newFieldValue !== formControl.value) {
          formControl.patchValue(newFieldValue, { emitEvent: emitValueChange });
        }
        markFieldsAsTouched && formControl.markAsTouched();
      });
      // this line really does look necessary after some updates
      // particularly if updating the FormGroup with data and place holders in fields
      // don't respond to having a value
      this.cdr.detectChanges();
    }
  }

  private buildAddressFromFormData(formValue: any, country: CountryAddressInfo): Address {
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

  private buildAutoCompleteAddress(autocompleteAddress: Address, name: string, phone: string): Address {
    console.debug('Processing showAutomcoplete with:' + JSON.stringify(autocompleteAddress));

    const localAutocompleteAddress = new Address(autocompleteAddress);
    // capitalize incoming text
    _.keys(localAutocompleteAddress).forEach(key => {
      _.isString(localAutocompleteAddress[key]) && (localAutocompleteAddress[key] = localAutocompleteAddress[key].toUpperCase());
    });
    localAutocompleteAddress.name = name;
    localAutocompleteAddress.phone = phone;
    return localAutocompleteAddress;

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


}
