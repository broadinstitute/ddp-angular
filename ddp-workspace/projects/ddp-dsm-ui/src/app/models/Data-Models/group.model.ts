import {OptionModel} from './option.model';

export interface GroupModel {
  groupStableId: string;
  groupText: string;
  options: OptionModel[];
}
