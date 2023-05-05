export class ParticipantPageInfo {
  constructor(private readonly status: string,
              private readonly registrationDate: string,
              private readonly shortId: string,
              private readonly guid: string,
              private readonly firstName: string,
              private readonly lastName: string,
              private readonly email: string,
              private readonly doNotContact: boolean,
              private readonly dateOfBirth: string,
              private readonly dateOfDiagnosis: string,
              private readonly gender: string,
              private readonly preferredLanguage: string,
              private readonly contactInformation: ContactInformation) {
  }
}

export class ContactInformation {
  constructor(private readonly street1: string,
              private readonly city: string,
              private readonly state: string,
              private readonly country: string,
              private readonly zip: string,
              private readonly valid: boolean,
              private readonly phone: string) {
  }
}
