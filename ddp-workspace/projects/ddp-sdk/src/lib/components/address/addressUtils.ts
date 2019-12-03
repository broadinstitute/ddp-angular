import { Address } from '../../models/address';
import { AddressError } from '../../models/addressError';

type AddressPropName = keyof Address;

/**
 * Compare the properties of interest in the two addresses and create a new address where the
 * differences are tagged
 * param {} baseAddress
 * param {} modifiedAddress
 * param {string} tagName
 * returns {}
 */
export const generateTaggedAddress = (baseAddress: Address | null, modifiedAddress: Address | null, tagName: string): Address | null => {
    if (baseAddress == null || modifiedAddress == null) {
        return null;
    }
    const propsToCompare: AddressPropName[] = ['street1', 'street2', 'city', 'state', 'country', 'zip', 'phone'];
    const taggedAddress = new Address();
    propsToCompare.forEach((prop: string) => {
        taggedAddress[prop] = tagDifferences(baseAddress[prop] as string, modifiedAddress[prop] as string, tagName);
    });
    taggedAddress.name = modifiedAddress.name;

    return taggedAddress;
};

/**
 * Compare two strings and return a copy of the second string that surrounds the runs of tokens that differ with
 * an opening and closing XML/HTML tag.
 * example:
 * string 1: 'Say hello to my little friend, you fool'
 * string 2: 'Say hello to Mr. AK-47, my friend.'
 * tag: b
 * result: 'Say hello to <b>Mr. Ak-47,</b> my friend'
 *
 * param {string} str1
 * param {string} str2
 * param {string} tag
 * returns {string}
 */
export const tagDifferences = (str1: string, str2: string, tag: string): string => {
    if (!str2) {
        return '';
    }
    if (!str1 && str2) {
        return `<${tag}>${str2}</${tag}>`;
    }
    const str1Tokens: string[] = str1.toUpperCase().split(/\s+/);
    const str2Tokens: string[] = str2.toUpperCase().split(/\s+/);
    let result = '';
    let previousWasDifferent = false;

    for (let i = 0; i < Math.max(str1Tokens.length, str2Tokens.length); i++) {
        const token1 = i < str1Tokens.length ? str1Tokens[i] : '';
        const token2 = i < str2Tokens.length ? str2Tokens[i] : '';
        if (token1 !== token2) {
            if (i !== 0) {
                result += ' ';
            }
            result += !previousWasDifferent ? `<${tag}>` : '';
            result += token2;
            result += (i === str2Tokens.length - 1) ? `</${tag}>` : '';
            previousWasDifferent = true;
        } else {
            if (previousWasDifferent) {
                result += `</${tag}>`;
            }
            if (i !== 0) {
                result += ' ';
            }
            result += token2;
            previousWasDifferent = false;
        }
    }

    return result;
};

/**
 * Check to see if error is about EasyPost requiring street address.
 *
 * param {AddressError} error the address verification error object
 * returns {boolean}
 */
export const isStreetRequiredError = (error: AddressError): boolean => {
    return error.field === 'street1' &&
        error.code === 'E.INPUT.INVALID' &&
        error.message.toLowerCase().indexOf('required') !== -1;
};
