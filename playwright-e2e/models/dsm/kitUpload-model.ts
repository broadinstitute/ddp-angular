export class KitUploadInfo {
  constructor(public readonly shortId: string,
              public readonly firstName: string,
              public readonly lastName: string,
              public readonly street1: string,
              public readonly street2: string = 'Broadway',
              public readonly city: string = 'CAMBRIDGE',
              public readonly postalCode: string = '02142',
              public readonly state: string = 'MA',
              public readonly country: string = 'US') {
  }
}
