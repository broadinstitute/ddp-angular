import { InputTypeEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { FillDate } from 'dsm/pages/tissue/interfaces/tissue-information-interfaces';

export interface OncHistoryInputsTypes {
  value?: string | number;
  lookupSelectIndex?: number;
  select?: OncHistorySelectRequestEnum,
  date?: FillDate,
}

export interface OncHistoryInputsMapValue {
  type: InputTypeEnum;
  hasLookup: boolean;
}

export interface OncHistoryDateInput {
  yyyy?: number,
  month?: number,
  dayOfMonth?: number
}

export interface OsteoOncHistoryUpload {
  RECORD_ID: string,
  REQUEST_STATUS: string;
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  ACCESSION?: string,
  FACILITY?: string,
  PHONE?: string;
  FAX?: string;
  DESTRUCTION?: string;
  BLOCKS_WITH_TUMOR?: string;
  TUMOR_SIZE?: string;
  LOCAL_CONTROL?: string;
  NECROSIS?: string;
  VIABLE_TUMOR?: string;
  FFPE?: string;
  DECALCIFICATION?: string;
  BLOCK_TO_REQUEST?: string;
}

export interface LmsOncHistoryUpload {
  RECORD_ID: string,
  FACILITY_PATH_REVIEW?: string,
  FACILITY_PX?: string;
  ACCESSION?: string,
  DATE_PX?: string,
  TYPE_PX?: string,
  LOCATION_PX?: string,
  HISTOLOGY?: string,
  REQUEST_STATUS: string;
  TUMOR_SIZE?: string;
  VIABLE_TUMOR?: string;
  NECROSIS?: string;
  TX_EFFECT?: string;
  BLOCKS_TO_REQUEST?: string;
  SLIDES_TO_REQUEST?: string;
  SLIDES_TOTAL?: string;
}
