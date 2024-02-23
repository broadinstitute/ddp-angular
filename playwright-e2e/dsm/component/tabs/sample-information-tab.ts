import {expect, Locator, Page} from '@playwright/test';
import SampleInformation from 'dsm/component/tabs/model/sample-information-model';
import {Kit, Label} from 'dsm/enums';

interface SampleInfo {
  [fieldName: string]: Label;
}

export default class SampleInformationTab {
  constructor(private readonly page: Page) {}

  // collects all data about all available samples and stores them into memory
  public async collectData(): Promise<SampleInformation[]> {
    const samplesLocator: Locator = this.page.locator(this.getSampleFieldsetXPath);
    const samplesCount: number = await samplesLocator.count();
    const sampleInformationArray: SampleInformation[] = [];

    for (let s = 0; s < samplesCount; s++) {
      const sampleInformationInstance: SampleInformation = new SampleInformation();
      const sampleType = await samplesLocator.nth(s).locator('legend').textContent();
      const selectionValue: SampleInfo = {sampleNotes: Label.SEQUENCING_RESTRICTIONS};

      const textsValues: SampleInfo = {
        status: Label.STATUS,
        kitUploadType: Label.KIT_UPLOAD_TYPE,
        normalCollaboratorSampleId: Label.NORMAL_COLLABORATOR_SAMPLE_ID,
        MFBarcode: Label.MF_BARCODE,
        sent: Label.SENT,
        received: Label.RECEIVED,
        results: Label.RESULTS
      };

      const inputValues: SampleInfo = {
        collectionDate: Label.COLLECTION_DATE,
        sampleNotes: Label.SAMPLE_NOTES
      };

      sampleInformationInstance.type = sampleType?.split(':')[1].trim() || '';

      sampleInformationInstance.sequencingRestrictions =
        (await this.selectionAtFor(s, selectionValue.sampleNotes))?.trim() || '';

      sampleInformationInstance.deactivated = (await this.deactivatedText(s))?.trim() || '';

      for (const [key, sampleInfoName] of Object.entries(textsValues)) {
        sampleInformationInstance[key as keyof SampleInformation] = (await this.textAtFor(s, sampleInfoName))?.trim() || '';
      }

      for (const [key, sampleInfoName] of Object.entries(inputValues)) {
        sampleInformationInstance[key as keyof SampleInformation] = (await this.valueAtFor(s, sampleInfoName)).trim();
      }

      sampleInformationArray.push(sampleInformationInstance);
    }
    return sampleInformationArray;
  }

  /* Helper Functions */
  private async valueAtFor(at: number, sampleInfo: Label): Promise<string> {
    const element = this.sampleFieldset.nth(at).locator(this.getSampleInfoForXPath(sampleInfo))
      .locator('input');
    return await element.isVisible() ? element.inputValue() : '';
  }

  private async textAtFor(at: number, sampleInfo: Label): Promise<string | null> {
    const element = this.sampleFieldset.nth(at).locator(this.getSampleInfoForXPath(sampleInfo));
    return await element.isVisible() ? element.textContent() : '';
  }

  private async selectionAtFor(at: number, sampleInfo: Label): Promise<string | null> {
    const selection = this.sampleFieldset.nth(at).locator(`${this.getSampleInfoForXPath(sampleInfo)}//span`)
      .locator('span');
    return await selection.isVisible() ? selection.textContent() : '';
  }

  private async deactivatedText(at: number): Promise<string | null> {
    return await this.sampleFieldset.nth(at).locator(this.getDeactivatedSampleInfoXPath).textContent();
  }

  private get sampleFieldset(): Locator {
    return this.page.locator(this.getSampleFieldsetXPath)
  }

  /* Assertions */
  public async assertKitType(MFBarcode: string, type: Kit): Promise<void> {
    const MFBarcodeXPath = this.getSampleByMFBarcodeXPath(MFBarcode);

    await expect(this.page.locator(MFBarcodeXPath),
      `MFBarcode - '${MFBarcode}' can't be found`).toBeVisible();

    expect(await this.page.locator(MFBarcodeXPath + this.ancestorSampleTypeXPath(type)).textContent(),
      `Provided MFBarcode (${MFBarcode}) has different sample type than - ${type}`)
      .toContain(type);
  }

  public async assertValue(MFBarcode: string, {info, value}:
    {info: Label, value: string}): Promise<void> {
    const MFBarcodeXPath = this.getSampleByMFBarcodeXPath(MFBarcode);

    await expect(this.page.locator(MFBarcodeXPath),
      `MFBarcode - '${MFBarcode}' can't be found`).toBeVisible();

    const textValue = await this.page.locator(MFBarcodeXPath + this.ancestorSampleTextXPath(info))
      .textContent();

    expect(textValue?.trim(),
      `Provided MFBarcode (${MFBarcode}) has different info in - ${info} (provided value: ${value.trim()})`)
      .toContain(value.trim());
  }

  /* XPaths */
  private getSampleInfoForXPath(sampleInfo: Label): string {
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

  private ancestorSampleTypeXPath(type: Kit): string {
    return `/ancestor::fieldset/legend[contains(text(), ${type})]`
  }

  private ancestorSampleTextXPath(sampleInfo: Label): string {
    return `/ancestor::table/tr[td[contains(text(), '${sampleInfo}')]]/following-sibling::tr[1]/td`
  }
}
