import { Option } from './option.model';

export class Group {

  constructor(public groupStableId: string, public groupText: string, public options: Array<Option>) {
    this.groupStableId = groupStableId;
    this.groupText = groupText;
    this.options = options;
  }

  static parse(json): Group {
    return new Group(json.groupStableId, json.groupText, json.options);
  }

  isSelected(stableId: string): boolean {
    if (stableId === this.groupStableId) {
      return true;
    }
    return false;
  }
}
