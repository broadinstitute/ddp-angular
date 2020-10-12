import { AddressWarning } from './addressWarning';

export interface AddressVerificationWarnings {
    entered: Array<AddressWarning>;
    suggested: Array<AddressWarning>;
}
