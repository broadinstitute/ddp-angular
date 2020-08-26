import { FilterInfo } from "./filter-info";

export class Column {
  columnName: string;
  columnTitleKey: string = null;
  columnIndex: number;
  filterInfo: FilterInfo;

  public constructor(columnIndex: number, canFilter: boolean, isFiltered: boolean = false, filterString: string = null) {
    this.columnName = 'App.StudyListing.Columns.' + columnIndex + '.name';
    this.columnTitleKey = 'App.StudyListing.Columns.' + columnIndex + '.title';
    this.columnIndex = columnIndex;

    let filteringString: string = null;
    let filteringPlaceholder: string = null;

    if (canFilter) {
      filteringPlaceholder = 'App.StudyListing.Columns.' + columnIndex + '.placeholder';
      if (isFiltered) {
        filteringString = filterString;
      }
    }
    this.filterInfo = new FilterInfo(columnIndex, canFilter, filteringString, filteringPlaceholder);
  }
}
