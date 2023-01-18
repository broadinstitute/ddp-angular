export class Address {
  constructor(public firstName: string, public lastName: string, public street1: string, public street2: string,
               public city: string, public postalCode: string, public state: string, public country: string, public phone: string,
              public shortId: string, public mailToName: string, public zip: string, public guid: string, public valid: boolean) {
  }

  static parse(json): Address {
    return new Address(json.firstName, json.lastName, json.street1, json.street2,
      json.city, json.postalCode, json.state, json.country, json.phone, json.shortId, json.mailToName, json.zip, json.guid, json.valid);
  }
}
