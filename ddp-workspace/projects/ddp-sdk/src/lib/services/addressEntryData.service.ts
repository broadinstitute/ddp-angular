import { Injectable } from '@angular/core';
import { Address } from '../models/address';

/**
 * Little service to pass data between address data entry and address confirmation
 */
@Injectable()
export class AddressEntryDataService {
    enteredAddress: Address | null;
    suggestedAddress: Address | null;
    addressToEdit: Address | null;

    constructor() { }

    public clear(): void {
        this.enteredAddress = null;
        this.suggestedAddress = null;
        this.addressToEdit = null;
    }
}
