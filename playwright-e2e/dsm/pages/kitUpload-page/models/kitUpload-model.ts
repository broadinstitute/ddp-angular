export class KitUploadInfo {
  constructor(public readonly shortId: string,
              public readonly firstName: string,
              public readonly lastName: string,
              public street1: string = '75 AMES STREET',
              public street2: string = '',
              public city: string = 'CAMBRIDGE',
              public postalCode: string = '02142',
              public state: string = 'MA',
              public country: string = 'US') {
  }
}
