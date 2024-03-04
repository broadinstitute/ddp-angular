import {KitsTable} from 'dsm/component/tables/kits-table';
import {APIRequestContext, expect, Locator, Page} from '@playwright/test';
import {waitForNoSpinner} from 'utils/test-utils';
import {assertTableHeaders} from 'utils/assertion-helper';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';
import { KitType, Label } from 'dsm/enums';

const { BSP_TOKEN, DSM_BASE_URL } = process.env;

export default class KitsReceivedPage extends KitsPageBase {
  PAGE_TITLE = 'Kits Received';
  TABLE_HEADERS = [Label.SHORT_ID, Label.SHIPPING_ID,
    Label.RECEIVED, Label.MF_CODE,
    Label.DDP_REALM, Label.TYPE, Label.SAMPLE_TYPE];


  constructor(readonly page: Page, private readonly request: APIRequestContext) {
      super(page);
  }

  get toLocator(): Locator {
    return this.page.locator('app-shipping');
  }

  public get getKitsTable(): KitsTable {
    return this.kitsTable;
  }

  public async goToPage(page: number): Promise<void> {
    await this.kitsTable.goToPage(page);
  }

  public async rowsPerPage(rows: rows): Promise<void> {
    await this.kitsTable.rowsPerPage(rows);
  }

  public async kitReceivedRequest(opts: { mfCode: string, isTumorSample?: boolean,
    accessionNumber?: string,
    tumorCollaboratorSampleID?: string }): Promise<void> {
    const { mfCode = '', isTumorSample = false, accessionNumber = null, tumorCollaboratorSampleID = null } = opts;
    if (!BSP_TOKEN) {
      throw Error('Invalid parameter: DSM BSP token is not provided.');
    }
    const response = await this.request.get(`${DSM_BASE_URL}/ddp/ClinicalKits/${mfCode}`, {
      headers: {
        Authorization: `Bearer ${BSP_TOKEN}`
      }
    });
    let jsonResponse;
    try {
      jsonResponse = await response.json()
    } catch (error) {
      throw new Error(`Couldn't send the kit received request - something went wrong\n${error}`)
    }
    expect(response.ok()).toBeTruthy();

    if (!isTumorSample) {
      expect(jsonResponse).toHaveProperty('kit_label', mfCode); //only kits get this
    }

    if (isTumorSample && accessionNumber != null && tumorCollaboratorSampleID != null) {
      expect(jsonResponse).toHaveProperty('accession_number', accessionNumber);
      expect(jsonResponse).toHaveProperty('sample_id', tumorCollaboratorSampleID);
    }
  }

  public async kitReceivedRequestForRGPKits(kitLabel: string, subjectID: string): Promise<void> {
    if (!BSP_TOKEN) {
      throw Error('Invalid parameter: DSM BSP token is not provided.');
    }
    const response = await this.request.get(`${DSM_BASE_URL}/ddp/Kits/${kitLabel}`, {
      headers: {
        Authorization: `Bearer ${BSP_TOKEN}`
      }
    });
    let jsonResponse;
    try {
      jsonResponse = await response.json()
    } catch (error) {
      throw new Error(`Couldn't send the kit received request - something went wrong\n${error}`)
    }
    expect(response.ok()).toBeTruthy();
    //RGP does not seem to have kit_label in its kit received json response
    expect(jsonResponse).toHaveProperty('collaboratorParticipantId', subjectID);
  }

  public async search(columnName: Label, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: Label): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  /* Assertions */

  public async assertReloadKitListBtn(): Promise<void> {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Received page - Reload Kit List Button is not visible')
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitType[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitCheckbox(kitType).toLocator()).toBeVisible()
    }
  }

  public async assertTableHeader(): Promise<void> {
    assertTableHeaders(await this.kitsTable.getHeaderTexts(), this.TABLE_HEADERS);
  }

  public async assertDisplayedRowsCount(count: number): Promise<void> {
    expect(await this.kitsTable.rows.count(),
      "Kits Received page - displayed rows count doesn't match the provided one")
      .toBe(count)
  }

  /* XPaths */
  private get reloadKitListBtnXPath(): string {
    return "//button[span[text()[normalize-space()='Reload Kit List']]]"
  }
}
