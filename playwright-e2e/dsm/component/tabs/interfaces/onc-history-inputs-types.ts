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
  readonly RECORD_ID: string,
  readonly DATE_PX: string,
  readonly TYPE_PX: string,
  readonly LOCATION_PX: string,
  readonly HISTOLOGY?: string,
  readonly ACCESSION?: string,
  readonly FACILITY?: string,
  readonly PHONE?: string;
  readonly FAX?: string;
  readonly DESTRUCTION?: string;
  readonly BLOCKS_WITH_TUMOR?: string;
  readonly TUMOR_SIZE?: string;
  readonly LOCAL_CONTROL?: string;
  readonly NECROSIS?: string;
  readonly VIABLE_TUMOR?: string;
  readonly FFPE?: string;
  readonly DECALCIFICATION?: string;
  readonly BLOCK_TO_REQUEST?: string;
  readonly REQUEST_STATUS: string;
}
