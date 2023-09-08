import {OncHistoryDateInput} from "../../../component/tabs/interfaces/onc-history-inputs-types";
import {TissueTypesEnum} from "../enums/tissue-information-enum";

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
