import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Label } from 'dsm/enums';
import { InputTypeMap } from 'dsm/component/models/tissue-inputs-interface';

export const MedicalRecordsInputs = new Map<Label, InputTypeMap>()
  .set(Label.NOTES, { inputType: InputTypeEnum.TEXTAREA, hasLookup: false, byText: false })
  .set(Label.CONFIRMED_INSTITUTION_NAME, { inputType: InputTypeEnum.INPUT, hasLookup: true, byText: true })
  .set(Label.CONTACT_PERSON, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.CONFIRMED_PHONE, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.CONFIRMED_FAX, { inputType: InputTypeEnum.INPUT, hasLookup: false, byText: true })
  .set(Label.INITIAL_MR_REQUEST, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false })
  .set(Label.EXPECTED_RETURN_DATE, { inputType: InputTypeEnum.DATE, hasLookup: false, byText: false });
