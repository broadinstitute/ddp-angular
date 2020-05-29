import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';
import { AddressVerificationStatus } from '../../models/addressVerificationStatus';
import * as util from 'underscore';
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeMap,
  pluck,
  scan,
  share,
  shareReplay,
  skip,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { AddressInputComponent } from './addressInput.component';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { generateTaggedAddress, isStreetRequiredError } from './addressUtils';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AddressVerificationWarnings } from '../../models/addressVerificationWarnings';

interface ComponentState {
  inputAddress: Address | null;
  isReadOnly: boolean;
  activityInstanceGuid: string | null;
  showSuggestion: boolean;
  enteredAddress: Address | null;
  suggestedAddress: Address | null;
  formErrorMessages: string[];
  formWarningMessages: string[];
  fieldErrors: AddressError[];
  warnings?: AddressVerificationWarnings;
}
interface AddressSuggestion {
  entered: Address;
  suggested: Address;
  warnings: AddressVerificationWarnings;
}

@Component({
    selector: 'ddp-address-embedded',
    template: `
    <p *ngIf="block.titleText" class="ddp-address-embedded__title" [innerHTML]="block.titleText"></p>
    <p *ngIf="block.subtitleText" class="ddp-address-embedded__subtitle" [innerHTML]="block.subtitleText"></p>
    <ddp-address-input
            (valueChanged)="inputComponentAddress$.next($event)"
            [address]="inputAddress$ | async"
            [addressErrors]="addressErrors$ | async"
            [readonly]="isReadOnly$ | async"
            (componentBusy)="isInputComponentBusy$.next($event)"></ddp-address-input>
    <ddp-validation-message
            *ngIf="(errorMessagesToDisplay$ | async).length > 0"
            [message]="(errorMessagesToDisplay$ | async).join(' ')">
    </ddp-validation-message>
    <form [formGroup]="suggestionForm" novalidate>
        <mat-card id="suggestionMatCard" *ngIf="suggestionInfo$ | async as info">
            <mat-card-header>
                <mat-card-title>We have checked your address entry and have suggested changes that could help ensure
                    delivery.
                </mat-card-title>
                <mat-card-subtitle>Click "Suggested" to update form. You will be able to click "As entered" to restore your
                    original entries.
                </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
                <mat-radio-group class="suggestion-radio-group"
                                 formControlName="suggestionRadioGroup">
                    <mat-radio-button class="margin-5" value="suggested" [disableRipple]="true">
                        <b>Suggested: </b>
                        <span class="suggested"
                              [innerHTML]="convertToFormattedString(generateTaggedAddress(info.entered, info.suggested,'b'))"></span>
                    </mat-radio-button>
                    <mat-radio-button class="margin-5" value="entered" [disableRipple]="true">
                        <b>As entered: </b>{{ convertToFormattedString(info.entered) }}
                    </mat-radio-button>
                </mat-radio-group>
            </mat-card-content>
        </mat-card>
    </form>`,
    styles: [
        `.suggestion-radio-group {
            display: inline-flex;
            flex-direction: column;
            width: calc(100% - 2px); /* needed for IE 11 */
        }

      .margin-5 {
          margin: 5px;
      }

      :host ::ng-deep .suggested b {
          border: 1px solid red;
      }

      /* Needed to keep suggestion text inside enclosing box. Don't believe compiler warning "never used"! */
      :host ::ng-deep .mat-radio-label {
          white-space: normal;
      }
    `]
})
export class AddressEmbeddedComponent implements OnDestroy, OnInit {
  @Input() block: MailAddressBlock;

  @Input()
  public set readonly(val: boolean) {
    this.stateUpdates$.next({ isReadOnly: val });
  }

  @Input()
  public set address(val: Address | null) {
    this.stateUpdates$.next({ inputAddress: val });
  }

  /**
   * Activity instance guid associated that contains this component
   * Will be used to maintain reference to mail address data until
   * a "Save" event is received.
   */
  @Input()
  public set activityGuid(val: string | null) {
    this.stateUpdates$.next({ activityInstanceGuid: val });
  }

  /**
   * Will emit an address whenever it is saved
   * type {EventEmitter<Address>}
   */
  @Output()
  public valueChanged = new EventEmitter<Address>();
  /**
   * Will emit update to indicate if the mail address is considered to be valid
   * If we are about to check the address because something changed
   * we will also be emitting a false.
   * If address does not exist (never saved) and blank we will emit a true to start.
   * If address exists we will emit true at start.
   * If we have a temporary address at start, we will emit the result of computing the validation of it
   * We will continue to emit updates as the address fields change. A blank never saved address will be valid
   */
  @Output()
  validStatusChanged = new EventEmitter<boolean>();

