import { StudyInfo } from "./study-info";
import { DataSource } from "@angular/cdk/table";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";

export class StudyListingDataSource extends DataSource<StudyInfo> {
  constructor(private translator: TranslateService, private bucketUrl: string) {
    super();
  }

  public connect(): Observable<Array<StudyInfo>> {
    return this.translator.stream('Toolkit.StudyListing.Rows', {bucketUrl: this.bucketUrl}).pipe(map(x => x as Array<StudyInfo>));
  }

  public disconnect(): void { }
}
