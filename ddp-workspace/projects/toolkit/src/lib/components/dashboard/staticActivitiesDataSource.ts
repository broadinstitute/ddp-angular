import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { map } from "rxjs/operators";

export interface StaticActivity {
  name: string;
  summary: string;
}


export class StaticActivitiesDataSource extends DataSource<StaticActivity> {
  private nullSource: BehaviorSubject<boolean | null>;

  constructor(private translator: TranslateService){
    super();
    this.nullSource = new BehaviorSubject<boolean|null>(null);
  }

  public get isNull(): Observable<boolean | null> {
    return this.nullSource.asObservable();
  }

  public connect() {
    return this.translator.get(['Toolkit.Dashboard.StudyListing.ActivityName',
      'Toolkit.Dashboard.StudyListing.ActivityStatus']).pipe(
      map(x => {
        if (x == null) {
          return new Array<StaticActivity>();
        }
        else {
          let activities: Array<StaticActivity> = new Array<StaticActivity>();
          activities.push({name: x['Toolkit.Dashboard.StudyListing.ActivityName'], summary: x['Toolkit.Dashboard.StudyListing.ActivityStatus']});
          return activities;
        }
      })
    );

  }

public disconnect(): void { }

}
