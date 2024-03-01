import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { OncHistoryInputsMapValue } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import { Label } from 'dsm/enums';

export const OncHistoryInputs = new Map<Label, OncHistoryInputsMapValue>()
  .set(Label.DATE_OF_PX, { type: InputTypeEnum.DATE, hasLookup: false })
  .set(Label.TYPE_OF_PX, { type: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(Label.LOCATION_OF_PX, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.HISTOLOGY, { type: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(Label.ACCESSION_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FACILITY, { type: InputTypeEnum.INPUT, hasLookup: true })
  .set(Label.PHONE, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FAX, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.DESTRUCTION_POLICY, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.TUMOR_SIZE, { type: InputTypeEnum.TEXTAREA, hasLookup: false })
  .set(Label.SLIDES_TO_REQUEST, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.FACILITY_WHERE_SAMPLE_WAS_REVIEWED, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.TOTAL_NUMBER_SLIDES_MENTIONED, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.BLOCK_TO_REQUEST, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.EXTENSIVE_TREATMENT_EFFECT, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.VIABLE_TUMOR, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.NECROSIS, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.VOCAB_CHECK, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(Label.ONC_HISTORY_DATE, { type: InputTypeEnum.DATE, hasLookup: false })
  .set(Label.REQUEST, { type: InputTypeEnum.SELECT, hasLookup: false });
