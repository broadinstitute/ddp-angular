import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { Label } from 'dsm/enums';
import { InputTypeMap } from './tissue-inputs-interface';

export const OncHistoryInputs = new Map<Label, InputTypeMap>()
  .set(Label.DATE_OF_PX, { inputType: InputTypeEnum.DATE, hasLookup: false })
  .set(Label.TYPE_OF_PX, { inputType: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(Label.LOCATION_OF_PX, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.HISTOLOGY, { inputType: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(Label.ACCESSION_NUMBER, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FACILITY, { inputType: InputTypeEnum.INPUT, hasLookup: true })
  .set(Label.PHONE, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FAX, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.DESTRUCTION_POLICY, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.TUMOR_SIZE, { inputType: InputTypeEnum.TEXTAREA, hasLookup: false })
  .set(Label.SLIDES_TO_REQUEST, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FACILITY_WHERE_SAMPLE_WAS_REVIEWED, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.TOTAL_NUMBER_SLIDES_MENTIONED, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.BLOCK_TO_REQUEST, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.EXTENSIVE_TREATMENT_EFFECT, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.VIABLE_TUMOR, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.NECROSIS, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.VOCAB_CHECK, { inputType: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.ONC_HISTORY_DATE, { inputType: InputTypeEnum.DATE, hasLookup: false })
  .set(Label.REQUEST, { inputType: InputTypeEnum.SELECT, hasLookup: false });
