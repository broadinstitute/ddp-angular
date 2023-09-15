import * as mock from 'data/mock-address.json';

export class KitUploadInfo {
  constructor(public readonly shortId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public address: {
      street1?: string,
      street2?: string,
      city?: string,
      postalCode?: string,
      state?: string,
      country?: string
    } = {}) {
    const boston = mock.boston;
    const {
      street1 = boston.street, street2 = '', city = boston.city,
      postalCode = boston.zip, state = boston.state, country = boston.country.abbreviation
    } = address;
  }
}
