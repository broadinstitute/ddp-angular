import { Observable } from 'rxjs/index';
import { filter, map } from 'rxjs/operators';
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
    map(({ id }: Params) => id)
  ),
  deps: [ActivatedRoute]
};
