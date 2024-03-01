import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import SequencingOrderTab from 'dsm/pages/tablist/sequencing-order-tab';
import { OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { logInfo } from 'utils/log-utils';
import { getDate } from 'utils/date-utils';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import KitsReceivedPage from 'dsm/pages/kitsInfo-pages/kitsReceived-page/kitsReceivedPage';
import { Navigation } from 'dsm/component/navigation/navigation';
import ParticipantPage from 'dsm/pages/participant-page';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { CustomizeView, DataFilter, Label, SM_ID, Tab } from 'dsm/enums';
import OncHistoryTab from 'dsm/pages/tablist/onc-history-tab';
import TissueRequestPage from 'dsm/pages/tablist-pages/tissue-request-page';

import crypto from 'crypto';


/**
 * Create an Onc History with accession number, gender, etc.
 * Create a new tissue with date sent to GP and number of SM-IDS
 * Mark it as received through API "/ddp/ClinicalKits"
 */

test.describe.serial('Create Onc History', () => {
  const studies = [StudyEnum.LMS];//, StudyEnum.OSTEO2];

  for (const study of studies) {
    test(`Clinical Sequencing Order @${study} @dsm`, async ({ page, request }) => {
      const navigation = new Navigation(page, request);
      let tumorCollaboratorSampleID: string;
      let shortID: string;

      const smID = `SM-ID-${crypto.randomUUID().toString().replace('-', '2').substring(0, 6).toUpperCase()}`;
      const acccessionNum = crypto.randomUUID().toString().replace('-', '').substring(0, 9).toUpperCase();

      const participantListPage = await ParticipantListPage.goto(page, study, request);
      const participantListTable = participantListPage.participantListTable;

      // Find a suitable participant
      await test.step('Search for participant that has Onc History tab', async () => {
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns(CustomizeView.DSM_COLUMNS, [Label.ONC_HISTORY_CREATED]);
        await customizeViewPanel.selectColumns(CustomizeView.RESEARCH_CONSENT_FORM, ['CONSENT_BLOOD', 'CONSENT_TISSUE']);

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes(Label.STATUS, { checkboxValues: [DataFilter.ENROLLED] });
        await searchPanel.dates(Label.ONC_HISTORY_CREATED, { additionalFilters: [DataFilter.EMPTY] });
        await searchPanel.checkboxes('CONSENT_BLOOD', { checkboxValues: [DataFilter.YES] });
        await searchPanel.checkboxes('CONSENT_TISSUE', { checkboxValues: [DataFilter.YES] });
        await searchPanel.search();

        shortID = await participantListPage.findParticipantWithTab(
          { findPediatricParticipant: false, tab: Tab.ONC_HISTORY, uri: 'ui/filterList'}
        );
        logInfo(`Participant Short ID: ${shortID}`);
        expect(shortID?.length).toBeTruthy();
      });

      // Open participant Onc History tab, create new Onc History row
      await participantListPage.filterListByShortId(shortID!);
      let participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      let oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();

      // Fill out new Onc History in empty row
      const oncHistoryTable = oncHistoryTab.table;
      const lastRow = await oncHistoryTable.getRowsCount() - 1;

      await oncHistoryTable.fillField(Label.DATE_OF_PX, { date: { today: true }}, lastRow);
      await oncHistoryTable.fillField(Label.TYPE_OF_PX, { value: 'a', lookupSelectIndex: 3 }, lastRow);
      await oncHistoryTable.fillField(Label.LOCATION_OF_PX, { value: 'left hip' }, lastRow);
      await oncHistoryTable.fillField(Label.HISTOLOGY, { value: 'something' }, lastRow);
      await oncHistoryTable.fillField(Label.ACCESSION_NUMBER, { value: acccessionNum }, lastRow);
      await oncHistoryTable.fillField(Label.FACILITY, { value: 'mass', lookupSelectIndex: 1 }, lastRow);
      await oncHistoryTable.fillField(Label.REQUEST, { select: OncHistorySelectRequestEnum.REQUEST }, lastRow);

      // Open Tissue Request page, set "Fax Sent" date
      const tissueRequestPage: TissueRequestPage = await oncHistoryTable.openTissueRequestAt(lastRow);

      const faxSentDate = await tissueRequestPage.getFaxSentDate();
      expect(faxSentDate.trim()).toBe(''); // Should be blank at first

      await tissueRequestPage.fillFaxSentDates({ today: true });
      await tissueRequestPage.selectGender('Male');
      await tissueRequestPage.fillNotes(`${getDate()} cmi-clinical-sequencing-order test`);

      // Go back to the Participant List page
      await tissueRequestPage.backToParticipantList();
      await participantListPage.waitForReady();

      await test.step('Onc History status in new rwo should change to "SENT"', async () => {
        await expect(async () => {
          await participantListPage.reload();
          await participantListPage.filterListByShortId(shortID!);
          participantPage = await participantListTable.openParticipantPageAt(0);
          oncHistoryTab = await participantPage.tablist(Tab.ONC_HISTORY).click<OncHistoryTab>();
          const status = await oncHistoryTab.table.getFieldValue(Label.REQUEST, lastRow);
          expect(status).toStrictEqual(OncHistorySelectRequestEnum.SENT);
        }).toPass({timeout: 30000});
      });

      await test.step('Fill out tissue information', async () => {
        await oncHistoryTab.table.openTissueRequestAt(lastRow);

        await tissueRequestPage.fillTissueReceivedDate({ today: true });

        const tissue = tissueRequestPage.tissue();
        await tissue.fillField(Label.USS_UNSTAINED, { inputValue: 1 });
        await tissue.fillField(Label.BLOCK, { inputValue: 0 });
        await tissue.fillField(Label.H_E, { inputValue: 0 });
        await tissue.fillField(Label.SCROLL, { inputValue: 0 });

        const smIDModal = await tissue.fillSMIDs(SM_ID.USS_SM_IDS);
        await smIDModal.fillInputs([smID]);
        await smIDModal.close();
        await tissue.fillField(Label.USS_UNSTAINED, { inputValue: 1 });

        const tumorCollaboratorSampleIDPrefix = await tissue.getTumorCollaboratorSampleIDSuggestedValue();
        expect(tumorCollaboratorSampleIDPrefix?.length).toBeTruthy();

        tumorCollaboratorSampleID = `${tumorCollaboratorSampleIDPrefix}${crypto.randomUUID().toString().substring(0, 6).toUpperCase()}`;
        await tissue.fillField(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputValue: tumorCollaboratorSampleID });

        await tissue.fillField(Label.DATE_SENT_TO_GP, { dates: { today: true } });

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
        await kitsReceivedPage.waitForReady();
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
        const sequencingOrderTab = await participantPage.tablist(Tab.SEQUENCING_ORDER).click<SequencingOrderTab>();
        await sequencingOrderTab.waitForReady();
        // todo
      });
    });
  }
});
