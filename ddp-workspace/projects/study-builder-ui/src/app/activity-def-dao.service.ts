import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ObservableActivityDef } from './model/core-extended/observableActvityDef';
import { TestBostonCovidSurvey } from './testdata/testbostonCovidSurvey';
import { StudyConfigObjectFactory } from './model/core-extended/studyConfigObjectFactory';
import { ConfigurationService } from './configuration.service';

@Injectable({
    providedIn: 'root'
})
// NOTE: FIX BUILDING TestBostonCovid
// NOTE: FIX BUILDING TestBostonCovidSurvey
// NOTE: MAKE SURE ACTIVITIES LISTED CORRECTLY IN PULL-DOWN
export class ActivityDefDao {
    factory: StudyConfigObjectFactory;
    private allActivityDefinitionsSubject: BehaviorSubject<Array<ObservableActivityDef>>;
    readonly allActivityDefinitions$: Observable<Array<ObservableActivityDef>>;

    constructor(private config: ConfigurationService) {
        this.factory = new StudyConfigObjectFactory(config);
        this.allActivityDefinitionsSubject = new BehaviorSubject<Array<ObservableActivityDef>>(
            [this.factory.buildObservableActivityDef(TestBostonCovidSurvey)]);
        this.allActivityDefinitions$ = this.allActivityDefinitionsSubject.asObservable();
    }

    // @TODO: Move this to a persistence service when the time come
    public findAllActivityDefinitions(studyGuid: string): Observable<Array<ObservableActivityDef>> {
        return this.allActivityDefinitions$;
    }

    public saveActivityDef(activityDef: ObservableActivityDef): Observable<ObservableActivityDef> {
        this.allActivityDefinitionsSubject.next(this.allActivityDefinitionsSubject.value.concat(activityDef));
        return of(activityDef);
    }
}
