import {InputTypeEnum, OncHistorySelectRequestEnum} from "../enums/onc-history-input-columns-enum";

export interface OncHistoryInputsTypes {
  value?: string | number;
  select?: OncHistorySelectRequestEnum,
  date?: OncHistoryDateInput,
  force?: boolean;
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
