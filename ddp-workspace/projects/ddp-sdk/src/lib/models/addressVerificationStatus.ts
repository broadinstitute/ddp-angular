import { Address } from './address';
import { AddressError } from './addressError';

export interface AddressVerificationStatus {
    address?: Address;
    isDeliverable: boolean;
    errors: AddressError[];
    code: string;
}
