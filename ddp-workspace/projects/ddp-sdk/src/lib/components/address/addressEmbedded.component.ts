import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    OnChanges,
    OnDestroy,
    Optional,
    Output,
    SimpleChange,
    ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SubmitAnnouncementService } from '../../services/submitAnnouncement.service';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';
import { AddressVerificationStatus } from '../../models/addressVerificationStatus';
import { AddressInputComponent } from './addressInput.component';
import { MailAddressBlock } from '../../models/activity/MailAddressBlock';
import { generateTaggedAddress, isStreetRequiredError } from './addressUtils';
import * as _ from 'underscore';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector: 'ddp-address-embedded',
    template: `
    <p *ngIf="block.titleText" class="ddp-address-embedded__title" [innerHTML]="block.titleText"></p>
    <p *ngIf="block.subtitleText" class="ddp-address-embedded__subtitle" [innerHTML]="block.subtitleText"></p>
    <ddp-address-input
            [name]="name"
            [address]="address"
            [readonly]="readonly"
            [countryCodes]="countryCodes"
            [defaultCountryCode]="defaultCountryCode"
            (valueChanged)="processAddressChange($event)"
            (componentBusy)="inputComponentBusy$.next($event)"></ddp-address-input>
    <ddp-validation-message
            *ngIf="formErrorMessages.length > 0"
            [message]="formErrorMessages.join(' ')">
    </ddp-validation-message>
    <form [formGroup]="suggestionForm" novalidate>
        <mat-card *ngIf="showSuggestion && !readonly">
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
                    <mat-radio-button class="margin-5" value="suggested" [disableRipple]="true" (change)="valueChanges('suggested')">
                        <b>Suggested: </b>
                        <span class="suggested"
                              [innerHTML]="convertToFormattedString(generateTaggedAddress(enteredAddress, suggestedAddress,'b'))"></span>
                    </mat-radio-button>
                    <mat-radio-button class="margin-5" value="original" [disableRipple]="true" (change)="valueChanges('original')">
                        <b>As entered: </b>{{ convertToFormattedString(enteredAddress) }}
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
        /* Needed to keep suggestion text inside enclosing box. Don't believe compiler warning that not needed */
        :host ::ng-deep .mat-radio-label {
            white-space: normal;
        }
        `]
})

export class AddressEmbeddedComponent implements OnChanges, OnDestroy, OnInit {
    @Input() block: MailAddressBlock;

    /**
     * Activity instance guid associated that contains this component
     * Will be used to maintain reference to mail address data until
     * a "Save" event is received.
     */
    @Input('activityGuid') activityInstanceGuid: string;
    /**
     * Observable that will be subscribed. Any message received will trigger saving the
     * address encoded in form
     */
    @Input() saveEvent: Observable<any>;
    @Input() readonly = false;
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
     * Set the default country when blank form is loaded. Form starts with no country selected if this is not set.
     */
    @Input()
    defaultCountryCode: string | null = null;

    /**
     * Will emit an address whenever it is saved
     * type {EventEmitter<Address>}
     */
    @Output() valueChanged = new EventEmitter<Address>();
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
    public address: Address | null;
    public showSuggestion = false;
    public suggestedAddress: Address | null;
    public enteredAddress: Address | null;
    public formErrorMessages: string[] = [];
    public suggestionForm: FormGroup;
    public isFormUpdated = false;
    private ngUnsubscribe = new Subject();
    private saveAddressInProgress$ = new BehaviorSubject<boolean>(false);
    private verifyAddressInProgress$ = new BehaviorSubject<boolean>(false);
    private initializeAddressInProgress$ = new BehaviorSubject<boolean>(false);
    public inputComponentBusy$ = new BehaviorSubject<boolean>(false);

