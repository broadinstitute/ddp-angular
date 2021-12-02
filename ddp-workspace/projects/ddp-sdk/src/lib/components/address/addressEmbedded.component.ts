import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, combineLatest, interval, merge, Observable, of, Subject, Subscription } from 'rxjs';
import {
    catchError,
    concatMap,
    debounce,
    distinctUntilChanged,
    filter,
    finalize,
    map,
    mergeMap,
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
import { extract } from '../../utility/rxjsoperator/extract';
import * as util from 'underscore';

import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';
import { AddressVerificationStatus } from '../../models/addressVerificationStatus';
import { AddressInputComponent } from './addressInput.component';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { generateTaggedAddress } from './addressUtils';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AddressVerificationWarnings } from '../../models/addressVerificationWarnings';
import { NGXTranslateService } from '../../services/internationalization/ngxTranslate.service';
import { LoggingService } from '../../services/logging.service';
import { ConfigurationService } from '../../services/configuration.service';

interface IsEasyPostError {
    isEasyPostError: boolean;
}

interface FormError extends IsEasyPostError {
    message: string;
}

export interface FieldError extends AddressError, IsEasyPostError { }

interface ComponentState {
    isReadOnly: boolean;
    activityInstanceGuid: string | null;
    showSuggestion: boolean;
    enteredAddress: Address | null;
    suggestedAddress: Address | null;
    formErrorMessages: FormError[];
    formWarningMessages: string[];
    fieldErrors: FieldError[];
    isTemporarilyDisabled: boolean;
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
            (valueChanged)="inputComponentAddress$.next($event); dirtyStatusChanged.emit(true)"
            (formValidStatusChanged)="formValidStatusChanged$.next($event)"
            [address]="inputAddress$ | async"
            [addressErrors]="verifyFieldErrors$ | async"
            [readonly]="isReadOnly$ | async"
            [country]="country"
            [phoneRequired]="block.requirePhone"
            (componentBusy)="isInputComponentBusy$.next($event)"></ddp-address-input>
        <ddp-validation-message
            *ngIf="(errorMessagesToDisplay$ | async).length > 0"
            [message]="(errorMessagesToDisplay$ | async).join(' ')">
        </ddp-validation-message>
        <form [formGroup]="suggestionForm" novalidate>
            <mat-card id="suggestionMatCard" *ngIf="suggestionInfo$ | async as info">
                <mat-card-header>
                    <mat-card-title translate>SDK.MailAddress.Suggestion.Title</mat-card-title>
                    <mat-card-subtitle translate>SDK.MailAddress.Suggestion.Subtitle</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                    <mat-radio-group class="suggestion-radio-group"
                                     formControlName="suggestionRadioGroup">
                        <mat-radio-button class="margin-5" value="suggested" [disableRipple]="true">
                            <b>{{'SDK.MailAddress.Suggestion.Suggested' | translate}} </b>
                            <span class="suggested"
                                  [innerHTML]="convertToFormattedString(generateTaggedAddress(info.entered, info.suggested,'b'))"></span>
                        </mat-radio-button>
                        <mat-radio-button class="margin-5" value="entered" [disableRipple]="true">
                            <b>{{'SDK.MailAddress.Suggestion.AsEntered' | translate}} </b>{{ convertToFormattedString(info.entered) }}
                        </mat-radio-button>
                    </mat-radio-group>
                </mat-card-content>
            </mat-card>
        </form>
         <mat-checkbox *ngIf="isEasyPostInvalid$ | async" [formControl]="ignoreEasyPostErrorsCheckbox" class="ignore-easy-post-errors">
             {{'SDK.MailAddress.UseAsEntered' | translate}}
         </mat-checkbox>`,
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

        :host ::ng-deep .mat-checkbox-layout {
            white-space: normal;
        }
        `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressEmbeddedComponent implements OnDestroy, OnInit {
    @Input() block: MailAddressBlock;

    @Input()
    public set readonly(val: boolean) {
        this.stateUpdates$.next({isReadOnly: val});
    }

    @Input()
    public set address(val: Address | null) {
        this.inputAddress$.next(val);
    }

    @Input()
    public set validationRequested(val: boolean) {
        this.validationRequested$.next(val);
    }

    /**
     * Activity instance guid associated that contains this component
     * Will be used to maintain reference to mail address data until
     * a "Save" event is received.
     */
    @Input()
    public set activityGuid(val: string | null) {
        this.stateUpdates$.next({activityInstanceGuid: val});
    }

    /**
     * Use if we want to limit country to be only one. Country field will not be shown
     */
    @Input()
    public country: string | null = null;

    /**
     * Will emit an address whenever it is saved
     * type {EventEmitter<Address>}
     */
    @Output()
    public valueChanged = new EventEmitter<Address | null>();

    /**
     * Will emit an address whenever it is updated from ddp-address-input component
     * type {EventEmitter<Address>}
     */
    @Output()
    public dirtyStatusChanged = new EventEmitter<boolean>();

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
    /**
     * Will emit if form error or suggestion will be shown at the bottom of the component in order to allow the parent scroll to it
     */
    @Output()
    errorOrSuggestionWasShown = new EventEmitter();

    @ViewChild(AddressInputComponent, {static: true}) addressInputComponent: AddressInputComponent;
    public formErrorMessages$: Observable<FormError[]>;
    public errorMessagesToDisplay$: Observable<string[]>;
    public suggestionForm: FormGroup;
    public ignoreEasyPostErrorsCheckbox = new FormControl();
    public isInputComponentBusy$ = new BehaviorSubject<boolean>(false);
    // variables for template
    public suggestionInfo$: Observable<AddressSuggestion | null>;
    public inputAddress$: Subject<Address | null> = new BehaviorSubject<Address | null>(null);
    public verifyFieldErrors$: Observable<FieldError[]>;
    public isReadOnly$: Observable<boolean>;
    public inputComponentAddress$ = new BehaviorSubject<Address | null>(null);
    public formValidStatusChanged$ = new BehaviorSubject(true);
    public isEasyPostInvalid$ = new BehaviorSubject(false);
    public generateTaggedAddress = generateTaggedAddress;

    private ngUnsubscribe = new Subject();
    private saveTrigger$ = new Subject<void>();
    private state$: Observable<ComponentState>;
    private stateUpdates$ = new Subject<Partial<ComponentState>>();
    private stateSubscription: Subscription;
    private validationRequested$: Subject<boolean> = new Subject<boolean>();
    private destroyComponentSignal$ = new Subject<void>();
    private readonly LOG_SOURCE = 'AddressEmbeddedComponent';

    constructor(
        private addressService: AddressService,
        private logger: LoggingService,
        private ngxTranslate: NGXTranslateService,
        @Inject('ddp.config') private configuration: ConfigurationService,
        @Optional() private submitService: SubmitAnnouncementService
    ) {
        this.suggestionForm = new FormGroup({
            suggestionRadioGroup: new FormControl('entered')
        });
        this.initializeComponentState();
    }

    private initializeComponentState(): void {
        const initialState: ComponentState = {
            isReadOnly: false,
            activityInstanceGuid: null,
            showSuggestion: false,
            enteredAddress: null,
            suggestedAddress: null,
            formWarningMessages: [],
            formErrorMessages: [],
            fieldErrors: [],
            isTemporarilyDisabled: false
        };

        this.state$ = this.stateUpdates$.pipe(
            startWith(initialState),
            scan((acc: ComponentState, update) => ({...acc, ...update})),
            tap(state => this.logger.logDebug(`${this.LOG_SOURCE}. New embeddedComponentState$=%o`, state)),
            shareReplay(1)
        );
        this.stateSubscription = this.state$.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe();
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
            // let's disable form while we try to load initial address
            tap(() => this.stateUpdates$.next({isTemporarilyDisabled: true})),
            mergeMap((state) => (this.block.addressGuid
                ? this.addressService.getAddress(this.block.addressGuid)
                : this.addressService.findDefaultAddress()).pipe(
                catchError(error => {
                    this.logger.logDebug(this.LOG_SOURCE, `An error occurred during findDefaultAddress: ${error.code}, ${error.message}`);
                    return of(null);
                }),
                map(defaultAddress => [state, defaultAddress]),
            )),
            tap(([_, defaultAddress]: [ComponentState, Address | null]) =>
                defaultAddress && this.inputAddress$.next(defaultAddress)),
            take(1),
            // filter for case where we need to go on to look for a temp address?
            filter(([state, defaultAddress]) => !defaultAddress && !!(state as ComponentState).activityInstanceGuid),
            // map(([state, _]) => state as ComponentState),
            mergeMap(([state, _]) => this.addressService.getTempAddress(state.activityInstanceGuid).pipe(
                catchError(error => {
                    this.logger.logDebug(this.LOG_SOURCE, `An error occurred during getTempAddress: ${error.code}, ${error.message}`);
                    return of(null);
                })
            )),
            tap((tempAddress) => this.inputAddress$.next(tempAddress)),
            // fake that the address was just entered. Perhaps this can become a separate subject?
            // guess we are saving temp address again. No harm but not nice either.
            tap((tempAddress) => this.inputComponentAddress$.next(tempAddress)),
            take(1),
            finalize(() => {
                this.stateUpdates$.next({isTemporarilyDisabled: false});
                busyCounter$.next(-1);
            }),
        );
        const ignoreEasyPostErrorsObservable = this.ignoreEasyPostErrorsCheckbox.valueChanges.pipe(startWith(false));

        // derived observables

        this.isReadOnly$ = this.state$.pipe(
            extract(state => state.isReadOnly || state.isTemporarilyDisabled)
        );

        this.formErrorMessages$ = this.state$.pipe(
            extract('formErrorMessages')
        );

        this.verifyFieldErrors$ = this.state$.pipe(
            extract('fieldErrors', {onlyDistinct: false})
        );

        this.suggestionInfo$ = this.state$.pipe(
            extract(state => state.showSuggestion && !this.readonly ?
                {
                    suggested: state.suggestedAddress,
                    entered: state.enteredAddress,
                    warnings: state.warnings
                } : null, {onlyDistinct: false})
        );

        this.errorMessagesToDisplay$ = combineLatest([this.state$, ignoreEasyPostErrorsObservable]).pipe(
            extract(([state, ignoreEasyPost]) => state.formErrorMessages
                .filter(error => !(ignoreEasyPost && error.isEasyPostError))
                .map(error => error.message)
                .concat(state.formWarningMessages)));

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
            tap(() => addressSuggestion$.next(null)),
            map(address => [address, this.computeValidityForSparseAddress(address)]),
            mergeMap(([address, isValid]) => {
                if (address && !isValid) {
                    return this.ngxTranslate.getTranslation('SDK.MailAddress.Error.InvalidAddress');
                } else {
                    return of(null);
                }
            }),
            tap((error: string | null) => {
                this.stateUpdates$.next({formErrorMessages: error ? [{ message: error, isEasyPostError: false }] : []});
            })
        );