  /**
   * If component is busy doing something, including saving or verifying an address emit a true
   * Emit a false when done
   */
  @Output()
  componentBusy = new EventEmitter<boolean>(true);

  @ViewChild(AddressInputComponent, { static: true }) addressInputComponent: AddressInputComponent;
  public formErrorMessages$: Observable<string[]>;
  public errorMessagesToDisplay$: Observable<string[]>;
  public suggestionForm: FormGroup;
  public isInputComponentBusy$ = new BehaviorSubject<boolean>(false);
  // variables for template
  public suggestionInfo$: Observable<AddressSuggestion | null>;
  public inputAddress$: Observable<Address | null>;
  public addressErrors$: Observable<AddressError[]>
  public isReadOnly$: Observable<boolean>;
  public inputComponentAddress$ = new Subject<Address | null>();
  public generateTaggedAddress = generateTaggedAddress;

  private ngUnsubscribe = new Subject();
  private saveTrigger$ = new Subject<void>();
  private state$: Observable<ComponentState>;
  private stateUpdates$ = new Subject<Partial<ComponentState>>();


  constructor(
    private addressService: AddressService,
    private cdr: ChangeDetectorRef,
    @Optional() private submitService: SubmitAnnouncementService
  ) {
    this.suggestionForm = new FormGroup({
      suggestionRadioGroup: new FormControl('entered')
    });
    this.initializeComponentState();
  }

  private initializeComponentState(): void {
    const initialState: ComponentState = {
      inputAddress: null,
      isReadOnly: false,
      activityInstanceGuid: null,
      showSuggestion: false,
      enteredAddress: null,
      suggestedAddress: null,
      formWarningMessages: [],
      formErrorMessages: [],
      fieldErrors: []
    };

    this.state$ = this.stateUpdates$.pipe(
      startWith(initialState),
      scan((acc: ComponentState, update) => ({ ...acc, ...update })),
      tap(state =>  console.debug('New embeddedComponentState$=%o', state)),
      shareReplay(1)
    );
    this.state$.subscribe();
  }

  ngOnInit(): void {
    this.setupActions();
  }

