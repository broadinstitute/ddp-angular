import { OncHistoryDateInput } from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import { InputTypeEnum } from 'dsm/component/tabs/enums/onc-history-input-columns-enum';
import { SequencingResultsEnum, TumorTypesEnum } from 'dsm/component/tissue';
import { TissueType } from 'dsm/enums';

export interface FillDate {
  date?: OncHistoryDateInput;
  today?: boolean;
}

export interface InputMap {
  type: InputTypeEnum;
  hasLookup: boolean;
  byText: boolean;
}

export interface FillInMap {
  inputValue?: string | number;
  select?: TumorTypesEnum | TissueType | SequencingResultsEnum | 'Yes' | 'No';
  dates?: FillDate;
}
