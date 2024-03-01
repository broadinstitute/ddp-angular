import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Label } from 'dsm/enums';
import { InputTypeMap } from 'dsm/component/models/tissue-inputs-interface';

export const TissueInputs = new Map<Label, InputTypeMap>()
  .set(Label.NOTES, { inputType: InputTypeEnum.TEXTAREA, hasLookup: false, byText: false })
  .set(Label.USS_UNSTAINED, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.BLOCK, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.H_E, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.SCROLL, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.TISSUE_TYPE, { inputType: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.EXPECTED_RETURN_DATE, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.RETURN_DATE, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.TRACKING_NUMBER, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.PATHOLOGY_REPORT, { inputType: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.BLOCK_TO_SHL, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SCROLLS_BACK_FROM_SHL, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SK_ID, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.FIRST_SM_ID, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.SM_ID_FOR_H_E, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.DATE_SENT_TO_GP, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SEQUENCING_RESULTS, { inputType: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TUMOR_TYPE, { inputType: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TISSUE_SITE, { inputType: InputTypeEnum.INPUT, hasLookup: true, byText: false })
  .set(Label.BLOCK_ID_TO_SHL, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.SHL_WORK_NUMBER, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: false });
