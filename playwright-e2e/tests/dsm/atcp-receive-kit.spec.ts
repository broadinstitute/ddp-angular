import { expect } from '@playwright/test';
import { MainMenuEnum } from 'dsm/component/navigation/enums/mainMenu-enum';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import AtcpSearchPage, { SearchByField } from 'dsm/pages/samples/atcp-search-page';
import Radiobutton from 'dss/component/radiobutton';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { getDate } from 'utils/date-utils';
import { generateAlphaNumeric } from 'utils/faker-utils';
import { waitForNoSpinner, waitForResponse } from 'utils/test-utils';

test.describe.skip('Participants Search', () => {
  let newSampleKitBarcode = generateAlphaNumeric().toUpperCase();

  let status: string;
  let shortId: string;
  let registrationDate: string;
  let guid: string;
  let oldSampleKitBarcode: string;

  let participantPage: ParticipantPage;
  let participantsPage: ParticipantListPage;
  let navigation: Navigation;

  const studies = [StudyEnum.AT];

  for (const study of studies) {
    test(`Receive sample kit for genome study in ${study} @dsm @${study}`, async ({ page, request }) => {
      navigation = new Navigation(page, request);

      await page.pause();

      await test.step('Search for a participant on Participant List page', async () => {
        participantsPage = await ParticipantListPage.goto(page, study, request);
        const participantsTable = participantsPage.participantListTable;

        // Search for a participant that meets the search criteria
        const customizeViewPanel = participantsPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Participant Columns', ['Registration Date']);
        await customizeViewPanel.selectColumns('Genome Study Columns', ['Sample kit barcode for genome study'], { nth: 1 });
        await customizeViewPanel.close();

        const searchPanel = participantsPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', {checkboxValues: ['Registered', 'Enrolled']});
        await searchPanel.search();

        // Sort Registration Date from oldest to latest
        await participantsTable.sort('Registration Date', SortOrder.DESC);

        const row = 0;
        status = await participantsTable.getParticipantDataAt(row, 'Status');
        expect(status).toMatch(/Enrolled|Registered/);
        shortId = await participantsTable.getParticipantDataAt(row, 'Short ID');
        expect(shortId.length).toEqual(6);
        registrationDate = await participantsTable.getParticipantDataAt(row, 'Registration Date', { exactMatch: false });
        oldSampleKitBarcode = await participantsTable.getParticipantDataAt(row, 'Sample kit barcode for genome study');

        // Open the Participant page
        participantPage = await participantsTable.openParticipantPageAt(row);
      })

      await page.pause();

      await test.step('Verify participant detail on Participant page', async () => {
        expect(await participantPage.getStatus()).toBe(status);
        expect(await participantPage.getShortId()).toBe(shortId);
        expect(await participantPage.getRegistrationDate()).toBe(registrationDate);
        guid = await participantPage.getGuid();
      })

      await page.pause();

      await test.step('Clear old or/and set new Sample Kit Barcode for the participant', async () => {
        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(TabEnum.GENOME_STUDY);
        if (oldSampleKitBarcode && oldSampleKitBarcode.trim().length > 0) {
          await genomeStudyTab.clearSelection('Status of genome study sample kit');
          await genomeStudyTab.clearValue('Tracking number for genome study sample kit');
          await genomeStudyTab.clearValue('Genome study sample kit shipped on');
          await genomeStudyTab.clearValue('Date genome study sample kit is received by participant');
          // await genomeStudyTab.clearValue('Sample kit barcode for genome study');
          await genomeStudyTab.clearValue('Genome study date of receipt of sample kit from participant');
          await genomeStudyTab.getField('Genome study date of receipt of sample kit from participant').press('Tab');
          await genomeStudyTab.setNotesAboutPreviousSampleKits(`Mark received by Playwright test on ${new Date()}`);
          // save happens after revisit participant page
          await participantPage.backToList();
          await openParticipantPageByShortId(shortId);
          // Open Genome Study tab
          await participantPage.clickTab<GenomeStudyTab>(TabEnum.GENOME_STUDY);
          newSampleKitBarcode = oldSampleKitBarcode;
        }
        await genomeStudyTab.setValue('Sample kit barcode for genome study', `${shortId}-${newSampleKitBarcode}`);
      })

      await participantPage.backToList();

      await page.pause();

      await test.step('Mark sample kit barcode received', async () => {
        await navigation.selectMenu(MainMenuEnum.SAMPLES, SamplesNavEnum.SEARCH);
        const atSearchPage = new AtcpSearchPage(page);
        const table = await atSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, newSampleKitBarcode);

        expect(await table.getRowInnerText(0, 'DDP-Realm')).toBe(getDdpRealm(study));
        expect(await table.getRowInnerText(0, 'Short ID')).toBe(shortId);
        expect(await table.getRowInnerText(0, 'Collaborator Participant ID')).toBeTruthy();
        expect(await table.getRowInnerText(0, 'MF barcode')).toBe(newSampleKitBarcode);
        expect(await table.getRowInnerText(0, 'Short ID')).toBe(shortId);

        const button = table.findButtonInCell(table.rowLocator(), { label: 'Mark Received' });
        await Promise.all([
          waitForResponse(page, { uri: 'ui/receivedKits?realm=atcp&userId=' }),
          button.click()
        ])
        await waitForNoSpinner(page);
      })

      await page.pause();

      await test.step('Verify participant detail has updated on Participant page', async () => {
        participantsPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await openParticipantPageByShortId(shortId);

        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(TabEnum.GENOME_STUDY);
        let field = await genomeStudyTab.getField('Status of genome study sample kit');

        // "Sample kit received from participant" is checked
        const radiobuttonGroup = new Radiobutton(page, { root: field });
        expect(await radiobuttonGroup.isChecked('Sample kit received from participant')).toBe(true);

        // "Genome study date of receipt of sample kit from participant" will show the received date (today)
        field = await genomeStudyTab.getField('Genome study date of receipt of sample kit from participant');
        const fieldValue = await field.locator('input[data-placeholder="mm/dd/yyyy"]').inputValue();
        expect(fieldValue).toBe(getDate());
      })
    });
  }

  async function openParticipantPageByShortId(shortId: string): Promise<void> {
    await participantsPage.waitForReady();

    const searchPanel = participantsPage.filters.searchPanel;
    await searchPanel.open();
    await searchPanel.text('Short ID', { textValue: shortId });
    await searchPanel.search();

    const participantsTable = participantsPage.participantListTable;
    await expect(await participantsTable.rowsCount).toBe(1);

    await participantsPage.participantListTable.openParticipantPageAt(0);
  }

  function getDdpRealm(study: string): string | null {
    let realm: string | null;
    switch (study) {
      case StudyEnum.AT:
        realm = 'AT';
        break;
      default:
        realm = null;
        break;
    }
    return realm;
  }
});
