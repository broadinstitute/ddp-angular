import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserServiceAgent } from './userServiceAgent.service';

interface GetOptionsResponse {
  results: string[];
}

@Injectable()
export class DynamicSelectAnswerService extends UserServiceAgent<GetOptionsResponse> {
  getOptions(questionStableId: string): Observable<string[]> {
    return this.getObservable(
      `/studies/${this.configuration.studyGuid}/dynamic-question/${questionStableId}`,
    ).pipe(
      take(1),
      map(response => {
        return response === null ? [] : response.results;
      }),
    );
  }
}
