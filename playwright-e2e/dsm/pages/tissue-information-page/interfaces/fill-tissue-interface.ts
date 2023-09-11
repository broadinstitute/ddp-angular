import {SequencingResultsEnum, TissueTypesEnum, TumorTypesEnum} from "../enums/tissue-information-enum";
import {FillDate} from "./tissue-information-interfaces";

export interface FillTissue {
  inputValue?: string | number;
  select?: TumorTypesEnum | TissueTypesEnum | SequencingResultsEnum | 'Yes' | 'No';
  dates?: FillDate;
}
