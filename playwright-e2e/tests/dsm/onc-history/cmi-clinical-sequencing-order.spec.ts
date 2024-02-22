import { Page, expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import { AdditionalFilter, CustomViewColumns } from 'dsm/component/filters/sections/search/search-enums';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import OncHistoryTab from 'dsm/component/tabs/onc-history-tab';
import SequencingOrderTab from 'dsm/component/tabs/sequencing-order-tab';
import { OncHistoryInputColumnsEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { logInfo } from 'utils/log-utils';
import { getDate } from 'utils/date-utils';
import TissueInformationPage from 'dsm/pages/tissue/tissue-information-page';
import { SMIdEnum, TissueDynamicFieldsEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';

import crypto from 'crypto';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import Tissue from 'dsm/component/tissue';
import Input from 'dss/component/input';

/**
 * Create an Onc History with accession number, gender, etc.
 * Create a new tissue with date sent to GP and number of SM-IDS
 * Mark it as received through the ddp/ClinicalKits Endpoint
 *
 */

test.describe.serial('Onc History', () => {
  const studies = [StudyEnum.LMS];//, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Clinical Sequencing Order @${study} @dsm`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);

      const smID = `SM-ID-${crypto.randomUUID().toString().replace('-', '2').substring(0, 5).toUpperCase()}`;
      const acccessionNum = crypto.randomUUID().toString().replace('-', '').substring(0, 9).toUpperCase();

      let tumorCollaboratorSampleID: string;
      let shortID: string;

      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;
      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      const searchPanel = participantListPage.filters.searchPanel;

      // Find a participant
      await test.step('Search for participant that has Onc History tab', async () => {
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomViewColumns.DSM_COLUMNS, ['Onc History Created']);
        await customizeViewPanel.selectColumns(CustomViewColumns.RESEARCH_CONSENT_FORM, ['CONSENT_BLOOD', 'CONSENT_TISSUE']);

        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Enrolled'] });
        await searchPanel.dates('Onc History Created', { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.checkboxes('CONSENT_BLOOD', { checkboxValues: ['Yes'] });
        await searchPanel.checkboxes('CONSENT_TISSUE', { checkboxValues: ['Yes'] });
        await searchPanel.search();

        shortID = await participantListPage.findParticipantWithTab(
          { findPediatricParticipant: false, tab: TabEnum.ONC_HISTORY, uriString: 'ui/filterList'}
        );
        logInfo(`Short id: ${shortID}`);
        expect(shortID?.length).toBeTruthy();
      });

      // Open Onc History tab
      await participantListPage.filterListByShortId(shortID!);
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      // Fill out onc history in new row
      await test.step('Add new row in Onc History table', async () => {
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX,
          { date: { date: { yyyy: new Date().getFullYear(), month: new Date().getMonth(), dayOfMonth: new Date().getDate() }}}, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, { value: 'a', lookupSelectIndex: 3 }, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.LOCATION_OF_PX, { value: 'left hip' }, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.HISTOLOGY, { value: 'something' }, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.ACCESSION_NUMBER, { value: acccessionNum }, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, { value: 'ma', lookupSelectIndex: 0 }, lastRow);
        await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST }, lastRow);
      });

      // Open Tissue Request page
      const tissueInformationPage: TissueInformationPage = await oncHistoryTable.openTissueInformationPage(lastRow);
      await tissueInformationPage.waitForReady();

      await test.step('Set Fax Sent Date', async () => {
        const faxSentDate = await tissueInformationPage.getFaxSentDate();
        expect(faxSentDate?.trim()).toBe(''); // blank at first

        await tissueInformationPage.fillFaxSentDates({ today: true });
        await tissueInformationPage.selectGender('Male');
        await tissueInformationPage.fillNotes(`${getDate()} cmi-clinical-sequencing-order test`);

        // Go back to the Participant List page
        await tissueInformationPage.backToList();
        await participantListPage.waitForReady();
      });

      await test.step('Onc history status should be SENT', async () => {
        await expect(async () => {
          await participantListPage.reload();
          await participantListPage.filterListByShortId(shortID!);
          const participantPage = await participantListTable.openParticipantPageAt(0);
          const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
          const oncHistoryTable = oncHistoryTab.table;
          const status = await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.REQUEST, lastRow);
          expect(status).toStrictEqual(OncHistorySelectRequestEnum.SENT);
        }).toPass({timeout: 30000});
      });

      await test.step('Fill out tissue information', async () => {
        await oncHistoryTable.openTissueInformationPage(lastRow);

        await tissueInformationPage.fillTissueReceivedDate({ today: true });

        const tissue = await tissueInformationPage.tissue();

        await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: 1 });
        await tissue.fillField(TissueDynamicFieldsEnum.BLOCK, { inputValue: 0 });
        await tissue.fillField(TissueDynamicFieldsEnum.H_E, { inputValue: 0 });
        await tissue.fillField(TissueDynamicFieldsEnum.SCROLL, { inputValue: 0 });

        const smIDModal = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
        await smIDModal.fillInputs([smID]);
        await smIDModal.close();
        await tissue.fillField(TissueDynamicFieldsEnum.USS, { inputValue: 1 });

        const tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
        expect(tumorCollaboratorSampleIDPrefix?.length).toBeTruthy();

        tumorCollaboratorSampleID = `${tumorCollaboratorSampleIDPrefix}${crypto.randomUUID().toString().substring(0, 6).toUpperCase()}`;
        await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorCollaboratorSampleID });

        await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { dates: { today: true } });

        logInfo(`USS SM-IDS: ${smID}`);
        logInfo(`Tumor Collaborator Sample ID: ${tumorCollaboratorSampleID}`);
      });

      const sequencingOrder = page.locator('//tab[@heading="Sequencing Order"]');

      await test.step('Sequencing Order tab should be hidden before receive', async () => {
        await page.getByText('<< back to Participant Page').click();
        await participantPage.waitForReady();

        // Sequencing Order tab should be hidden before receive
        await expect(sequencingOrder).toHaveCount(0);
      });

      await test.step('Receive through the /ddp/ClinicalKits Endpoint', async () => {
        const kitsReceivedPage = await navigation.selectFromSamples<KitsReceivedPage>(SamplesNavEnum.RECEIVED);
        await kitsReceivedPage.waitForLoad();
        await kitsReceivedPage.kitReceivedRequest({
          mfCode: smID,
          isTumorSample: true,
          accessionNumber: acccessionNum,
          tumorCollaboratorSampleID: tumorCollaboratorSampleID!
        });
      });

      await test.step('Sequencing Order tab should be visible after receive', async () => {
        const participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.filterListByShortId(shortID!);
        const participantPage = await participantListTable.openParticipantPageAt(0);
        await expect(sequencingOrder).toHaveCount(1);
        const sequencingOrderTab = await participantPage.clickTab<SequencingOrderTab>(TabEnum.SEQUENCING_ORDER);
        await sequencingOrderTab.waitForReady();
        // todo
      });
    });
  }

  async function clearInput(page: Page, tissue: Tissue, field: TissueDynamicFieldsEnum): Promise<void> {
    const inputLocator = await tissue.getField(field);
    const input = new Input(page, { root: inputLocator });
    await input.clear();
    await input.blur();
  }
});
