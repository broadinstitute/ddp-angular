import { TissueList } from './tissue-list.model';
import { Data } from '../participant-list/models/data.model';

export class TissueListWrapper {

  isSelected:boolean = false;

  constructor(public tissueList: TissueList, public data: Data) {
    this.tissueList = tissueList;
    this.data = data;
  }

  static parse(json): TissueListWrapper {
    const tissueList = TissueList.parse(json.tissueList);
    const data = Data.parse(json.data);
    return new TissueListWrapper(tissueList, data);
  }
}
