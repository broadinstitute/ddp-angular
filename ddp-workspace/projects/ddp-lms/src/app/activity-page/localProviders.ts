import { Observable } from 'rxjs/index';
import { filter, pluck } from 'rxjs/operators';
import { InjectionToken, Provider } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


export const ACTUAL_PARTICIPANT_ID_TOKEN: InjectionToken<Observable<string>> = new InjectionToken<Observable<string>>(
  'Actual participant id token'
);

export const actualParticipantIdProvider: Provider = {
  provide: ACTUAL_PARTICIPANT_ID_TOKEN,
  useFactory: (
    activatedRoute: ActivatedRoute,
  ) => activatedRoute.queryParams.pipe(
    filter(({ participantGuid }: Params) => !!participantGuid),
    pluck('participantGuid')
  ),
  deps: [ActivatedRoute]
};
