import {OncHistoryDateInput} from 'dsm/component/tabs/interfaces/onc-history-inputs-types';
import {TissueTypesEnum} from 'dsm/pages/tissue-information-page/enums/tissue-information-enum';
import {InputTypeEnum} from 'dsm/component/tabs/enums/onc-history-input-columns-enum';

export interface FillDate {
  date?: OncHistoryDateInput;
  today?: boolean;
}

export interface MaterialsReceived {
  uss?: number;
  block?: number;
  he?: number;
  scroll?: number;
  tissueType?: TissueTypesEnum;
}

export interface TissueInputsMapValue {
  type: InputTypeEnum;
  hasLookup: boolean;
  byText: boolean;
}
