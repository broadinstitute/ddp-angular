import {InputTypeEnum, OncHistorySelectRequestEnum} from '../enums/onc-history-input-columns-enum';
import {FillDate} from '../../../pages/tissue-information-page/interfaces/tissue-information-interfaces';

export interface OncHistoryInputsTypes {
  value?: string | number;
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