    constructor(
        private addressService: AddressService,
        private cdr: ChangeDetectorRef,
        @Optional() private submitService: SubmitAnnouncementService) {
        this.suggestionForm = new FormGroup({});
        if (submitService) {
            this.submitService.submitAnnounced$
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    () => {
                        const address = this.addressInputComponent.buildEnteredAddress();
                        // don't want to save just a couple of fields
                        // submitter should have access to validity state anyways
                        if (this.enoughDataToSave(address)) {
                            this.saveAddress();
                        }
                    });
        }
    }

    ngOnInit(): void {
        combineLatest(this.saveAddressInProgress$, this.verifyAddressInProgress$,
            this.initializeAddressInProgress$, this.inputComponentBusy$).pipe(
                distinctUntilChanged(),
                takeUntil(this.ngUnsubscribe),
                map(busyFlags => busyFlags.some(val => val)))
            .subscribe(this.componentBusy);
        this.initializeAddress();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        if (changes['saveEvent'] && changes['saveEvent'].currentValue) {
            this.saveEvent
                .pipe(take(1))
                .subscribe(() => {
                    this.saveAddress();
                });
        }
    }

    processAddressChange(address: Address | null): void {
        this.saveTempAddressIfNecessary(address);
        if (address && this.enoughDataToVerify(address)) {
            this.isFormUpdated = true;
            this.verifyAddress(address);
        } else {
            const addressIsValid = this.computeValidityForSparseAddress(address);
            if (address && !addressIsValid) {
                this.formErrorMessages = ['Invalid address'];
            } else {
                this.formErrorMessages = [];
            }
            this.validStatusChanged.emit(addressIsValid);

            this.showSuggestion = false;
        }
    }

    private computeValidityForSparseAddress(address: Address | null): boolean {
        if (address && this.addressIsBlank(address)) {
            // we will say address is valid if totally new and totally blank
            return !address.guid;
        } else {
            return false;
        }
    }

    private saveTempAddressIfNecessary(enteredAddress: Address | null): void {
        if (enteredAddress == null) {
            return;
        }
        if ((!(this.address) || !(enteredAddress.guid) || (enteredAddress.guid.trim() === '')) && this.activityInstanceGuid) {
            this.saveAddressInProgress$.next(true);
            if (this.enoughDataToSave(enteredAddress)) {
                console.log('saving temp address');
                this.addressService.saveTempAddress(enteredAddress, this.activityInstanceGuid)
                    .pipe(take(1))
                    .subscribe(
                        () => console.log('Temp address was saved'),
                        (error) => {
                            console.log('there was a problems saving temp address:' + error);
                            this.formErrorMessages.push('There was a problem saving the address to temporary space');
                            this.saveAddressInProgress$.next(false);
                        },
                        () => this.saveAddressInProgress$.next(false));
            } else {
                console.log('deleting temp address');
                this.addressService.deleteTempAddress(this.activityInstanceGuid)
                    .pipe(take(1))
                    .subscribe(
                        () => console.log('Temp address deleted'),
                        () => this.saveAddressInProgress$.next(false),
                        () => this.saveAddressInProgress$.next(false));
            }
        }
    }

    // let's have at least 2 real data fields completed before we start saving stuff
    enoughDataToVerify(address: Address): boolean {
        return !_.isEmpty(address.name) && !_.isEmpty(address.country) && !_.isEmpty(address.street1);
    }

    addressIsBlank(address: Address): boolean {
        return this.countOfFieldsWithData(address) === 0;
    }

    enoughDataToSave(address: Address): boolean {
        return this.countOfFieldsWithData(address) >= 1;
    }

    countOfFieldsWithData(address: Address): number {
        const isNonBlankString = (val) => _.isString(val) && val.trim().length > 0;
        const propsToCheck: (keyof Address)[] = ['name', 'country', 'street1', 'street2', 'state', 'city', 'zip', 'phone'];
        return propsToCheck.map(prop => address[prop]).filter((value) => isNonBlankString(value)).length;
    }

    saveAddress(): void {
        this.saveAddressInProgress$.next(true);
        this.addressService.saveAddress(this.addressInputComponent.buildEnteredAddress(), false)
            .pipe(
                // on save of "real" address, delete temp address that might exist
                tap(() => this.activityInstanceGuid
                    && this.addressService.deleteTempAddress(this.activityInstanceGuid)
                        .pipe(take(1))
                        .subscribe(
                            () => console.log('temp address deleted!'),
                            () => console.log('temp address not deleted.no problem'))),
                take(1)
            ).subscribe(
                (savedAddress) => {
                    console.log('Address has been saved');
                    // if the save operation returned us a guid we need to make sure
                    // we keep it with the address form for follow up saves
                    if (savedAddress) {
                        this.addressInputComponent.setAddressValues(savedAddress);
                        this.valueChanged.emit(savedAddress);
                    }
                },
                (error) => {
                    console.error('There was a problem saving the address: ' + error);
                    this.saveAddressInProgress$.next(false);
                },
                () => this.saveAddressInProgress$.next(false));
    }

    verifyAddress(addressToVerify: Address): void {
        this.formErrorMessages = [];
        this.verifyAddressInProgress$.next(true);
        this.addressService.verifyAddress(addressToVerify)
            .pipe(
                take(1))
            .subscribe(
                (suggestedAddress: Address) => {
                    this.addressInputComponent.clearVerificationErrors();
                    if (!(addressToVerify.hasSameDataValues(suggestedAddress))) {
                        this.showSuggestedAddress(suggestedAddress, addressToVerify);
                    } else {
                        this.showSuggestion = false;
                        this.isFormUpdated = false;
                    }
                    // EasyPost does not take into consideration our own address requirements (e.g., missing name is OK by Easy)
                    // so if Easy Post says is valid we got here. If form has all stuff required then we emit true
                    this.validStatusChanged.emit(this.addressInputComponent.addressForm.valid);
                    // Looks like we need to force change detection here
                    this.cdr.detectChanges();
                },
                (error) => {
                    this.showSuggestion = false;
                    this.isFormUpdated = false;
                    this.suggestedAddress = null;
                    this.validStatusChanged.emit(false);
                    this.processVerificationError(error);
                    // Looks like we need to force change detection here
                    this.verifyAddressInProgress$.next(false);
                    this.cdr.detectChanges();
                    // tslint:disable-next-line:align
                },
                () => {
                    this.verifyAddressInProgress$.next(false);
                });
    }

    showSuggestedAddress(suggestedAddress: Address, enteredAddress: Address): void {
        this.formErrorMessages = [];
        this.suggestedAddress = suggestedAddress;
        // copy values that would not come from the server but still need.
        suggestedAddress.guid = enteredAddress.guid;
        suggestedAddress.isDefault = enteredAddress.isDefault;
        this.enteredAddress = enteredAddress;
        const radioControl = new FormControl();
        this.suggestionForm.registerControl('suggestionRadioGroup', radioControl);
        radioControl.setValue('original', { onlySelf: false });
        if (this.isFormUpdated) {
            this.suggestionForm.controls['suggestionRadioGroup'].setValue('original');
            this.valueChanges('original');
            this.isFormUpdated = false;
        }
        this.showSuggestion = true;
    }

    public valueChanges(value: string): void {
        const addressToUse: Address | null = (value === 'suggested') ? this.suggestedAddress : this.enteredAddress;
        this.addressInputComponent.setAddressValues(addressToUse, true);
        this.validStatusChanged.emit(this.addressInputComponent.addressForm.valid);
        this.saveTempAddressIfNecessary(addressToUse);
    }

    convertToFormattedString(a: Address): string {
        const isEmpty = (val: string) => val == null || _.isEmpty(val.trim());
        const format = (val: string) => isEmpty(val) ? '' : ', ' + val.trim();
        const streetFormat = (val: string) => isEmpty(val) ? '' : val.trim();
        return `${isEmpty(a.name) ? '' : a.name}${isEmpty(a.name) ? streetFormat(a.street1) : format(a.street1)}${format(a.street2)}${format(a.city)}${format(a.state)}`
            + `${format(a.zip)}${format(a.country)}${isEmpty(a.phone) ? '' : ', Phone: ' + a.phone}`;
    }

    generateTaggedAddress = generateTaggedAddress;

    initializeAddress(): void {
        // See first if user has a designated default address that already have been saved
        this.initializeAddressInProgress$.next(true);
        this.addressService.findDefaultAddress()
            .pipe(take(1))
            .subscribe((address) => {
                if (address != null) {
                    this.address = address as Address;
                    // if we have a saved address in system, we are going to say it is valid
                    // regardless of what is in there.
                    this.validStatusChanged.emit(true);
                    this.initializeAddressInProgress$.next(false);
                } else if (this.activityInstanceGuid) {
                    // No default address? Maybe we have saved a temp address for this activity instance before?
                    this.addressService.getTempAddress(this.activityInstanceGuid)
                        .pipe(take(1))
                        .subscribe(
                            (tempAddress) => {
                                if (tempAddress) {
                                    this.address = tempAddress;
                                    this.verifyAddress(tempAddress);
                                } else {
                                    // a starting blank mailing address is valid
                                    this.validStatusChanged.emit(true);
                                    console.log('We did not find a default or temp address');
                                }
                            },
                            (error) => console.error('An error occurred retrieving temp address: ' + error),
                            () => this.initializeAddressInProgress$.next(false));
                }
            });
    }

    processVerificationError(error: any): void {
        this.formErrorMessages = [];
        if (error && error.errors && error.code) {
            const verifyStatus = error as AddressVerificationStatus;
            const fieldErrors = new Array<AddressError>();
            if (verifyStatus.errors.length > 0) {
                verifyStatus.errors.sort((a, b) => {
                    // Put the "not found" error last, so that error message display reads a bit nicer.
                    if (a.code === 'E.ADDRESS.NOT_FOUND') {
                        return 1;
                    } else if (b.code === 'E.ADDRESS.NOT_FOUND') {
                        return -1;
                    } else {
                        return 0;
                    }
                })
                    .forEach((currError: AddressError) => {
                        const errMessage = this.lookupErrorMessage(currError);
                        if (currError.field === 'address') {
                            // These are the "global" errors reported by EasyPost
                            this.formErrorMessages.push(errMessage);
                        } else if (isStreetRequiredError(currError)) {
                            // Seems like EasyPost needs a street address before it verifies other fields.
                            // Since street1 might not be filled yet, transform message into a "global" error message.
                            this.formErrorMessages.push('Street address is missing, could not verify address.');
                        } else {
                            fieldErrors.push(currError);
                        }
                    });
            } else {
                if (error.message) {
                    this.formErrorMessages.push(error.message);
                } else {
                    this.formErrorMessages.push('Could not verify address, please double-check your address.');
                }
            }
            this.addressInputComponent.displayVerificationErrors(fieldErrors);
        } else {
            this.formErrorMessages.push('An unknown error occurred while verifying address.');
        }
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
