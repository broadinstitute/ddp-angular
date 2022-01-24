import { TissueList } from './tissue-list.model';
import { Data } from '../participant-list/models/data.model';

export class TissueListWrapper {
  isSelected = false;

  constructor(public tissueList: TissueList, public data: Data) {
  }

  static parse(json): TissueListWrapper {
    const tissueList = TissueList.parse(json.tissueList);
    const data = Data.parse(json.data);
    return new TissueListWrapper(tissueList, data);
  }
}
