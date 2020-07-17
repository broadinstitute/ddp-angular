import { Observable, of, throwError } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService, UserProfile, SessionMementoService, UserProfileDecorator } from 'ddp-sdk';
import { UserServiceAgent } from '../../../../../ddp-sdk/src/lib/services/serviceAgents/userServiceAgent.service';
import { catchError, filter, first, map } from 'rxjs/operators';


@Injectable()
export class UserPreferencesServiceAgent extends UserServiceAgent<UserProfile> {
  constructor(
    session: SessionMementoService,
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService) {
    super(session, configuration, http, logger);
  }

  public get profile(): Observable<UserProfileDecorator> {
    return this.getObservable('/profile', {}, [400]).pipe(
      map(x => {
        if (x === null) {
          return null;
        }
        return new UserProfileDecorator(x);
      }),
      filter((data: UserProfileDecorator) => !!data && !!data.profile),
      first(null, null),
      catchError(e => {
        if (e.error && e.error.errorCode && e.error.errorCode === 'MISSING_PROFILE') {
          return of(new UserProfileDecorator());
        }
        return throwError(e);
      })
    );
  }

  public saveProfile(isNew: boolean, profile: UserProfile): Observable<any> {
    if (isNew) {
      profile.preferredLanguage = this.configuration.defaultLanguageCode;
      return this.postObservable('/profile', JSON.stringify(profile), {}, true)
        .pipe(catchError(e => {
          console.error('Error occured on user profile creation: ' + JSON.stringify(e));
          return throwError(e);
        }));
    } else {
      return this.patchObservable('/profile', JSON.stringify(profile), {}, true)
        .pipe(
          catchError(e => {
            return throwError(e);
          }),
          map(x => {
            if (x.body === null) {
              return null;
            }
            return new UserProfileDecorator(x.body);
          }),
          first());
    }
  }
}
