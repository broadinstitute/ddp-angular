import { expect } from '@playwright/test';
import { test } from 'fixtures/dsm-fixture';
import { Navigation, Samples, Study, StudyName } from 'dsm/component/navigation';
import GenomeStudyTab from 'dsm/component/tabs/genome-study-tab';
import ParticipantListPage from 'dsm/pages/participant-list-page';
import ParticipantPage from 'dsm/pages/participant-page';
import AtcpSearchPage, { SearchByField } from 'dsm/pages/kits-search-page';
import { WelcomePage } from 'dsm/pages/welcome-page';
import Radiobutton from 'dss/component/radiobutton';
import { getUtcDate } from 'utils/date-utils';
import { generateAlphaNumeric } from 'utils/faker-utils';
import { studyShortName, waitForNoSpinner, waitForResponse } from 'utils/test-utils';
import { logInfo } from 'utils/log-utils';
import { Tab } from 'dsm/enums';

test.describe('Receive Genome Study Kit', () => {
  const studies = [StudyName.AT];
  for (const study of studies) {
    let newBarcode = generateAlphaNumeric().toUpperCase();

    let shortId: string;

    let participantPage: ParticipantPage;
    let participantListPage: ParticipantListPage;
    let navigation: Navigation;

    test.beforeEach(async ({page, request}) => {
      navigation = new Navigation(page, request);
      const welcomePage = new WelcomePage(page);
      await welcomePage.selectStudy(study);
    });

    test(`Receive genome sample kit for ${study} @dsm @${study} @functional`, async ({page}) => {
      await test.step('Search for the right participant on Participant List page', async () => {
        participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        const rowIndex = await participantListPage.findParticipantFor('Genome Study Columns', 'Sample kit barcode for genome study', {nth: 1});

        const participantListTable = participantListPage.participantListTable;
        shortId = await participantListTable.getParticipantDataAt(rowIndex, 'Short ID');
        participantPage = await participantListTable.openParticipantPageAt(rowIndex);
        logInfo(`Participant Short ID: ${shortId}`);
      });

      await test.step('Set new sample kit barcode', async () => {
        newBarcode = `${shortId}-${newBarcode}`;
        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(Tab.GENOME_STUDY);
        const value = await genomeStudyTab.getField('Sample kit barcode for genome study').locator('input').inputValue();
        expect(value).toBe(''); // Sample Kit Barcode input should be empty

        await Promise.all([
          genomeStudyTab.setValue('Sample kit barcode for genome study', newBarcode),
          page.waitForResponse(resp => {
            return resp.url().includes('/ui/patch')
              && resp.status() === 200
              && (resp.request().postDataJSON().nameValues[0].value as string).includes(newBarcode)
          })
        ]);
        await participantPage.backToList();
      });

      await test.step('Mark sample kit barcode received', async () => {
        await navigation.selectFromSamples(Samples.SEARCH);
        const atSearchPage = new AtcpSearchPage(page);
        const table = await atSearchPage.searchByField(SearchByField.MANUFACTURE_BARCODE, newBarcode);

        const row = 0;
        expect(await table.getRowText(row, 'DDP-Realm')).toBe(studyShortName(study).shortName);
        expect(await table.getRowText(row, 'Short ID')).toBe(shortId);
        expect(await table.getRowText(row, 'MF barcode')).toBe(newBarcode);
        expect(await table.getRowText(row, 'Short ID')).toBe(shortId);

        const button = table.findButtonInCell(table.rowLocator(), { label: 'Mark Received' });
        await expect(button.toLocator()).toBeVisible();
        await Promise.all([
          waitForResponse(page, { uri: `ui/receivedKits?realm=${studyShortName(study).realm}&userId=` }),
          button.click()
        ]);
        await waitForNoSpinner(page);
      });

      await test.step('Verify participant detail has updated on Participant page', async () => {
        participantListPage = await navigation.selectFromStudy<ParticipantListPage>(Study.PARTICIPANT_LIST);
        await participantListPage.waitForReady();

        await participantListPage.filterListByShortId(shortId);
        await participantListPage.participantListTable.openParticipantPageAt(0);

        const genomeStudyTab = await participantPage.clickTab<GenomeStudyTab>(Tab.GENOME_STUDY);
        let field = genomeStudyTab.getField('Status of genome study sample kit');

        // "Sample kit received from participant" is checked
        const radiobuttonGroup = new Radiobutton(page, { root: field });
        expect(await radiobuttonGroup.isChecked('Sample kit received from participant')).toBe(true);

        // "Genome study date of receipt of sample kit from participant" will show the received date (today)
        field = genomeStudyTab.getField('Genome study date of receipt of sample kit from participant');
        const fieldValue = await field.locator('input[data-placeholder="mm/dd/yyyy"]').inputValue();
        expect(fieldValue).toBe(getUtcDate());
      });
    });
  }
});
