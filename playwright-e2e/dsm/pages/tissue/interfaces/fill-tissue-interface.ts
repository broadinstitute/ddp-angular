import { SequencingResultsEnum, TissueTypesEnum, TumorTypesEnum } from 'dsm/pages/tissue/enums/tissue-information-enum';
import { FillDate } from './tissue-information-interfaces';

export interface FillTissue {
  inputValue?: string | number;
  select?: TumorTypesEnum | TissueTypesEnum | SequencingResultsEnum | 'Yes' | 'No';
  dates?: FillDate;
}
