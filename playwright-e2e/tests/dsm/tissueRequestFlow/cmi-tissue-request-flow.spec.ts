import {StudyEnum} from '../../../dsm/component/navigation/enums/selectStudyNav-enum';
import {test} from 'fixtures/dsm-fixture';
import ParticipantListPage from '../../../dsm/pages/participant-list-page';
import {AdditionalFilter} from '../../../dsm/component/filters/sections/search/search-enums';
import ParticipantPage from '../../../dsm/pages/participant-page/participant-page';
import {TabEnum} from '../../../dsm/component/tabs/enums/tab-enum';
import OncHistoryTab from '../../../dsm/component/tabs/onc-history-tab';
import {
  OncHistoryInputColumnsEnum,
  OncHistorySelectRequestEnum
} from '../../../dsm/component/tabs/enums/onc-history-input-columns-enum';
import {
  ProblemWithTissueEnum, SequencingResultsEnum, SMIdEnum, TissueDynamicFieldsEnum,
  TissueInformationEnum, TissueTypesEnum, TumorTypesEnum
} from '../../../dsm/pages/tissue-information-page/enums/tissue-information-enum';


test.describe('Tissue Request Flow', () => {
  const studies = [StudyEnum.LMS];

  for (const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({page, request}) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Medical Record Columns', ['Institution Name']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes('Status', {checkboxValues: ['Enrolled']});
      await searchPanel.text('Institution Name', {additionalFilters: [AdditionalFilter.NOT_EMPTY]});
      await searchPanel.search();

      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(1);
      const shortID = await participantPage.getShortId();

      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;

    })
  }
})
