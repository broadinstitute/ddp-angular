import { InputTypeEnum, OncHistorySelectRequestEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { SequencingResultsEnum, TumorTypesEnum } from 'dsm/component/tissue';
import { TissueType } from 'dsm/enums';


export interface DateFields {
  yyyy?: number,
  month?: number,
  dayOfMonth?: number
}

export interface FillDate {
  date?: DateFields;
  today?: boolean;
}

export interface InputTypeMap {
  inputType: InputTypeEnum;
  hasLookup: boolean;
  byText?: boolean;
}

export interface FillInMap {
  inputValue?: string | number;
  lookupIndex?: number;
  selection?: TumorTypesEnum | TissueType | SequencingResultsEnum | OncHistorySelectRequestEnum | 'Yes' | 'No';
  date?: FillDate;
}
