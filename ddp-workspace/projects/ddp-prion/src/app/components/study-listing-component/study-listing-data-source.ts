import { StudyInfo } from "../../models/study-listing/study-info";
import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";

export class StudyListingDataSource extends DataSource<StudyInfo> {
  constructor(private translator: TranslateService, private bucketUrl: string, private filterBy: string) {
    super();
  }

  public connect(): Observable<Array<StudyInfo>> {
    return this.translator.stream('App.StudyListing.Rows', {bucketUrl: this.bucketUrl})
      .pipe(map(x => (x as Array<StudyInfo>).filter(x => this.rowMatchesFilter(x))));
  }

  private rowMatchesFilter(row: StudyInfo): boolean {
    return !this.isFiltered() || Object.values(row).some(element => this.elementMatchesFilter(element));
  }

  private isFiltered(): boolean {
    return this.filterBy !== undefined && this.filterBy !== null;
  }

  private elementMatchesFilter(elem: string): boolean {
    return elem.toLowerCase().includes(this.filterBy.toLowerCase());
  }

  public disconnect(): void { }
}
