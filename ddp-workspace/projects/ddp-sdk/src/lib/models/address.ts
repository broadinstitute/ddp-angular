import * as _ from 'underscore';

export class Address {
    guid: string | null = null;
    name = '';
    street1 = '';
    street2 = '';
    city = '';
    state = '';
    zip = '';
    country = '';
    phone = '';
    isDefault = true;

    constructor(obj?: any) {
        if (obj) {
            ['guid', 'name', 'street1', 'street2', 'city', 'state', 'zip', 'country', 'phone'].forEach(key =>
                this[key] = _.isUndefined(obj[key]) || obj[key] === null ? '' : obj[key]);
        }
    }

    /**
     * Compare this address to another object.
     * Only we care about is if it contains the same properties and values.
     * Note that we exclude a few properties
     * param anotherAddress
     * returns {boolean}
     */
    hasSameDataValues(anotherAddress: any): boolean {
        const propNamesToExcludefromComparison = ['isDefault', 'guid'];
        if (!_.isObject(anotherAddress)) {
            return false;
        }
        // exclude isDefault
        const propNamesToConsider = _.keys(this)
            .filter(propName => propNamesToExcludefromComparison.indexOf(propName) < 0);
        const differingPropName = _.find(propNamesToConsider, (key) => this[key] !== anotherAddress[key]);
        return !differingPropName;
    }
}