        // Since we use switchMap, we can't expect every incoming value
        // generates a corresponding one on other side
        // so keep a count going in and subtract the total when something goes out
        let initiatedVerifyAddressCalls = 0;
        const verifyInputComponentAddressAction$ = this.inputComponentAddress$.pipe(
            filter(address => this.enoughDataToVerify(address)),
            tap(() => addressSuggestion$.next(null)),
            tap(() => busyCounter$.next(1)),
            tap(() => ++initiatedVerifyAddressCalls),
            switchMap(inputAddress =>
                this.addressService.verifyAddress(inputAddress).pipe(
                    map(verifyResponse => ({
                        entered: inputAddress,
                        suggested: new Address(verifyResponse),
                        warnings: verifyResponse.warnings
                    }) as AddressSuggestion),
                    tap((addressSuggestion) => addressSuggestion$.next(addressSuggestion)),
                    catchError((error) => {
                        verificationError$.next(error);
                        return of(null);
                    })
                )
            ),
            tap(() => busyCounter$.next(-1 * initiatedVerifyAddressCalls))
        );


        const handleAddressSuggestionAction$ = addressSuggestion$.pipe(
            // to filter out null values when any field is updated
            distinctUntilChanged(),
            tap(() => this.stateUpdates$.next({fieldErrors: []})),
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
                const commonStateFields: Partial<ComponentState> = {
                    formErrorMessages: [],
                    formWarningMessages: enteredWarningMessages,
                    warnings: addressSuggestion.warnings,
                };
                if (!suggested.hasSameDataValues(entered)) {
                    this.stateUpdates$.next({
                        ...commonStateFields,
                        suggestedAddress: suggested,
                        enteredAddress: entered,
                        showSuggestion: true
                    });
                } else {
                    this.stateUpdates$.next({
                        ...commonStateFields,
                        suggestedAddress: null,
                        enteredAddress: null,
                        showSuggestion: false
                    });
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
            tap(address => this.inputAddress$.next(address))
        );

        // saving addresses coming from either the input component or that have been selected from suggestion radio group
        const saveTempCurrentAddressAction$ = currentAddress$.pipe(
            distinctUntilChanged((x, y) => util.isEqual(x, y)),
            withLatestFrom(this.state$),
            filter(([address, state]) => !!address && (!address.guid || !address.guid.trim()) && !!state.activityInstanceGuid),
            tap(() => busyCounter$.next(1)),
            concatMap(([address, state]) => this.addressService.saveTempAddress(address, state.activityInstanceGuid)),
            catchError((error) => {
                this.logger.logWarning(this.LOG_SOURCE, `There was a problems saving temp address: ${error}`);
                return of(null);
            }),
            tap(() => busyCounter$.next(-1))
        );

        let processSubmitAnnouncement$;
        if (this.submitService) {
            processSubmitAnnouncement$ = this.submitService.submitAnnounced$.pipe(
                tap(() => this.saveTrigger$.next())
            );
        }


        const isVerificationStatusError = (error: any) => error && error.errors && error.errors.length > 0 && error.code;

        const clearSuggestionDisplay = () => this.stateUpdates$.next({showSuggestion: false, suggestedAddress: null});

        const processVerificationStatusErrorAction$ = verificationError$.pipe(
            filter((error) => isVerificationStatusError(error)),
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
                const errorUpdate: Partial<ComponentState> = {formErrorMessages: [], fieldErrors: []};
                // const fieldErrors = new Array<AddressError>();

                verError.errors.forEach(currError => {
                    if (currError.field === 'address') {
                        // These are the "global" errors reported by EasyPost
                        errorUpdate.formErrorMessages.push({ message: currError.message, isEasyPostError: true });
                    } else {
                        errorUpdate.fieldErrors.push({ ...currError, isEasyPostError: true });
                    }
                });
                this.stateUpdates$.next(errorUpdate);
            })
        );
        const processOtherVerificationErrorsAction$ = verificationError$.pipe(
            filter((error) => !isVerificationStatusError(error)),
            tap(clearSuggestionDisplay),
            mergeMap(error => {
                if (error.errors && error.message) {
                    return of(error.message);
                } else if (error.errors) {
                    return this.ngxTranslate.getTranslation('SDK.MailAddress.Error.CannotVerify');
                } else {
                    return this.ngxTranslate.getTranslation('SDK.MailAddress.Error.UnknownVerifyError');
                }
            }),
            tap((errorMessage) => this.stateUpdates$.next({formErrorMessages: [{ message: errorMessage, isEasyPostError: false }]}))
        );

        const canSaveRealAddress = (address: Address | null) =>
            this.enoughDataToSave(address) && this.meetsActivityRequirements(address);

        // "Real" as opposed to "Temp". Important we return the saved address as properties are added on server
        const saveRealAddressAction$ = this.saveTrigger$.pipe(
            withLatestFrom(currentAddress$, this.formErrorMessages$, this.verifyFieldErrors$, ignoreEasyPostErrorsObservable),
            filter(([_, addressToSave, formErrors, fieldErrors, ignoreEasyPost]) => {
                return !formErrors?.filter(error => !(ignoreEasyPost && error.isEasyPostError)).length
                    && !fieldErrors?.filter(error => !(ignoreEasyPost && error.isEasyPostError)).length
                    && canSaveRealAddress(addressToSave);
            }),
            tap(() => busyCounter$.next(1)),
            concatMap(([_, addressToSave]) => this.addressService.saveAddress(addressToSave, false)),
            catchError((error) => {
                this.logger.logError(this.LOG_SOURCE, 'Saving address was failed', error.message);
                const formErrorMessages = [{ message: error.message, isEasyPostError: false }];
                this.stateUpdates$.next({formErrorMessages});
                return of(null);
            }),
            tap(() => busyCounter$.next(-1)),
            share()
        );

        const deleteTempAddressAction$ = saveRealAddressAction$.pipe(
            withLatestFrom(this.state$),
            filter(([address, state]) => !!address && !!state.activityInstanceGuid),
            tap(() => busyCounter$.next(1)),
            concatMap(([_, state]) => this.addressService.deleteTempAddress(state.activityInstanceGuid)),
            catchError(() => {
                this.logger.logDebug(this.LOG_SOURCE, 'Temp delete failed. This is OK.');
                return of(null);
            }),
            tap(() => busyCounter$.next(-1))
        );

        /* If we get to show validations, we touch controls so we will show validations errors
            associate with controls
         */
        const touchFormOnSubmitWithBadAddressAction$ = this.validationRequested$.pipe(
            withLatestFrom(currentAddress$),
            filter(([_, addressToSave]) => !canSaveRealAddress(addressToSave)),
            tap(() => this.addressInputComponent.markAddressTouched())
        );

        const savedAddress$: Observable<Address | null> = saveRealAddressAction$.pipe(share());

        const emitValueChangedAction$ = savedAddress$.pipe(
            tap((address => this.valueChanged.emit(address))));

        const updateInputComponentWithSavedAddressAction$ = savedAddress$.pipe(
            tap(address => this.inputAddress$.next(address))
        );

        const errorOrSuggestionIsShown$ = combineLatest([this.errorMessagesToDisplay$, this.suggestionInfo$]).pipe(
            filter(([errorMessages, suggestionInfo]) => !!(errorMessages.length || suggestionInfo)),
            tap(() => this.errorOrSuggestionWasShown.emit())
        );

        const addressComponentBusy$ = combineLatest([this.isInputComponentBusy$, isThisComponentBusy$]).pipe(
            map(busyFlags => busyFlags.some(val => val)),
            distinctUntilChanged(),
            share());

        const emitComponentBusyAction$ = addressComponentBusy$.pipe(
            // let's smooth out our busyness signals
            debounce(busy => interval(busy ? 0 : 250)),
            distinctUntilChanged(),
            tap(isBusy => this.componentBusy.emit(isBusy))
        );

        const activityRequirementsMet$: Observable<boolean> = currentAddress$.pipe(
            map(currentAddress => this.meetsActivityRequirements(currentAddress))
        );

        const emitValidStatusAction$ = combineLatest([
            this.formValidStatusChanged$,
            this.formErrorMessages$,
            this.verifyFieldErrors$,
            activityRequirementsMet$,
            ignoreEasyPostErrorsObservable
        ]).pipe(
            map(([formValidStatusChanged, formErrors, addressErrors, reqsMet, ignoreEasyPost]) =>
                (!this.configuration.addressEnforceRequiredFields || formValidStatusChanged)
                && !formErrors.filter(error => !(ignoreEasyPost && error.isEasyPostError)).length
                && !addressErrors.filter(error => !(ignoreEasyPost && error.isEasyPostError)).length
                && reqsMet),
            distinctUntilChanged(),
            tap(status => this.validStatusChanged.emit(status))
        );

        combineLatest([
            this.formErrorMessages$,
            this.verifyFieldErrors$,
        ]).pipe(
            map(([formErrors, fieldErrors]) =>
                (formErrors.length || fieldErrors.length)
                && formErrors.every(error => error.isEasyPostError)
                && fieldErrors.every(error => error.isEasyPostError)),
        ).subscribe(this.isEasyPostInvalid$);

        // At least for now, we'll report the status of mailing address through block too
        // (needed to limit status checks to blocks that are visible within a section
        const updateBlockValidStatusAction$ = this.validStatusChanged.pipe(
            tap(validStatus => this.block.hasValidAddress  = validStatus)
        );


        // We need to trigger an unsubscribe, but don't want to do it prematurely. Wait til we are not busy!
        combineLatest([this.destroyComponentSignal$, this.componentBusy]).pipe(
            filter(([_, busy]) => !busy),
            take(1))
            .subscribe(() => {
                this.ngUnsubscribe.next();
                this.ngUnsubscribe.complete();
            });

        processSubmitAnnouncement$ && processSubmitAnnouncement$.pipe(
            takeUntil(this.ngUnsubscribe))
            .subscribe();

        merge(
            saveTempCurrentAddressAction$,
            verifyInputComponentAddressAction$,
            verifyInputComponentSparseAddress$,
            handleAddressSuggestionAction$,
            saveRealAddressAction$,
            updateBlockValidStatusAction$,
            deleteTempAddressAction$,
            touchFormOnSubmitWithBadAddressAction$,
            emitValueChangedAction$,
            updateInputComponentWithSavedAddressAction$,
            emitComponentBusyAction$,
            setupSuggestedAddressFormControl$,
            handleSelectedWarnings$,
            processVerificationStatusErrorAction$,
            processOtherVerificationErrorsAction$,
            emitValidStatusAction$,
            updateInputComponentWithSelectedAddress$,
            initializeStateAction$,
            errorOrSuggestionIsShown$
        ).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe();
    }


    private meetsActivityRequirements(currentAddress: Address | null): boolean {
        if (this.block.requireVerified && !currentAddress) {
            return false;
        }
        return !(this.block.requirePhone && currentAddress && !(currentAddress.phone));
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
        // tslint:disable-next-line:max-line-length
        return `${isEmpty(a.name) ? '' : a.name}${isEmpty(a.name) ? streetFormat(a.street1) : format(a.street1)}${format(a.street2)}${format(a.city)}${format(a.state)}`
            + `${format(a.zip)}${format(a.country)}${isEmpty(a.phone) ? '' : ', Phone: ' + a.phone}`;
    }

    ngOnDestroy(): void {
        this.destroyComponentSignal$.next();
    }
}
