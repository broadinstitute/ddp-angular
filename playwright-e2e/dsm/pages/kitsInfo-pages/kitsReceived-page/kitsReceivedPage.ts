import {KitType} from 'dsm/component/kitType/kitType';
import {KitsTable} from 'dsm/component/tables/kits-table';
import {APIRequestContext, expect, Page} from '@playwright/test';
import {KitTypeEnum} from 'dsm/component/kitType/enums/kitType-enum';
import {waitForNoSpinner, waitForResponse} from 'utils/test-utils';
import {KitsColumnsEnum} from 'dsm/pages/kitsInfo-pages/enums/kitsColumns-enum';
import {assertTableHeaders} from 'utils/assertion-helper';
import {rows} from 'lib/component/dsm/paginators/types/rowsPerPage';
import KitsPageBase from 'dsm/pages/kits-page-base';

const { BSP_TOKEN, DSM_BASE_URL } = process.env;

export default class KitsReceivedPage extends KitsPageBase {
  private readonly PAGE_TITLE = 'Kits Received';
  private readonly TABLE_HEADERS = [KitsColumnsEnum.SHORT_ID, KitsColumnsEnum.SHIPPING_ID,
    KitsColumnsEnum.RECEIVED, KitsColumnsEnum.MF_CODE,
    KitsColumnsEnum.DDP_REALM, KitsColumnsEnum.TYPE, KitsColumnsEnum.SAMPLE_TYPE];

  private readonly kitType = new KitType(this.page);
  private readonly kitsTable = new KitsTable(this.page);

  constructor(private readonly page: Page, private readonly request: APIRequestContext) {
      super(page);
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

  public async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await waitForNoSpinner(this.page);
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

  public async search(columnName: KitsColumnsEnum, value: string): Promise<void> {
    await this.kitsTable.searchBy(columnName, value);
  }

  public async getData(columnName: KitsColumnsEnum): Promise<string> {
    return await this.kitsTable.getData(columnName);
  }

  /* Assertions */
  public async assertPageTitle(): Promise<void> {
    await expect(this.page.locator('h1'),
      'Kits Received page - page title is wrong')
      .toHaveText(this.PAGE_TITLE);
  }

  public async assertReloadKitListBtn(): Promise<void> {
    await expect(this.page.locator(this.reloadKitListBtnXPath),
      'Kits Received page - Reload Kit List Button is not visible')
      .toBeVisible();
  }

  public async assertDisplayedKitTypes(kitTypes: KitTypeEnum[]): Promise<void> {
    await waitForNoSpinner(this.page);
    for (const kitType of kitTypes) {
      await expect(this.kitType.displayedKitType(kitType),
        'Kits Received page - Displayed kit types checkboxes are wrong').toBeVisible()
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
