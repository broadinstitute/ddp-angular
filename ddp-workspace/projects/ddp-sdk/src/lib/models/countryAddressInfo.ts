import { CodedEntity } from './codedEntity';
import { SubnationalDivision } from './subnationalDivision';

/**
 * Model for countries used by Address functionality
 */
export interface CountryAddressInfo extends CodedEntity {
    name: string;
    code: string;
    // "State" and "Province" are most common
    subnationalDivisionTypeName: string;
    // If we have them, here is the list
    subnationalDivisions: SubnationalDivision[];
    // "ZIP" or "Postal Code' or something else
    postalCodeLabel: string;
    // We might have a way to validate or maybe not
    postalCodeRegex: string;
    // code to use in EasyPost if we don't have a subnational division
    stateCode?: string;
}

