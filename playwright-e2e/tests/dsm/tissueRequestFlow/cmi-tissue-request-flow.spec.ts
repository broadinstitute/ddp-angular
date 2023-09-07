import {StudyEnum} from "../../../dsm/component/navigation/enums/selectStudyNav-enum";
import {test} from 'fixtures/dsm-fixture';
import ParticipantListPage from "../../../dsm/pages/participant-list-page";
import {AdditionalFilter} from "../../../dsm/component/filters/sections/search/search-enums";
import ParticipantPage from "../../../dsm/pages/participant-page/participant-page";
import {TabEnum} from "../../../dsm/component/tabs/enums/tab-enum";
import OncHistoryTab from "../../../dsm/component/tabs/onc-history-tab";
import {
  OncHistoryInputColumnsEnum,
  OncHistorySelectRequestEnum
} from "../../../dsm/component/tabs/enums/onc-history-input-columns-enum";
import {
  SequencingResultsEnum,
  TissueTypesEnum,
  TumorTypesEnum
} from "../../../dsm/pages/tissue-information-page/enums/tissue-information-enums";


test.describe('Tissue Request Flow', () => {
  const studies = [StudyEnum.LMS];

  for(const study of studies) {
    test(`Tissue Request Flow for ${study} study @dsm @feature`, async ({page, request}) => {
      const participantListPage = await ParticipantListPage.goto(page, study, request);

      const customizeViewPanel = participantListPage.filters.customizeViewPanel;
      await customizeViewPanel.open();
      await customizeViewPanel.selectColumns('Medical Record Columns', ['Institution Name']);
      // await customizeViewPanel.selectColumns('Research Consent Form Columns', ['Your Mailing Address *']);

      const searchPanel = participantListPage.filters.searchPanel;
      await searchPanel.open();
      await searchPanel.checkboxes('Status', {checkboxValues: ['Enrolled']});
      await searchPanel.text('Institution Name', {additionalFilters: [AdditionalFilter.NOT_EMPTY]});
      // await searchPanel.text('Your Mailing Address *', {additionalFilters: [AdditionalFilter.NOT_EMPTY]});
      await searchPanel.search();

      const participantListTable = participantListPage.participantListTable;
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(0);
      const shortID = await participantPage.getShortId();

      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, {select: OncHistorySelectRequestEnum.REQUEST })

      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(0);
      await tissueInformationPage.assertPageTitle();
      const tissue = tissueInformationPage.tissue();
      await tissueInformationPage.fillFaxSentDates({today: true})
      await tissue
        .fillMaterialsReceived(
          {uss: 666, block: 777, he: 888, scroll: 999, tissueType: TissueTypesEnum.SLIDE}
        )
      await tissue.fillPathologyReport('Yes');
      await tissue.fillTumorType(TumorTypesEnum.PRIMARY);
      await tissue.fillTissueSite('Tissue site');
      await tissue.fillTumorCollaboratorSampleID('Collaborator sample ID');
      await tissue.fillSKID('SK ID');
      await tissue.fillFirstSMID('First SM ID')
      await tissue.fillSMIDForHE('SM ID for H&E')
      await tissue.fillDateSentToGP({today: true});
      await tissue.fillSequencingResults(SequencingResultsEnum.SUCCESS);



      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.ASSIGNEE))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.REQUEST))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.SHORT_ID))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FULL_NAME))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_BIRTH))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_MAJORITY))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_DIAGNOSIS))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_PX))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TYPE_OF_PX))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.HISTOLOGY))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.ACCESSION_NUMBER))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TUMOR_SIZE))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.SLIDES_TO_REQUEST))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TOTAL_NUMBER_SLIDES_MENTIONED))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.BLOCK_TO_REQUEST))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.EXTENSIVE_TREATMENT_EFFECT))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.VIABLE_TUMOR))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.NECROSIS))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.VOCAB_CHECK))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FACILITY))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.PHONE))
      // console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FAX))

      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.REQUEST))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TYPE_OF_PX))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.LOCATION_OF_PX))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.HISTOLOGY))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.ACCESSION_NUMBER))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.PHONE))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FAX))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.DESTRUCTION_POLICY))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TUMOR_SIZE))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.SLIDES_TO_REQUEST))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TOTAL_NUMBER_SLIDES_MENTIONED))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.BLOCK_TO_REQUEST))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.EXTENSIVE_TREATMENT_EFFECT))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.VIABLE_TUMOR))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.NECROSIS))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.VOCAB_CHECK))
      // console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.REQUEST))
      //
      //
      //
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX, {date: {yyyy: 2023, month: 2, dayOfMonth: 4}})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, {value: 'Bilateral'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.LOCATION_OF_PX, {value: 'Somewhere there'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.HISTOLOGY, {value: 'also'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.ACCESSION_NUMBER, {value: 2312})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, {value: 'Memorial'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.PHONE, {value: 'also', force: false})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FAX, {value: 'also', force: true})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DESTRUCTION_POLICY, {value: 30})
      //
      // // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.ONC_HISTORY_DATE, {date: {yyyy: 2023, month: 2, dayOfMonth: 4}})
      //
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TUMOR_SIZE, {value: 13312})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.SLIDES_TO_REQUEST, {value: 'slides to request test'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED, {value: 'Facility'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TOTAL_NUMBER_SLIDES_MENTIONED, {value: 21})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.BLOCK_TO_REQUEST, {value: 'block is somewhere'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.EXTENSIVE_TREATMENT_EFFECT, {value: 'very good'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.VIABLE_TUMOR, {value: 21})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.NECROSIS, {value: 11})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.VOCAB_CHECK, {value: 'THERE WAS SOME'})
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, {select: OncHistorySelectRequestEnum.REQUEST })
      //
      // await oncHistoryTable.selectDeselectRow(0);
      // await oncHistoryTable.deleteRow(1);
      // await oncHistoryTable.openTissueInformationPage(0);


      // await page.waitForTimeout(2000);
    })
  }

})
