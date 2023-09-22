import {SequencingResultsEnum, TissueTypesEnum, TumorTypesEnum} from 'dsm/pages/tissue-information-page/enums/tissue-information-enum';
import {FillDate} from './tissue-information-interfaces';

export interface FillTissue {
  inputValue?: string | number;
  select?: TumorTypesEnum | TissueTypesEnum | SequencingResultsEnum | 'Yes' | 'No';
  dates?: FillDate;
}
