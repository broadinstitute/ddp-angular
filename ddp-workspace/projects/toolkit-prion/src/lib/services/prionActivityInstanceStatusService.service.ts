import { Injectable } from '@angular/core';
import { PrionActivityInstanceState } from '../models/prionActivityInstanceState';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PrionActivityInstanceStatusService {
    constructor(private translator: TranslateService) {}

    public getStatuses(): Observable<Array<PrionActivityInstanceState>> {
        const createdObservable: Observable<PrionActivityInstanceState> = this
            .getStatusObservable('Toolkit.Dashboard.States.Created', 'CREATED');
        const inProgressObservable: Observable<PrionActivityInstanceState> = this
            .getStatusObservable('Toolkit.Dashboard.States.InProgress', 'IN_PROGRESS');
        const completedObservable: Observable<PrionActivityInstanceState> = this
            .getStatusObservable('Toolkit.Dashboard.States.Completed', 'COMPLETE');
        return combineLatest([createdObservable, inProgressObservable, completedObservable]);
    }

    private getStatusObservable(translateKey: string, code: string): Observable<PrionActivityInstanceState> {
        const translation: Observable<string> = this.translator.get(translateKey);
        return translation.pipe(map(val => new PrionActivityInstanceState(code, val)));
    }
}