  setupActions(): void {
    const verificationError$ = new Subject<any>();
    const addressSuggestion$ = new Subject<AddressSuggestion | null>();

    const busyCounter$ = new BehaviorSubject(0);

    const isThisComponentBusy$ = busyCounter$.pipe(
      scan((acc, val) => acc + val, 0),
      map(val => val > 0),
      distinctUntilChanged()
    );

    const initializeStateAction$ = this.state$.pipe(
      take(1),
      tap(() => busyCounter$.next(1)),
      mergeMap((state) => this.addressService.findDefaultAddress().pipe(
        map(defaultAddress => [state, defaultAddress]))
      ),
      tap(([state, defaultAddress]) =>
        defaultAddress && this.stateUpdates$.next({ inputAddress: defaultAddress as Address })),
      // filter for case where we need to go on to look for a temp address?
      filter(([state, defaultAddress]) => !defaultAddress && !!(state as ComponentState).activityInstanceGuid),
      map(([state, _]) => state as ComponentState),
      mergeMap((state) => this.addressService.getTempAddress(state.activityInstanceGuid)),
      tap((tempAddress) => tempAddress && this.stateUpdates$.next({ inputAddress: tempAddress as Address })),
      // fake that the address was just entered. Perhaps this can become a separate subject?
      // guess we are saving temp address again. No harm but not nice either.
      tap((tempAddress) => this.inputComponentAddress$.next(tempAddress)),
      finalize(() => busyCounter$.next(-1))
    );

    // derived observables
    this.isReadOnly$ = this.state$.pipe(
      pluck('isReadOnly'),
      distinctUntilChanged(),
      shareReplay()
    );

    this.inputAddress$ = this.state$.pipe(
      pluck('inputAddress'),
      shareReplay()
    );

    this.formErrorMessages$ = this.state$.pipe(
      pluck('formErrorMessages'),
      distinctUntilChanged((x, y) => util.isEqual(x, y)),
      shareReplay()
    );

    this.addressErrors$ = this.state$.pipe(
      pluck('fieldErrors'),
      shareReplay()
    );

    this.suggestionInfo$ = this.state$.pipe(
      map(state => state.showSuggestion && !this.readonly ?
                {suggested: state.suggestedAddress,
                  entered: state.enteredAddress,
                  warnings: state.warnings} : null),
      shareReplay(1)
    );

    this.errorMessagesToDisplay$ = this.state$.pipe(
        map(state => state.formErrorMessages.concat(state.formWarningMessages)),
        distinctUntilChanged((x, y) => util.isEqual(x, y)),
        shareReplay(1)
    );

    const setupSuggestedAddressFormControl$ = this.suggestionInfo$.pipe(
      filter(info => !!info),
      distinctUntilChanged((x, y) => util.isEqual(x, y)),
      tap(() => this.suggestionForm.get('suggestionRadioGroup').patchValue('entered'))
    );

    const currentAddress$: Observable<Address | null> = merge(
      this.inputAddress$,
      this.inputComponentAddress$
    ).pipe(
      shareReplay(1)
    );

    const verifyInputComponentSparseAddress$ = this.inputComponentAddress$.pipe(
      filter(address => !this.enoughDataToVerify(address)),
      tap(address => addressSuggestion$.next(null)),
      map(address => [address, this.computeValidityForSparseAddress(address)]),
      tap(([address, isValid]) => {
        if (address && !isValid) {
          this.stateUpdates$.next({ formErrorMessages: ['Invalid address'] });
        } else {
          this.stateUpdates$.next({ formErrorMessages: [] });
        }
      })
    );

    const verifyInputComponentAddressAction$ = this.inputComponentAddress$.pipe(
      filter(address => this.enoughDataToVerify(address)),
      tap(address => addressSuggestion$.next(null)),
      tap(() => busyCounter$.next(1)),
      switchMap(inputAddress =>
        this.addressService.verifyAddress(inputAddress).pipe(
          map(verifyResponse => ({ entered: inputAddress,
                                    suggested: new Address(verifyResponse),
                                    warnings: verifyResponse.warnings }) as AddressSuggestion),
          tap((addressSuggestion) => addressSuggestion$.next(addressSuggestion)),
          catchError((error) => {
            verificationError$.next(error);
            return of(null);
          })
        )
      ),
      tap(() => busyCounter$.next(-1)),
    );


    const handleAddressSuggestionAction$ = addressSuggestion$.pipe(
      tap(() => this.stateUpdates$.next({ fieldErrors: []})),
      filter(suggestion => !!suggestion),
      tap((addressSuggestion) => {
        const suggested = addressSuggestion.suggested;
        const entered = addressSuggestion.entered;
        // copy data that would not be in suggestion
        suggested.isDefault = entered.isDefault;
        suggested.guid = entered.guid;
        // showing suggestion only if it differs from entered address
        // we might have warning messages for the entered address
        const enteredWarningMessages = addressSuggestion.warnings.entered.map(each => each.message);
        if (!suggested.hasSameDataValues(entered)) {
          this.stateUpdates$.next({ formErrorMessages: [], formWarningMessages: enteredWarningMessages,
            warnings: addressSuggestion.warnings, suggestedAddress: suggested, enteredAddress: entered, showSuggestion: true });
        } else {
          this.stateUpdates$.next({ formErrorMessages: [], formWarningMessages: enteredWarningMessages,
            warnings: addressSuggestion.warnings, suggestedAddress: null, enteredAddress: null, showSuggestion: false });
        }
      })
    );

    type SuggestionOption = 'suggested' | 'entered';
    const suggestionRadioValue$: Observable<SuggestionOption> = this.suggestionForm.valueChanges.pipe(
        // skip initial invocation. A setup artifact.
        skip(1),
        map(formValue => formValue.suggestionRadioGroup as SuggestionOption),
        distinctUntilChanged(),
        share());

    const handleSelectedWarnings$ = suggestionRadioValue$.pipe(
        withLatestFrom(this.suggestionInfo$),
        tap(([radioValue, suggestionInfo]) =>
            this.stateUpdates$.next({
              formWarningMessages: suggestionInfo ? suggestionInfo.warnings[radioValue].map(warn => warn.message) : []
            })),
        share()
    );

    const selectedAddress$: Observable<Address> = suggestionRadioValue$.pipe(
      withLatestFrom(this.suggestionInfo$),
      map(([radioValue, suggestionInfo]) => (radioValue === 'suggested') ? suggestionInfo.suggested : suggestionInfo.entered),
      share()
    );

    const updateInputComponentWithSelectedAddress$: Observable<Address> = selectedAddress$.pipe(
      tap(address => this.stateUpdates$.next({inputAddress: address}))
    );

    // saving addresses coming from either the inputcomponent or that have been selected from suggestion radio group
    const saveTempCurrentAddressAction$ = merge(
      currentAddress$
    ).pipe(
      distinctUntilChanged((x, y) => util.isEqual(x, y)),
      withLatestFrom(this.state$),
      filter(([addrss, state]) => !!addrss && (!addrss.guid || !addrss.guid.trim()) && !!state.activityInstanceGuid),
      tap(() => busyCounter$.next(1)),
      concatMap(([addrss, state]) => this.addressService.saveTempAddress(addrss, state.activityInstanceGuid)),
      catchError((error) => {
        console.debug('there was a problems saving temp address:' + error);
        return of(null);
      }),
      tap(() => busyCounter$.next(-1))
    );

    let processSubmitAnnouncement$;
    if (this.submitService) {
      processSubmitAnnouncement$ = this.submitService.submitAnnounced$.pipe(
        tap(() => this.saveTrigger$.next()
        ));
    }


    const isVerificationStatusError = (error: any) => error && error.errors && error.errors.length > 0 && error.code;

    const clearSuggestionDisplay = () => this.stateUpdates$.next({ showSuggestion: false, suggestedAddress: null });

    const processVerificationStatusErrorAction$ = verificationError$.pipe(
      filter((error) => isVerificationStatusError(error)),
      tap(verificationError => console.debug('about to process verification error:' + JSON.stringify(verificationError))),
      tap(clearSuggestionDisplay),
      map((error) => error as AddressVerificationStatus),
      map((status) => {
        status.errors.sort((a, b) => {
            // Put the "not found" error last, so that error message display reads a bit nicer.
            if (a.code === 'E.ADDRESS.NOT_FOUND') {
              return 1;
            } else if (b.code === 'E.ADDRESS.NOT_FOUND') {
              return -1;
            } else {
              return 0;
            }
          }
        );
        return status;
      }),
      tap((verError: AddressVerificationStatus) => {

        const errorUpdate: Partial<ComponentState> = { formErrorMessages: [], fieldErrors: [] };
        // const fieldErrors = new Array<AddressError>();

        verError.errors.forEach(currError => {
          const errMessage = this.lookupErrorMessage(currError);
          if (currError.field === 'address') {
            // These are the "global" errors reported by EasyPost
            errorUpdate.formErrorMessages.push(errMessage);
          } else if (isStreetRequiredError(currError)) {
            // Seems like EasyPost needs a street address before it verifies other fields.
            // Since street1 might not be filled yet, transform message into a "global" error message.
            errorUpdate.formErrorMessages.push('Street address is missing, could not verify address.');
          } else {
            errorUpdate.fieldErrors.push(currError);
          }
        });
        this.stateUpdates$.next(errorUpdate);
      })
    );
    const processOtherVerificationErrorsAction$ = verificationError$.pipe(
      filter((error) => !isVerificationStatusError(error)),
      tap(clearSuggestionDisplay),
      tap((error) => {
        let formErrorMessage;
        if (error.errors && error.message) {
          formErrorMessage = error.message;
        } else if (error.errors) {
          formErrorMessage = 'Could not verify address, please double-check your address.';
        } else {
          formErrorMessage = 'An unknown error occurred while verifying address.';
        }
        this.stateUpdates$.next({ formErrorMessages: [formErrorMessage] });
      })
    );

    const removeTempAddressOperator = () => (val$: Observable<any>) => val$.pipe(
      withLatestFrom(this.state$),
      filter(([_, state]) => !!state.activityInstanceGuid),
      tap(() => busyCounter$.next(1)),
      concatMap(([_, state]) => this.addressService.deleteTempAddress(state.activityInstanceGuid)),
      catchError(() => {
        console.debug('temp delete failed. This is OK');
        return of(null);
      }),
      tap(() => busyCounter$.next(-1))
    );

    // "Real" as opposed to "Temp"
    const saveRealAddressAction$ = this.saveTrigger$.pipe(
      withLatestFrom(currentAddress$),
      filter(([_, addressToSave]) => this.enoughDataToSave(addressToSave)),
      tap(() => busyCounter$.next(1)),
      concatMap(([_, addressToSave]) => this.addressService.saveAddress(addressToSave, false)),
      tap(() => busyCounter$.next(-1)),
      share()
    );

    const savedAddress$ = saveRealAddressAction$.pipe(
      filter(savedAddressVal => !!savedAddressVal),
      share()
    );

    const removeTempAddressAction$ = saveRealAddressAction$.pipe(
      removeTempAddressOperator()
    );

    const emitValueChangedAction$ = savedAddress$.pipe(
      tap((address => this.valueChanged.emit(address))));

    // todo: look to see if we can set address in child without having reference to component object
    const updateInputComponentWithSavedAddressAction$ = savedAddress$.pipe(
      tap((address => this.stateUpdates$.next({inputAddress: address})))
    );

    const emitComponentBusyAction$ = combineLatest([this.isInputComponentBusy$, isThisComponentBusy$]).pipe(
      map(busyFlags => busyFlags.some(val => val)),
      distinctUntilChanged(),
      tap(isBusy => this.componentBusy.emit(isBusy))
    );

    const emitValidStatusAction$ = combineLatest([this.formErrorMessages$, this.addressErrors$]).pipe(
      map(([formErrors, addressErrors]) => !formErrors.length && !addressErrors.length),
      distinctUntilChanged(),
      tap(status => this.validStatusChanged.emit(status))
    );

    processSubmitAnnouncement$ && processSubmitAnnouncement$.subscribe();
    merge(
      initializeStateAction$,
      saveTempCurrentAddressAction$,
      verifyInputComponentAddressAction$,
      verifyInputComponentSparseAddress$,
      handleAddressSuggestionAction$,
      saveRealAddressAction$,
      removeTempAddressAction$,
      emitValueChangedAction$,
      updateInputComponentWithSavedAddressAction$,
      emitComponentBusyAction$,
      setupSuggestedAddressFormControl$,
      handleSelectedWarnings$,
      processVerificationStatusErrorAction$,
      processOtherVerificationErrorsAction$,
      emitValidStatusAction$,
      updateInputComponentWithSelectedAddress$
    ).subscribe();
  }


