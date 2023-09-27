import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { TissueInputsMapValue } from 'dsm/pages/tissue/interfaces/tissue-information-interfaces';
import { TissueDynamicFieldsEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';

export const tissueInputs = new Map<TissueDynamicFieldsEnum, TissueInputsMapValue>()
  .set(TissueDynamicFieldsEnum.NOTES, { type: InputTypeEnum.TEXTAREA, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.USS, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(TissueDynamicFieldsEnum.BLOCK, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(TissueDynamicFieldsEnum.H_E, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(TissueDynamicFieldsEnum.SCROLL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(TissueDynamicFieldsEnum.TISSUE_TYPE, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.EXPECTED_RETURN_DATE, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.RETURN_DATE, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.TRACKING_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.PATHOLOGY_REPORT, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.TUMOR_COLLABORATOR_SAMPLE_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.BLOCK_TO_SHL, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.SCROLLS_BACK_FROM_SHL, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.SK_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.FIRST_SM_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.SM_ID_FOR_H_E, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.DATE_SENT_TO_GP, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.SEQUENCING_RESULTS, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.TUMOR_TYPE, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.TISSUE_SITE, { type: InputTypeEnum.INPUT, hasLookup: true, byText: false })
  .set(TissueDynamicFieldsEnum.BLOCK_ID_TO_SHL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(TissueDynamicFieldsEnum.SHL_WORK_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false });
