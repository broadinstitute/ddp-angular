import { StudyInfo } from "../../models/study-listing/study-info";
import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { FilterInfo } from "../../models/study-listing/filter-info";

export class StudyListingDataSource extends DataSource<StudyInfo> {
  private baseData: StudyInfo[] = null;
  private filterBy: string = null;
  shouldSort: boolean = false;
  sortIndex: number = -1;
  sortDir: string = null;
  dataSubj: BehaviorSubject<StudyInfo[]>;

  constructor(private translator: TranslateService, private bucketUrl: string, private columnFilters: FilterInfo[]) {
    super();
    this.baseData = (this.translator.instant('App.StudyListing.Rows') as StudyInfo[])
      .map(x => new StudyInfo(x.studyName, x.description, x.nameOfPI, x.site, x.eligibilityRequirements,
        x.moreInfo.replace('{{bucketUrl}}', this.bucketUrl)));
    this.dataSubj = new BehaviorSubject<StudyInfo[]>(this.baseData);
    this.updateDataProcessing();
    this.translator.onLangChange.subscribe(() => this.updateTranslations());
  }

  connect(): BehaviorSubject<StudyInfo[]> {
    return this.dataSubj;
  }

  disconnect(): void { }

  updateDataProcessing() {
    let data = this.baseData.filter(x => this.rowMatchesFilter(x));
    data = data.filter(x => this.rowMeetsColumnFilters(x));
    data = this.sortData(data);
    this.dataSubj.next(data);
  }

  updateTranslations() {
    this.baseData = (this.translator.instant('App.StudyListing.Rows') as StudyInfo[])
      .map(x => new StudyInfo(x.studyName, x.description, x.nameOfPI, x.site, x.eligibilityRequirements,
        x.moreInfo.replace('{{bucketURL}}', this.bucketUrl)));
    this.updateDataProcessing();
  }

  public addSort(shouldSort: boolean = false, sortIndex: number = -1, sortDir: string = null): void {
    this.shouldSort = shouldSort;
    this.sortIndex = sortIndex;
    this.sortDir = sortDir;
    this.updateDataProcessing();
  }

  public addFilter(filterBy: string) {
    if (filterBy !== null && filterBy !== undefined && filterBy.length > 0) {
      this.filterBy = filterBy.toLowerCase();
    }
    else {
      this.filterBy = null;
    }
    this.updateDataProcessing();
  }

  public addColumnFilters(columnFilters: FilterInfo[]) {
    this.columnFilters = columnFilters;
    this.updateDataProcessing();
  }

  private isFiltered(): boolean {
    return this.filterBy !== undefined && this.filterBy !== null;
  }

  private rowMatchesFilter(row: StudyInfo): boolean {
    return !this.isFiltered() || row.getStringValues().some(element => element.toLowerCase().includes(this.filterBy.toLowerCase()));
  }

  private rowMeetsColumnFilters(row: StudyInfo): boolean {
    let validFilters: FilterInfo[] = this.columnFilters.filter(x => x.canFilter && x.isFiltered);
    return validFilters.length == 0 || validFilters.every(x => x.studyInfoIsMatch(row));
  }

  private sortData(rows: StudyInfo[]): StudyInfo[] {
    if (this.shouldSort && this.sortIndex > -1 && this.sortDir === 'asc' || this.sortDir === 'desc') {
      return rows.sort((a, b) => {
        const isAsc = this.sortDir === 'asc';
        return StudyListingDataSource.compare(a.getStringValues()[this.sortIndex], b.getStringValues()[this.sortIndex], isAsc);
      });
    }
    return rows;
  }

  private static compare(a: string, b: string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
