import {Locator, Page} from "@playwright/test";
import {KitTypeEnum} from "../kitType/enums/kitType-enum";
import {SampleInfoEnum} from "./enums/sampleInfo-enum";

export default class SampleInformationTab {
  constructor(private readonly page: Page) {
  }

  public async getStatus(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.STATUS);
  }

  public async getKitUploadType(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.KIT_UPLOAD_TYPE);
  }

  public async getNormalCollaboratorSampleId(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.NORMAL_COLLABORATOR_SAMPLE_ID);
  }

  public async getMFBarcode(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.MF_BARCODE);
  }

  public async getSent(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.SENT);
  }

  public async getReceived(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.RECEIVED);
  }

  public async getDeactivated(kitType: KitTypeEnum): Promise<string> {
    return await this.readInfoFor(kitType, SampleInfoEnum.DEACTIVATED);
  }

  /* Helper Functions */
  private async readInfoFor(kitType: KitTypeEnum, sampleInfo: SampleInfoEnum): Promise<string> {
    let sampleInfoLocator: Locator;
    switch (sampleInfo) {
      case SampleInfoEnum.DEACTIVATED:
        sampleInfoLocator = this.page.locator(this.getDeactivatedSampleInfoXPath(kitType));
        break;
      default:
        sampleInfoLocator = this.page.locator(this.getStandardSampleInfoXPath(kitType, sampleInfo));
      break;
    }
    return  await sampleInfoLocator.textContent() || '';
  }

  /* XPaths */
  private getStandardSampleInfoXPath(kitType: KitTypeEnum, sampleInfo: SampleInfoEnum): string {
    return this.getSampleInfoXPath(kitType) +`/tr[td[contains(text(), '${sampleInfo}')]]/following-sibling::tr[1]/td`
  }

  private getDeactivatedSampleInfoXPath(kitType: KitTypeEnum): string {
    return this.getSampleInfoXPath(kitType) + `div/tr[td[contains(text(), 'Deactivated')]]/following-sibling::tr[1]/td`
  }

  private getSampleInfoXPath(kitType: KitTypeEnum): string {
    return `//tab[@heading='Sample Information']/fieldset[legend[text()[normalize-space()='Sample Type: ${kitType}']]]` +
      `/div/table/`
  }
}