  private computeValidityForSparseAddress(address: Address | null): boolean {
    if (address && this.addressIsBlank(address)) {
      // we will say address is valid if totally new and totally blank
      return !address.guid;
    } else {
      return false;
    }
  }


  // let's have at least 2 real data fields completed before we start saving stuff
  enoughDataToVerify(address: Address): boolean {
    return address && !util.isEmpty(address.name) && !util.isEmpty(address.country) && !util.isEmpty(address.street1);
  }

  addressIsBlank(address: Address): boolean {
    return !address || this.countOfFieldsWithData(address) === 0;
  }

  enoughDataToSave(address: Address | null): boolean {
    return address && this.countOfFieldsWithData(address) >= 1;
  }

  countOfFieldsWithData(address: Address): number {
    const isNonBlankString = (val) => util.isString(val) && val.trim().length > 0;
    const propsToCheck: (keyof Address)[] = ['name', 'country', 'street1', 'street2', 'state', 'city', 'zip', 'phone'];
    return propsToCheck.map(prop => address[prop]).filter((value) => isNonBlankString(value)).length;
  }

  saveAddress(): void {
    this.saveTrigger$.next();
  }

  public convertToFormattedString(a: Address): string {
    const isEmpty = (val: string) => val == null || util.isEmpty(val.trim());
    const format = (val: string) => isEmpty(val) ? '' : ', ' + val.trim();
    const streetFormat = (val: string) => isEmpty(val) ? '' : val.trim();
    return `${isEmpty(a.name) ? '' : a.name}${isEmpty(a.name) ? streetFormat(a.street1) : format(a.street1)}${format(a.street2)}${format(a.city)}${format(a.state)}`
      + `${format(a.zip)}${format(a.country)}${isEmpty(a.phone) ? '' : ', Phone: ' + a.phone}`;
  }

  private lookupErrorMessage(currError: AddressError): string {
    const CODE_TO_MESSAGE = {
      'E.HOUSE_NUMBER.INVALID': 'We could not find the street number provided.',
      'E.ADDRESS.NOT_FOUND': 'We could not find the entered address.',
      'E.STREET.MAGNET': 'Street address is ambiguous.'
    };
    return CODE_TO_MESSAGE[currError.code] ? CODE_TO_MESSAGE[currError.code]
      : (currError.message.endsWith('.') ? currError.message : currError.message + '.');
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

