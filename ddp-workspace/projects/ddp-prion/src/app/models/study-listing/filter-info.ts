import { StudyInfo } from "./study-info";

export class FilterInfo {
  public columnIndex: number;
  public canFilter: boolean;
  public filterPlaceholder: string = null;

  private filterString: string = null;

  public constructor(columnIndex: number, canFilter: boolean, filterString: string = null, filterPlaceholder: string = null) {
    this.columnIndex = columnIndex;
    this.canFilter = canFilter;
    if (this.canFilter) {
      this.filterString = filterString;
      this.filterPlaceholder = filterPlaceholder;
    }
  }

  public isFiltered(): boolean {
    return this.canFilter && this.filterString !== null && this.filterString !== undefined;
  }

  public addFilter(filterString: string): void {
    if (this.canFilter && filterString !== null && filterString !== undefined) {
      this.filterString = filterString.toLowerCase();
    }
  }

  public getFilterString(): string {
    return this.filterString;
  }

  public isMatch(toCheck: string): boolean {
    return !this.canFilter || !this.isFiltered() || toCheck.toLowerCase().includes(this.filterString);
  }

  public studyInfoIsMatch(studyInfo: StudyInfo): boolean {
    return !this.isFiltered() || this.isMatch(studyInfo.colValues[this.columnIndex]);
  }
}
