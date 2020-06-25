import { StudyInfo } from "../../models/study-listing/study-info";
import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";
import { FilterInfo } from "../../models/study-listing/filter-info";

export class StudyListingDataSource extends DataSource<StudyInfo> {
  private filterBy: string = null;
  constructor(private translator: TranslateService, private bucketUrl: string, filterBy: string, private columnFilters: FilterInfo[]) {
    super();
    if (filterBy !== null && filterBy !== undefined) {
      this.filterBy = filterBy.toLowerCase();
    }
  }

  public connect(): Observable<Array<StudyInfo>> {
    return this.translator.stream('App.StudyListing.Rows', {bucketUrl: this.bucketUrl})
      .pipe(map(x => (x as Array<StudyInfo>)
        .map(x => new StudyInfo(x.studyName, x.description, x.nameOfPI, x.site, x.eligibilityRequirements, x.moreInfo))
        .filter(x => this.rowMatchesFilter(x))
        .filter(x => this.rowMeetsColumnFilters(x))));
  }

  public disconnect(): void { }

  private isFiltered(): boolean {
    return this.filterBy !== undefined && this.filterBy !== null;
  }

  private rowMatchesFilter(row: StudyInfo): boolean {
    return !this.isFiltered() || Object.values(row).some(element => element.toLowerCase().includes(this.filterBy.toLowerCase()));
  }

  private rowMeetsColumnFilters(row: StudyInfo): boolean {
    let validFilters: FilterInfo[] = this.columnFilters.filter(x => x.canFilter && x.isFiltered);
    return validFilters.length == 0 || validFilters.every(x => x.studyInfoIsMatch(row));
  }
}
