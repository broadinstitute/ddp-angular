import { Address } from './address';
import { AddressVerificationWarnings } from './addressVerificationWarnings';

export class AddressVerificationResponse extends Address {
    warnings: AddressVerificationWarnings = {entered: [], suggested: []};
    constructor(jsonObj?: any) {
        super(jsonObj);
        if (jsonObj.warnings) {
            this.warnings = jsonObj.warnings;
        }
    }
}
