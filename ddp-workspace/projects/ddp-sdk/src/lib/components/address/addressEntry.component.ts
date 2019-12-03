import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from '../../models/address';
import { AddressEntryDataService } from '../../services/addressEntryData.service';
import { AddressService } from '../../services/address.service';
import { AddressError } from '../../models/addressError';
import { AddressVerificationStatus } from '../../models/addressVerificationStatus';
import { AddressInputComponent } from './addressInput.component';

@Component({
    selector: 'ddp-address-entry',
    template: `
            <div class="address-form-container">
                <h2>Mailing Address</h2>

                <div class="form-error-messages-container" *ngIf="formErrorMessages.length > 0">
                    <div *ngFor="let errorMsg of formErrorMessages" class="form-error-message">
                        <mat-error>{{ errorMsg }}</mat-error>
                        <br>
                    </div>
                </div>
                <ddp-address-input [name]="name" [defaultCountryCode]="defaultCountryCode"
                                   (valueChanged)="processAddressChange($event)"
                                   [countryCodes]="countryCodes" [address]="currentAddress"></ddp-address-input>
                <div class="save-button">
                    <button mat-raised-button [disabled]="!enableSubmitButton()" (click)="submit()">Save Address</button>
                </div>
            </div>
    `,
    styles: [
        `.address-form-container {
        display: flex;
        flex-direction: column;
      }`,
        `.form-error-messages-container {
        margin-top: 5px;
        margin-bottom: 5px;
      }`,
        `.form-error-message{
        padding: 10px;
        display: flex;
        justify-content: center;
        background-color: lightgrey;
      }`,
        `.save-button{
        alignment: center;
      }`
    ]
})
export class AddressEntryComponent implements OnInit {
    /**
     * Specify default name. Will be ignored if we get the address from server
     * type {string}
     */
    @Input()
    name = '';
    /**
     * Relative URL path to this path that will load the address confirm page.
     * Defaults to "confirm"
     * type {string}
     */
    @Input()
    confirmUrl = 'confirm';
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
     * After address save is completed, generate save event
     * Can be used to redirect to next page or anything else
     * Event will pass succesfully saved Address object
     * type {EventEmitter<Address>}
     */
    @Output()
    save: EventEmitter<Address> = new EventEmitter();

    formErrorMessages: string[] = [];
    // keep track of whether the address has been verified
    addressHasBeenVerified = false;
    /**
     * Reference to child component
     */
    @ViewChild(AddressInputComponent, { static: true })
    addressInputComponent: AddressInputComponent;
    /**
     * Place to hold the address we are working on
     * No reliable way to pass it to child component directly
     * So set the address here and let the child pick it up
     */
    currentAddress: Address | null;

    constructor(
        private addressService: AddressService,
        private addressDataService: AddressEntryDataService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.initializeFormContents();
    }

    processAddressChange(event: any): void {
        this.addressHasBeenVerified = false;
    }

    private initializeFormContents(): void {
        if (this.addressDataService.addressToEdit) {
            this.currentAddress = this.addressDataService.addressToEdit as Address;
        } else {
            this.addressService.findDefaultAddress().subscribe((address) => {
                if (address != null) {
                    this.currentAddress = address;
                }
            });
        }
    }

    clearErrors(): void {
        this.formErrorMessages.splice(0, this.formErrorMessages.length);
    }

    submit(): void {
        const enteredAddress: Address = this.buildEnteredAddress();
        // save it locally before we do anything
        this.addressDataService.enteredAddress = enteredAddress;
        // clear all errors in case more/different ones coming from server
        this.clearErrors();
        // If this info has been verified already, then next submission we just save
        if (this.addressHasBeenVerified) {
            this.saveAddress(enteredAddress);
        } else {
            // Has not been verified? Let's do that now
            this.addressService.verifyAddress(enteredAddress)
                .subscribe(
                    (result) => {
                        const suggestedAddress = result;
                        // if the entered and suggested are identical, let's just go ahead and save
                        if (enteredAddress.hasSameDataValues(suggestedAddress)) {
                            this.saveAddress(enteredAddress);
                        } else {
                            // Different? User will have to confirm
                            this.addressDataService.suggestedAddress = suggestedAddress;
                            suggestedAddress.isDefault = true;
                            suggestedAddress.guid = enteredAddress.guid;
                            this.router.navigate([this.confirmUrl], {
                                relativeTo: this.route,
                                skipLocationChange: true
                            });
                        }
                        // verified!
                        this.addressHasBeenVerified = true;
                        return;
                    },
                    (error) => {
                        this.processVerificationError(error);
                    });
        }
    }

    processVerificationError(error: any): void {
        if (error && error.errors && error.code) {
            const verifyStatus = error as AddressVerificationStatus;
            if (verifyStatus.errors.length > 0) {
                verifyStatus.errors.forEach((currError: AddressError) => {
                    const errMessage = this.lookupErrorMessage(currError);
                    // These are the "global" errors reported by EasyPost
                    if (currError.field === 'address') {
                        this.formErrorMessages.push(errMessage);
                    }
                });
            } else {
                if (error.message) {
                    this.formErrorMessages.push(error.message);
                }
            }
            this.addressInputComponent.displayVerificationErrors(verifyStatus.errors);
            // we verified it. It has errors, but it is verified
            this.addressHasBeenVerified = true;
        } else {
            this.formErrorMessages.push('An unknown error occurred while verifying address');
        }
    }

    saveAddress(addressToSave: Address): void {
        this.addressService.saveAddress(addressToSave).subscribe(
            () => {
                this.addressDataService.clear();
                this.save.emit(addressToSave);
            },
            (error) => {
                if (error && error.message) {
                    this.formErrorMessages.push(error.message);
                } else {
                    this.formErrorMessages.push('Unknown error occurred during save');
                }
            });
    }

    private buildEnteredAddress(): Address {
        return this.addressInputComponent.buildEnteredAddress();
    }

    // Want to disable the submit button only if we have local validation errors
    // These are either fields missing or bad syntax (e.g., a US Zip code with letters
    // No point in allowing these to be saved
    // The "verify" errors come server-side. Let user proceed with submission if that is the only kind of error in the form.
    enableSubmitButton(): boolean {
        const allErrorsFromInputComponent: ValidationErrors[] = this.addressInputComponent.getAllErrors();
        const hasControlsWithNonVerifyErrors: ValidationErrors | undefined = allErrorsFromInputComponent.find(error => !error['verify']);
        if (hasControlsWithNonVerifyErrors) {
            return false;
        }
        const anInputComponentErrorThatIsNotAVerifyError = allErrorsFromInputComponent.find(errorObj => !errorObj['verify']);
        return !anInputComponentErrorThatIsNotAVerifyError;
    }

    private lookupErrorMessage(currError: AddressError): string {
        const CODE_TO_MESSAGE = {
            'E.HOUSE_NUMBER.INVALID': 'Street number could not be found',
            'E.ADDRESS.NOT_FOUND': 'Entered address could not be found'
        };
        return CODE_TO_MESSAGE[currError.code] ? CODE_TO_MESSAGE[currError.code] : currError.message;
    }
}
