import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressEntryDataService } from '../../services/addressEntryData.service';
import { AddressService } from '../../services/address.service';
import { CountryService } from '../../services/addressCountry.service';
import { Address } from '../../models/address';
import { generateTaggedAddress } from './addressUtils';

@Component({
    selector: 'ddp-address-confirm',
    template: `
        <form [formGroup]="addressVerifyForm" novalidate>
            <div class="address-form-container">
                <mat-radio-group class="radio-label-above" formControlName="selectedAddress" #selectedAddressRadio>
                    <table class="address-choice-outer-container">
                        <ng-template ngFor let-info
                                     [ngForOf]="[{buttonValue:'suggestedAddress',
                                                  address:diffTaggedSuggestedAddress,title:'Suggested Address'},
                                                 {buttonValue:'enteredAddress',
                                                  address:enteredAddress,title:'Entered Address'}]">
                            <tr>
                                <td>
                                    <table class="address-choice-inner-container">
                                        <tr>
                                            <td colspan="2" style="text-align: left;">
                                                <h3>{{info.title}}</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <mat-radio-button [value]="info.buttonValue"
                                                                  [disableRipple]="true">
                                                </mat-radio-button>
                                            </td>
                                            <td>
                                                <span [innerHTML]="info.address.name"></span><br>
                                                <span [innerHtml]="info.address.street1"></span><br>
                                                <span *ngIf="info.address.street2"><span
                                                        [innerHtml]="info.address.street2"></span><br></span>
                                                <span *ngIf="shouldPrintState(info.address.country)  ;else noStateInfo">
                                                    <span [innerHtml]="info.address.city"></span> <span
                                                                        [innerHtml]="info.address.state"></span> <span
                                                                        [innerHtml]="info.address.zip"></span><br>
                                                    <span [innerHtml]="info.address.country"></span>
                                                </span>
                                                <ng-template #noStateInfo>
                                                    <span [innerHtml]="info.address.city"></span> <span
                                                        [innerHtml]="info.address.country"></span> <span
                                                        [innerHtml]="info.address.zip"></span><br>
                                                </ng-template>
                                                <br>
                                                <span [innerHTML]="info.address.phone"></span><br>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <button mat-button (click)="editAddress(info.buttonValue)"
                                                        [style.visibility]="isSelected(info.buttonValue) ? 'visible' : 'hidden'">
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </ng-template>
                    </table>
                </mat-radio-group>
                <div class="save-button">
                    <button mat-raised-button (click)="saveAddress()" [disabled]="addressVerifyForm.invalid">Save
                        Address
                    </button>
                </div>
            </div>
        </form>
    `,
    styles: [
        `.address-form-container {
            display: flex;
            flex-direction: column;
        }`,
        `.address-choice-outer-container {
            vertical-align: center;
            border-collapse: collapse;
        }`,
        `.address-choice-outer-container tr, td {
            border: 1px solid grey;
            padding: 0 10px 0 10px;
        }`,
        `.address-choice-inner-container {
            border: none;
        }`,
        `.address-choice-inner-container td {
            border: none;
            padding: 5px;
        }`,
        `:host ::ng-deep .address-choice-inner-container b {
            border: 1px solid red;
        }`
    ]
})

export class AddressConfirmComponent implements OnInit {
    @Output()
    save: EventEmitter<Address> = new EventEmitter();
    @Input()
    public entryUrl = '..';
    addressVerifyForm: FormGroup;
    suggestedAddress: Address | null;
    enteredAddress: Address | null;
    diffTaggedSuggestedAddress: Address | null;

    constructor(
        private fb: FormBuilder,
        private addressDataService: AddressEntryDataService,
        private addressService: AddressService,
        private countryService: CountryService,
        private router: Router,
        private route: ActivatedRoute) {
        this.enteredAddress = addressDataService.enteredAddress;
        this.suggestedAddress = addressDataService.suggestedAddress;
        this.diffTaggedSuggestedAddress = generateTaggedAddress(addressDataService.enteredAddress,
            addressDataService.suggestedAddress, 'b');
        addressDataService.clear();
    }

    ngOnInit(): void {
        this.createForm();
    }

    // setup the default form and default choice
    createForm(): void {
        this.addressVerifyForm = this.fb.group({
            selectedAddress: 'suggestedAddress'
        });
    }

    isSelected(optionValue: string): boolean {
        const control = this.addressVerifyForm.get('selectedAddress');
        return control && (control.value === optionValue);
    }

    editAddress(propName: keyof AddressConfirmComponent): void {
        this.addressDataService.clear();
        this.setAddressToEdit(propName);
        this.router.navigate([this.entryUrl], { relativeTo: this.route });
    }

    shouldPrintState(address: Address): boolean {
        if (address.state == null || address.state.trim().length === 0) {
            return false;
        } else {
            return true;
        }
    }

    saveAddress(): void {
        const control = this.addressVerifyForm.get('selectedAddress');
        const selectedPropName = control ? control.value : null;
        if (!selectedPropName) {
            return;
        }
        const addressToSave: Address = this[selectedPropName];
        this.addressService.saveAddress(addressToSave)
            .subscribe((address) => {
                this.addressDataService.clear();
                address && this.save.emit(address);
            });
    }

    private setAddressToEdit(propName: keyof AddressConfirmComponent): void {
        const addressToEdit = this.selectedAddress(propName);
        if (addressToEdit == null) {
            return;
        }
        this.addressDataService.addressToEdit = addressToEdit;
    }

    private selectedAddress(propName: keyof AddressConfirmComponent): Address | null {
        return this[propName] instanceof Address ? this[propName] as Address : null;
    }
}
