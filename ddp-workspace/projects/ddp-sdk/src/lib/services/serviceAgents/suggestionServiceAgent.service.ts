import { Injectable } from '@angular/core';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { DrugSuggestionResponse } from '../../models/drugSuggestionResponse';
import { CancerSuggestionResponse } from '../../models/cancerSuggestionResponse';
import { SuggestionQueryParameters } from '../../models/suggestionQueryParameters';
import { Observable } from 'rxjs';

@Injectable()
export class SuggestionServiceAgent extends SessionServiceAgent<any> {
    public findDrugSuggestions(query?: string, limit?: number): Observable<DrugSuggestionResponse> {
        const params = this.buildQueryParameters(query, limit);
        return this.getObservable(`/studies/${this.configuration.studyGuid}/suggestions/drugs`, { params });
    }

    public findCancerSuggestions(query?: string, limit?: number): Observable<CancerSuggestionResponse> {
        const params = this.buildQueryParameters(query, limit);
        return this.getObservable(`/studies/${this.configuration.studyGuid}/suggestions/cancers`, { params });
    }

    private buildQueryParameters(query?: string, limit?: number): SuggestionQueryParameters {
        return {
            ...query ? { q: query } : {},
            ...(limit && limit >= 0) ? { limit } : {}
        };
    }
}
