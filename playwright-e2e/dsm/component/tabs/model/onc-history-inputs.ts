import { InputTypeEnum, OncHistoryInputColumnsEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { OncHistoryInputsMapValue } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';

export const OncHistoryInputs = new Map<OncHistoryInputColumnsEnum, OncHistoryInputsMapValue>()
  .set(OncHistoryInputColumnsEnum.DATE_OF_PX, { type: InputTypeEnum.DATE, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.TYPE_OF_PX, { type: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(OncHistoryInputColumnsEnum.LOCATION_OF_PX, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.HISTOLOGY, { type: InputTypeEnum.TEXTAREA, hasLookup: true })
  .set(OncHistoryInputColumnsEnum.ACCESSION_NUMBER, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.FACILITY, { type: InputTypeEnum.INPUT, hasLookup: true })
  .set(OncHistoryInputColumnsEnum.PHONE, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.FAX, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.DESTRUCTION_POLICY, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.TUMOR_SIZE, { type: InputTypeEnum.TEXTAREA, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.SLIDES_TO_REQUEST, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.FACILITY_WHERE_SAMPLE_WAS_REVIEWED, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.TOTAL_NUMBER_SLIDES_MENTIONED, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.BLOCK_TO_REQUEST, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.EXTENSIVE_TREATMENT_EFFECT, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.VIABLE_TUMOR, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.NECROSIS, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.VOCAB_CHECK, { type: InputTypeEnum.INPUT, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.ONC_HISTORY_DATE, { type: InputTypeEnum.DATE, hasLookup: false })
  .set(OncHistoryInputColumnsEnum.REQUEST, { type: InputTypeEnum.SELECT, hasLookup: false });
