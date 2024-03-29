import { Observable } from 'rxjs/index';
import { filter, pluck } from 'rxjs/operators';
import { InjectionToken, Provider } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


export const CURRENT_ACTIVITY_ID_TOKEN: InjectionToken<Observable<string>> = new InjectionToken<Observable<string>>(
  'A stream with activity id'
);

export const currentActivityIdProvider: Provider = {
  provide: CURRENT_ACTIVITY_ID_TOKEN,
  useFactory: (
    activatedRoute: ActivatedRoute,
  ) => activatedRoute.params.pipe(
    filter(({ id }: Params) => !!id),
    pluck('id')
  ),
  deps: [ActivatedRoute]
};


export const CURRENT_PARTICIPANT_ID_TOKEN: InjectionToken<Observable<string>> = new InjectionToken<Observable<string>>(
  'A stream with activity id'
);

export const currentParticipantIdProvider: Provider = {
  provide: CURRENT_PARTICIPANT_ID_TOKEN,
  useFactory: (
    activatedRoute: ActivatedRoute,
  ) => activatedRoute.queryParams.pipe(
    filter(({ participantGuid }: Params) => !!participantGuid),
    pluck('participantGuid')
  ),
  deps: [ActivatedRoute]
};
