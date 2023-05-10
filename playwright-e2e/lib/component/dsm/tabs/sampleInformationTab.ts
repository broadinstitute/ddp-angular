import {expect, Locator, Page} from "@playwright/test";
import {SampleInfoEnum} from "./enums/sampleInfo-enum";
import SampleInformation from "./model/sampleInformationModel";
import {KitTypeEnum} from "../kitType/enums/kitType-enum";

interface SampleInfo {
  [fieldName: string]: SampleInfoEnum;
}

export default class SampleInformationTab {
  constructor(private readonly page: Page) {}

  // collects all data about all available samples and stores them into memory
  public async collectData(): Promise<SampleInformation[]> {
    const samplesLocator: Locator = this.page.locator(this.getSampleFieldsetXPath);
    const samplesCount: number = await samplesLocator.count();
    const sampleInformationArray: SampleInformation[] = [];

    for(let s = 0; s < samplesCount; s++) {
      const sampleInformationInstance: SampleInformation = new SampleInformation();
      const sampleType = await samplesLocator.nth(s).locator('legend').textContent();
      const selectionValue: SampleInfo = {sampleNotes: SampleInfoEnum.SEQUENCING_RESTRICTIONS};

      const textsValues: SampleInfo = {
        status: SampleInfoEnum.STATUS,
        kitUploadType: SampleInfoEnum.KIT_UPLOAD_TYPE,
        normalCollaboratorSampleId: SampleInfoEnum.NORMAL_COLLABORATOR_SAMPLE_ID,
        MFBarcode: SampleInfoEnum.MF_BARCODE,
        sent: SampleInfoEnum.SENT,
        received: SampleInfoEnum.RECEIVED,
        results: SampleInfoEnum.RESULTS
      }

      const inputValues: SampleInfo = {
        collectionDate: SampleInfoEnum.COLLECTION_DATE,
        sampleNotes: SampleInfoEnum.SAMPLE_NOTES
      };

      sampleInformationInstance.type = sampleType?.split(':')[1].trim() || '';

      sampleInformationInstance.sequencingRestrictions =
        (await this.selectionAtFor(s, selectionValue.sampleNotes))?.trim() || '';

      sampleInformationInstance.deactivated = (await this.deactivatedText(s))?.trim() || '';

      for(let [key, sampleInfoName] of Object.entries(textsValues)) {
        sampleInformationInstance[key as keyof SampleInformation] = (await this.textAtFor(s, sampleInfoName))?.trim() || '';
      }

      for(let [key, sampleInfoName] of Object.entries(inputValues)) {
        sampleInformationInstance[key as keyof SampleInformation] = (await this.valueAtFor(s, sampleInfoName)).trim();
      }

      sampleInformationArray.push(sampleInformationInstance);
    }
    return sampleInformationArray;
  }

  /* Helper Functions */
  private async valueAtFor(at: number, sampleInfo: SampleInfoEnum): Promise<string> {
    const element = this.sampleFieldset.nth(at).locator(this.getSampleInfoForXPath(sampleInfo))
      .locator('input');
    return await element.isVisible() ? element.inputValue() : '';
  }

  private async textAtFor(at: number, sampleInfo: SampleInfoEnum): Promise<string | null> {
    const element = this.sampleFieldset.nth(at).locator(this.getSampleInfoForXPath(sampleInfo));
    return await element.isVisible() ?  element.textContent() : '';
  }

  private async selectionAtFor(at: number, sampleInfo: SampleInfoEnum): Promise<string | null> {
    const selection = this.sampleFieldset.nth(at).locator(this.getSampleInfoForXPath(sampleInfo) + '//span')
      .locator('span');
    return await selection.isVisible() ? selection.textContent() : '';
  }

  private deactivatedText(at: number): Promise<string | null> {
    return this.sampleFieldset.nth(at).locator(this.getDeactivatedSampleInfoXPath).textContent();
  }

  private get sampleFieldset(): Locator {
    return this.page.locator(this.getSampleFieldsetXPath)
  }

  /* Assertions */
  public async assertSampleByMFBarcode(MFBarcode: string, type: KitTypeEnum, {info, value}:
    {info: SampleInfoEnum, value: string}): Promise<void> {
    const MFBarcodeXPath = this.getSampleByMFBarcodeXPath(MFBarcode);

    await expect(this.page.locator(MFBarcodeXPath),
      `MFBarcode - '${MFBarcode}' can't be found`).toBeVisible();

    await expect(await this.page.locator(MFBarcodeXPath + this.ancestorSampleTypeXPath).textContent(),
      `Provided MFBarcode (${MFBarcode}) has different sample type than - ${type}`)
      .toContain(type);

    await expect(await this.page.locator(MFBarcodeXPath + this.ancestorSampleTextXPath(info)).textContent(),
      `Provided MFBarcode (${MFBarcode}) has different info in - ${info} (provided value: ${value})`)
      .toContain(value);
  }

  /* XPaths */
  private getSampleInfoForXPath(sampleInfo: SampleInfoEnum): string {
    return `//div/table/tr[td[contains(text(), '${sampleInfo}')]]/following-sibling::tr[1]/td`
  }

  private get getDeactivatedSampleInfoXPath(): string {
    return `//div/table/div/tr[td[contains(text(), 'Deactivated')]]/following-sibling::tr[1]/td`
  }

  private get getSampleFieldsetXPath(): string {
    return `//tab[@heading='Sample Information']/fieldset[legend[contains(text(),'Sample Type')]]`;
  }

  private getSampleByMFBarcodeXPath(MFCode: string): string {
    return `//tab[@heading='Sample Information']/fieldset//td[text()[normalize-space()='${MFCode}']]`
  }

  private get ancestorSampleTypeXPath(): string {
    return "/ancestor::fieldset/legend[contains(text(), 'SALIVA')]"
  }

  private ancestorSampleTextXPath(sampleInfo: SampleInfoEnum): string {
    return `/ancestor::table/tr[td[contains(text(), '${sampleInfo}')]]/following-sibling::tr[1]/td`
  }
}
