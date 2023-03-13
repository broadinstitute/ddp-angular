import { Page } from '@playwright/test';
import * as user from 'data/fake-user.json';
import Institution from 'lib/component/institution';
import { partial } from 'lodash';


/**
 * Labels for the mailing address widget, which can be
 * set differently for different studies
 */
interface MailingAddressLabels {
  city?: string;
  country?: string;
  phone?: string;
  state?: string;
  zip?: string;
}
interface PhysicianInstitutionLabels extends MailingAddressLabels {
  hospital?: string;
  name?: string;
}

const UIDefaultLabels: MailingAddressLabels = {
  phone: 'Phone',
  country: 'Country',
  state: 'State',
  city: 'City',
  zip: 'Zip Code'
};

const DefaultPhysicianHospitalUILabels: PhysicianInstitutionLabels = { ...UIDefaultLabels, name: 'Physician Name', hospital: 'Institution' };

export default abstract class {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  protected constructor(page: Page, baseURL: string) {
    this.page = page;
    this.baseUrl = baseURL;
  }

  async fillInPhysicianInstitution(
    opts: {
      physicianName?: string;
      institutionName?: string;
      city?: string;
      state?: string;
      country?: string;
      nth?: number;
      uiLabels?: PhysicianInstitutionLabels;
    } = {}
  ): Promise<void> {
    const {
      physicianName = user.doctor.name,
      institutionName = user.doctor.hospital,
      city = user.doctor.city,
      state = user.doctor.state,
      country = user.patient.country.name,
      nth = 0,
      uiLabels = {}
    } = opts;


    Object.keys(DefaultPhysicianHospitalUILabels).map((attribute: string) => uiLabels[attribute] = DefaultPhysicianHospitalUILabels[attribute]);
    //const x:string[]= Object.keys(DefaultPhysicianHospitalUILabels);


    //uiLabels = {hospital: "ABC"}


    (uiLabels && uiLabels.name) ? uiLabels?.name : "Physician"

  //  const { ...UIDefaultLabels } = uiLabels;

  // uiLabels.name = 'Physician Name';

    const institution = new Institution(this.page, { label: /Physician/, nth });
    await institution.input(uiLabels.name ??= 'Physician Name').fill(physicianName);
    await institution.input(uiLabels.hospital).fill(institutionName);
    await institution.input(uiLabels.city ??= 'City').fill(city);
    await institution.input(uiLabels.state ??= 'State').fill(state);
    await institution.input(uiLabels.country ??= 'Country').fill(country);
  }
}
