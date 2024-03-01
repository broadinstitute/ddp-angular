import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Label } from 'dsm/enums';
import { InputMap } from 'dsm/pages/models/input-interface';
// change to medical records page fields
export const medicalRecordsInputs = new Map<Label, InputMap>()
  .set(Label.NOTES, { type: InputTypeEnum.TEXTAREA, hasLookup: false, byText: false })
  .set(Label.USS_UNSTAINED, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.BLOCK, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.H_E, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.SCROLL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.TISSUE_TYPE, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.EXPECTED_RETURN_DATE, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.RETURN_DATE, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.TRACKING_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.PATHOLOGY_REPORT, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TUMOR_COLLABORATOR_SAMPLE_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.BLOCK_TO_SHL, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SCROLLS_BACK_FROM_SHL, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SK_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.FIRST_SM_ID, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.SM_ID_FOR_H_E, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.DATE_SENT_TO_GP, { type: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.SEQUENCING_RESULTS, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TUMOR_TYPE, { type: InputTypeEnum.SELECT, hasLookup: false, byText: false })
  .set(Label.TISSUE_SITE, { type: InputTypeEnum.INPUT, hasLookup: true, byText: false })
  .set(Label.BLOCK_ID_TO_SHL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.TUMOR_PERCENTAGE_AS_REPORTED_BY_SHL, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false })
  .set(Label.SHL_WORK_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false, byText: false });
