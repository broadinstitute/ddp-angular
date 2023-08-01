import {expect, Locator, Page} from '@playwright/test';
import {MBCPageBase} from './mbc-page-base';
import {waitForNoSpinner} from '../../../utils/test-utils';
import * as user from '../../../data/fake-user.json';
import Institution from '../../component/institution';


export class MBCMedicalReleasePage extends MBCPageBase {
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = this.page.locator('h1.PageHeader-title');
  }

  public async waitForReady(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Medical Release Form');
    await waitForNoSpinner(this.page);
  }

  public async yourPhysicianName(
    opts: {
      physicianName?: string;
      institutionName?: string;
      city?: string;
      state?: string;
      nth?: number;
    } = {}
  ): Promise<void> {
    const {
      physicianName = user.doctor.name,
      institutionName = user.doctor.hospital,
      city = user.doctor.city,
      state = user.doctor.state,
      nth = 0,
    } = opts;

    const institution = new Institution(this.page, { label: /Physician/, nth });
    await institution.toInput('Physician Name').fill(physicianName);
    await institution.toInput('Institution').fill(institutionName);
    await institution.toInput('City').fill(city);
    await institution.toInput('State').fill(state);
  }

  /**
   * Question: Where was your initial biopsy for breast cancer performed?
   * @param opts
   */
  public async yourHospitalOrInstitution(
    opts: {
      institutionName?: string;
      city?: string;
      state?: string;
      nth?: number;
      label?: string | RegExp
    } = {}
  ): Promise<void> {
    const {
      institutionName = user.doctor.hospital,
      city = user.doctor.city,
      state = user.doctor.state,
      nth = 0,
      label = /Hospital/
    } = opts;

    const institution = new Institution(this.page, { label, nth});
    await institution.toInput('Institution').fill(institutionName);
    await institution.toInput('City').fill(city);
    await institution.toInput('State').fill(state);
  }

  /**
   * Question: Where were any other biopsies or surgeries for your breast cancer performed (i.e. biopsy, lumpectomy, partial mastectomy, mastectomy)?
   * @param nth
   */
  public async addAndFillAnotherInstitution(nth = 0): Promise<void> {
    const institution = new Institution(this.page, { label: /other biopsies/});
    await institution.toButton('ADD ANOTHER INSTITUTION').click();
    await this.yourHospitalOrInstitution({label: /institution/, nth});
  }
}
