import { Injectable } from '@angular/core';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { DrugSuggestionResponse } from '../../models/drugSuggestionResponse';
import { Observable } from 'rxjs';

@Injectable()
export class DrugServiceAgent extends SessionServiceAgent<any> {
    public findDrugSuggestions(query?: string, limit?: number): Observable<DrugSuggestionResponse> {
        const params = {
            ...query ? { q: query } : {},
            ...(limit && limit >= 0) ? { limit: limit } : {}
        };
        return this.getObservable(`/studies/${this.configuration.studyGuid}/suggestions/drugs`, { params: params });
    }
}
