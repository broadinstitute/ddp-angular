import { expect } from '@playwright/test';
import { AdditionalFilter } from 'dsm/component/filters/sections/search/search-enums';
import { SamplesNavEnum } from 'dsm/component/navigation/enums/samplesNav-enum';
import { StudyEnum } from 'dsm/component/navigation/enums/selectStudyNav-enum';
import { StudyNavEnum } from 'dsm/component/navigation/enums/studyNav-enum';
import { Navigation } from 'dsm/component/navigation/navigation';
import { TabEnum } from 'dsm/component/tabs/enums/tab-enum';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page/participant-page';
import AtcpSearchPage, { SearchByField } from 'dsm/pages/samples/search-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Radiobutton from 'dss/component/radiobutton';
import { SortOrder } from 'dss/component/table';
import { test } from 'fixtures/dsm-fixture';
import { getUtcDate } from 'utils/date-utils';
import { generateAlphaNumeric } from 'utils/faker-utils';
import { logGenomeStudySampleKitReceived } from 'utils/log-utils';
import { studyShortName, waitForNoSpinner, waitForResponse } from 'utils/test-utils';

test.describe('Receive Kit', () => {
  const studies = [StudyEnum.AT];
  for (const study of studies) {
    let newBarcode = generateAlphaNumeric().toUpperCase();

    let shortId: string;
    let guid: string;

    let participantPage: ParticipantPage;
    let participantListPage: ParticipantListPage;
    let navigation: Navigation;

    test.beforeEach(async ({page, request}) => {
      navigation = new Navigation(page, request);
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(study);
    });

    test(`Receive genome sample kit for ${study} @dsm @${study} @functional`, async ({page, request}) => {
      await page.route('**/*', async (route, request): Promise<void> => {
         if (!shortId) {
           // only search for shortId one time to avoid duplicated searching
           let participantShortId;
           const regex = new RegExp(/realm=.*participantList/i);
           if (request.url().match(regex)) {
             const response = await route.fetch();
             const json = JSON.parse(await response.text());
             for (const i in json.participants) {
               const profile = json.participants[i].esData.profile;
               if (!profile.firstName.includes('E2E')) {
                 continue;
               }
               participantShortId = profile.hruid;
               const participantData = json.participants[i].esData.dsm.participantData;
               for (const dataId in participantData) {
                 const data = participantData[dataId].data as string;
                 if (data.includes('GENOME_STUDY_SPIT_KIT_BARCODE')) {
                   participantShortId = null;
                 }
               }
               if (participantShortId) {
                 shortId = participantShortId;
                 console.log('short id: ', shortId);
                 break; // finished searching for a participant who is Playwright automation test created and does not have genome study kit barcode
               }
             }
           }
         }
         return route.continue();
      });

      await test.step('Search for the right participant on Participant List page', async () => {
        participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        const participantsTable = participantListPage.participantListTable;

        // Search for a participant that meets the search criteria
        const customizeViewPanel = participantListPage.filters.customizeViewPanel;
        await customizeViewPanel.open();
        await customizeViewPanel.selectColumns('Participant Columns', ['Registration Date']);
        await customizeViewPanel.selectColumns('Genome Study Columns', ['Sample kit barcode for genome study'], { nth: 1 });
        await customizeViewPanel.close();

        const searchPanel = participantListPage.filters.searchPanel;
        await searchPanel.open();
        await searchPanel.checkboxes('Status', { checkboxValues: ['Registered', 'Enrolled'] });
        await searchPanel.text('Sample kit barcode for genome study', { additionalFilters: [AdditionalFilter.EMPTY] });
        await searchPanel.search();

        // Sort Registration Date from latest to oldest
        await participantsTable.sort('Registration Date', SortOrder.ASC);
      });

      await test.step('Verify participant detail on Participant page', async () => {
        // Open the Participant page
        const participantsTable = participantListPage.participantListTable;
        await participantListPage.filterListByShortId(shortId);

        logGenomeStudySampleKitReceived(shortId)

        const row = 0;
        const status = await participantsTable.getParticipantDataAt(row, 'Status');
        expect(status).toMatch(/Enrolled|Registered/);
        const rowShortId = await participantsTable.getParticipantDataAt(row, 'Short ID');
        expect(rowShortId).toBe(shortId);
        const registrationDate = await participantsTable.getParticipantDataAt(row, 'Registration Date', { exactMatch: false });

        participantPage = await participantsTable.openParticipantPageAt(row);

        expect(await participantPage.getStatus()).toBe(status);
        expect(await participantPage.getShortId()).toBe(shortId);
        expect(await participantPage.getRegistrationDate()).toBe(registrationDate);
        guid = await participantPage.getGuid();
      });

      await test.step('Set new sample kit barcode', async () => {
        newBarcode = `${shortId}-${newBarcode}`;
        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(TabEnum.GENOME_STUDY);
        await genomeStudyTab.setValue('Sample kit barcode for genome study', newBarcode);
        await participantPage.backToList();
      });

      await test.step('Mark sample kit barcode received', async () => {
        await navigation.selectFromSamples(SamplesNavEnum.SEARCH);
        const atSearchPage = new AtcpSearchPage(page);
        const table = await atSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, newBarcode);

        const row = 0;
        expect(await table.getRowText(row, 'DDP-Realm')).toBe(studyShortName(study).shortName);
        expect(await table.getRowText(row, 'Short ID')).toBe(shortId);
        expect(await table.getRowText(row, 'Collaborator Participant ID')).toBeTruthy();
        expect(await table.getRowText(row, 'MF barcode')).toBe(newBarcode);
        expect(await table.getRowText(row, 'Short ID')).toBe(shortId);

        const button = table.findButtonInCell(table.rowLocator(), { label: 'Mark Received' });
        await Promise.all([
          waitForResponse(page, { uri: `ui/receivedKits?realm=${studyShortName(study).realm}&userId=` }),
          button.click()
        ]);
        await waitForNoSpinner(page);
      });

      await test.step('Verify participant detail has updated on Participant page', async () => {
        participantListPage = await navigation.selectFromStudy<ParticipantListPage>(StudyNavEnum.PARTICIPANT_LIST);
        await participantListPage.filterListByShortId(shortId);
        await participantListPage.participantListTable.openParticipantPageAt(0);

        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(TabEnum.GENOME_STUDY);
        let field = await genomeStudyTab.getField('Status of genome study sample kit');

        // "Sample kit received from participant" is checked
        const radiobuttonGroup = new Radiobutton(page, { root: field });
        expect(await radiobuttonGroup.isChecked('Sample kit received from participant')).toBe(true);

        // "Genome study date of receipt of sample kit from participant" will show the received date (today)
        field = await genomeStudyTab.getField('Genome study date of receipt of sample kit from participant');
        const fieldValue = await field.locator('input[data-placeholder="mm/dd/yyyy"]').inputValue();
        expect(fieldValue).toBe(getUtcDate());
      });
    });
  }
});
