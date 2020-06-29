import { StudyInfo } from "../../models/study-listing/study-info";
import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";
import { FilterInfo } from "../../models/study-listing/filter-info";

export class StudyListingDataSource extends DataSource<StudyInfo> {
  private readonly filterBy: string = null;
  private shouldSort: boolean = false;
  private sortIndex: number = -1;
  private sortDir: string = null;

  constructor(private translator: TranslateService, private bucketUrl: string, filterBy: string, private columnFilters: FilterInfo[], shouldSort: boolean = false, sortIndex: number = -1, sortDir: string = null) {
    super();
    if (filterBy !== null && filterBy !== undefined) {
      this.filterBy = filterBy.toLowerCase();
    }
    if (shouldSort && sortIndex > -1 && sortDir !== null && (sortDir === 'asc' || sortDir == 'desc')) {
      this.shouldSort = shouldSort;
      this.sortDir = sortDir;
      this.sortIndex = sortIndex;
    }
    else {
      this.shouldSort = false;
      this.sortDir = null;
      this.sortIndex = -1;
    }
  }

  public connect(): Observable<Array<StudyInfo>> {
    return this.translator.stream('App.StudyListing.Rows')
      .pipe(map(x => (x as Array<StudyInfo>)
        .map(x => new StudyInfo(x.studyName, x.description, x.nameOfPI, x.site, x.eligibilityRequirements, x.moreInfo.replace('{{bucketUrl}}', this.bucketUrl)))
        .filter(x => this.rowMatchesFilter(x))
        .filter(x => this.rowMeetsColumnFilters(x))))
      .pipe(map(x => this.sortData(x)));
  }

  public disconnect(): void { }

  public updateSort(shouldSort: boolean = false, sortIndex: number = -1, sortDir: string = null): void {
    this.shouldSort = shouldSort;
    this.sortIndex = sortIndex;
    this.sortDir = sortDir;
    //TODO: Call this and make it update the observable somehow...  Maybe do
    //the workaround where we recreate the data source or use a BehaviorSource

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
