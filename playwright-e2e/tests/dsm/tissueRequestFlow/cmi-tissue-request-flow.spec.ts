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
  ProblemWithTissueEnum, SequencingResultsEnum, SMIdEnum, TissueDynamicFieldsEnum,
  TissueInformationEnum, TissueTypesEnum, TumorTypesEnum
} from "../../../dsm/pages/tissue-information-page/enums/tissue-information-enum";


test.describe('Tissue Request Flow', () => {
  const studies = [StudyEnum.LMS];

  for (const study of studies) {
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
      const participantPage: ParticipantPage = await participantListTable.openParticipantPageAt(1);
      const shortID = await participantPage.getShortId();

      const oncHistoryTab = await participantPage.clickTab<OncHistoryTab>(TabEnum.ONC_HISTORY);
      const oncHistoryTable = oncHistoryTab.table;

      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.DATE_OF_PX));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TYPE_OF_PX));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.LOCATION_OF_PX));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.HISTOLOGY));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.ACCESSION_NUMBER));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.PHONE));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FAX));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.DESTRUCTION_POLICY));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TUMOR_SIZE));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.SLIDES_TO_REQUEST));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.TOTAL_NUMBER_SLIDES_MENTIONED));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.BLOCK_TO_REQUEST));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.EXTENSIVE_TREATMENT_EFFECT));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.VIABLE_TUMOR));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.NECROSIS));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.VOCAB_CHECK));
      console.log(await oncHistoryTable.getFieldValue(OncHistoryInputColumnsEnum.REQUEST));

      const testOncHistoryIndex = 4;
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DATE_OF_PX, {
        date: {
          date: {
            yyyy: 2023,
            dayOfMonth: 4,
            month: 4
          }
        }
      }, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TYPE_OF_PX, {value: 'Test Type of PX'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.LOCATION_OF_PX, {value: 'Test location of px'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.HISTOLOGY, {value: 'Test histology'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.ACCESSION_NUMBER, {value: 3312}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY, {value: 'Test Facility'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.PHONE, {value: '111-222-3333'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FAX, {value: '222-333-222'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.DESTRUCTION_POLICY, {value: 3344}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TUMOR_SIZE, {value: 'Test tumor size'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.SLIDES_TO_REQUEST, {value: 'Test slides to request'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED, {value: 'Test FACILITY RECEIVED'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.TOTAL_NUMBER_SLIDES_MENTIONED, {value: 5}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.BLOCK_TO_REQUEST, {value: 'Test block to request'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.EXTENSIVE_TREATMENT_EFFECT, {value: 'Test Extensive Treatment Effect'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.VIABLE_TUMOR, {value: 'Test viable tumor'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.NECROSIS, {value: 'Test necrosis'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.VOCAB_CHECK, {value: 'Test vocab check'}, testOncHistoryIndex)
      await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, {select: OncHistorySelectRequestEnum.ON_HOLD}, testOncHistoryIndex)
      await oncHistoryTable.fillNotes('TESTING OTHER NOTE 1123', testOncHistoryIndex);


      const tissueInformationPage = await oncHistoryTable.openTissueInformationPage(testOncHistoryIndex);

      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.ASSIGNEE))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.REQUEST))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.SHORT_ID))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FULL_NAME))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_BIRTH))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_MAJORITY))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_DIAGNOSIS))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.DATE_OF_PX))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TYPE_OF_PX))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.HISTOLOGY))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.ACCESSION_NUMBER))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TUMOR_SIZE))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.SLIDES_TO_REQUEST))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.TOTAL_NUMBER_SLIDES_MENTIONED))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.BLOCK_TO_REQUEST))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.EXTENSIVE_TREATMENT_EFFECT))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.VIABLE_TUMOR))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.NECROSIS))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.VOCAB_CHECK))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FACILITY))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.PHONE))
      console.log(await tissueInformationPage.getParticipantInformation(TissueInformationEnum.FAX))


      await tissueInformationPage.fillFaxSentDates({today: true}, {
        date: {
          yyyy: 2023,
          month: 4,
          dayOfMonth: 3
        }
      }, {date: {yyyy: 2023, month: 5, dayOfMonth: 13}});
      await tissueInformationPage.fillTissueReceivedDate({today: true});
      await tissueInformationPage.problemsWithTissue(ProblemWithTissueEnum.NO_PROBLEM, true);
      await tissueInformationPage.fillNotes('Test new note');
      await tissueInformationPage.fillDestructionPolicy(787, true);
      await tissueInformationPage.fillDestructionPolicy(787, false);
      await tissueInformationPage.selectGender('Male');


      const tissue = await tissueInformationPage.tissue();
      await tissue.fillField(TissueDynamicFieldsEnum.NOTES, {inputValue: 'Test Notes'});
      await tissue.fillField(TissueDynamicFieldsEnum.USS, {inputValue: 7766});
      await tissue.fillField(TissueDynamicFieldsEnum.BLOCK, {inputValue: 8899});
      await tissue.fillField(TissueDynamicFieldsEnum.H_E, {inputValue: 3212});
      await tissue.fillField(TissueDynamicFieldsEnum.SCROLL, {inputValue: 8800});
      await tissue.fillField(TissueDynamicFieldsEnum.TISSUE_TYPE, {select: TissueTypesEnum.BLOCK});
      await tissue.fillField(TissueDynamicFieldsEnum.EXPECTED_RETURN_DATE, {dates: {today: true}});
      await tissue.fillField(TissueDynamicFieldsEnum.RETURN_DATE, {
        dates: {
          date: {
            yyyy: 2023,
            month: 4,
            dayOfMonth: 3
          }
        }
      });
      await tissue.fillField(TissueDynamicFieldsEnum.TRACKING_NUMBER, {inputValue: 3322});
      await tissue.fillField(TissueDynamicFieldsEnum.PATHOLOGY_REPORT, {select: 'Yes'});
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_TYPE, {select: TumorTypesEnum.RECURRENT});
      await tissue.fillField(TissueDynamicFieldsEnum.TISSUE_SITE, {inputValue: 'Test tissue site'});
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, {inputValue: 'PWTVCT_312231' + new Date().getTime().toString().slice(-4)});
      await tissue.fillField(TissueDynamicFieldsEnum.BLOCK_TO_SHL, {
        dates: {
          date: {
            yyyy: 2023,
            month: 5,
            dayOfMonth: 13
          }
        }
      });
      await tissue.fillField(TissueDynamicFieldsEnum.SCROLLS_BACK_FROM_SHL, {
        dates: {
          date: {
            yyyy: 2023,
            month: 7,
            dayOfMonth: 22
          }
        }
      });
      await tissue.fillField(TissueDynamicFieldsEnum.SK_ID, {inputValue: 'Test SK ID' + new Date().getTime().toString().slice(-4)});
      await tissue.fillField(TissueDynamicFieldsEnum.FIRST_SM_ID, {inputValue: 'Test FIRST SM ID' + new Date().getTime().toString().slice(-4)});
      await tissue.fillField(TissueDynamicFieldsEnum.SM_ID_FOR_H_E, {inputValue: 'Test SM ID FOR H&E' + new Date().getTime().toString().slice(-4)});
      await tissue.fillField(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, {dates: {today: true}});
      await tissue.fillField(TissueDynamicFieldsEnum.BLOCK_ID_TO_SHL, {inputValue: 'Test Block ID to SHL' + new Date().getTime().toString().slice(-4)});
      await tissue.fillField(TissueDynamicFieldsEnum.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, {inputValue: 33});
      await tissue.fillField(TissueDynamicFieldsEnum.SHL_WORK_NUMBER, {inputValue: 9900});
      await tissue.fillField(TissueDynamicFieldsEnum.SEQUENCING_RESULTS, {select: SequencingResultsEnum.SUCCESS});


      const smids = await tissue.fillSMIDs(SMIdEnum.USS_SM_IDS);
      await smids.fillInputs([
        {value: 'smid22tes2t' + new Date().getTime().toString().slice(-4)},
        {value: 'smisdadtes2t' + new Date().getTime().toString().slice(-4)},
        {value: 'smidtes2t' + new Date().getTime().toString().slice(-4), selectCheckbox: true},
        'smid31tes2t' + new Date().getTime().toString().slice(-4),
        {value: 'smidte22s2t' + new Date().getTime().toString().slice(-4)},
        {value: 'smi33dtes2t' + new Date().getTime().toString().slice(-4), selectCheckbox: true}
      ]);
      await smids.deleteInputAt(1);
      console.log(await smids.getValueAt(0));
      console.log(await smids.getValueAt(1));
      await smids.onlyKeepSelectedSMIDs();

      // await smids.close();

      const smids2 = await tissue.fillSMIDs(SMIdEnum.H_E_SM_IDS);

      await smids2.fillInputs(['string2ds21543' + new Date().getTime().toString().slice(-4),
        'string_3ssmd52s2135' + new Date().getTime().toString().slice(-4),
        'string_3t42mds513' + new Date().getTime().toString().slice(-4),
        'string6_t1ms21313' + new Date().getTime().toString().slice(-4)]);
      await smids.deleteInputAt(0);
      console.log(await smids.getValueAt(0));
      console.log(await smids.getValueAt(1));
      await smids.close();

      const smids3 = await tissue.fillSMIDs(SMIdEnum.SCROLLS_SM_IDS);

      await smids3.fillInputs([
        {value: 'smidqtes9ti' + new Date().getTime().toString().slice(-4)},
        {value: 'smid5tes2313' + new Date().getTime().toString().slice(-4)},
        {value: 'smidte5511g1723' + new Date().getTime().toString().slice(-4), selectCheckbox: true},
        'somesmdstr53132312' + new Date().getTime().toString().slice(-4)
      ]);
      await smids.deleteInputAt(3)
      console.log(await smids.getValueAt(0));
      console.log(await smids.getValueAt(1));
      await smids.close();

      await tissueInformationPage.addTissue();
      await tissueInformationPage.deleteTissueByIndex(1);

      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.NOTES))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.USS))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.BLOCK))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.H_E))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.SCROLL))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TISSUE_TYPE))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.EXPECTED_RETURN_DATE))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.RETURN_DATE))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TRACKING_NUMBER))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.PATHOLOGY_REPORT))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TUMOR_TYPE))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TISSUE_SITE))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.BLOCK_TO_SHL))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.SK_ID))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.FIRST_SM_ID))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.SM_ID_FOR_H_E))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.DATE_SENT_TO_GP))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.BLOCK_ID_TO_SHL))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.SHL_WORK_NUMBER))
      console.log(await tissue.getFieldValue(TissueDynamicFieldsEnum.SEQUENCING_RESULTS))

      await tissueInformationPage.backToParticipantPage();

      await oncHistoryTab.openFilesOrderModal();
      await oncHistoryTab.selectFilesOrderAndDownload('Tissue Request PDF', 3);
      await oncHistoryTab.selectFilesOrderAndDownload('IRB Letter', 2);
      await oncHistoryTab.selectFilesOrderAndDownload('LMS parental consent & assent pdf', 7);
      await oncHistoryTab.downloadPDFBundleAfterOrder();

      // await oncHistoryTable.selectDeselectRow(0);
      // await oncHistoryTable.fillField(OncHistoryInputColumnsEnum.REQUEST, {select: OncHistorySelectRequestEnum.REQUEST});
      // await oncHistoryTab.downloadRequestDocuments();
      // await oncHistoryTab.downloadPDFBundle();
    })
  }

})
