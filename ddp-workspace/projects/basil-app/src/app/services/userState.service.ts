import { Injectable } from '@angular/core';
import { SessionMementoService, UserActivityServiceAgent, ConsentServiceAgent, LoggingService, Session } from 'ddp-sdk';
import { UserState } from '../model/userState';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class UserStateService {
    public studyGuid = 'TESTSTUDY1';
    private consentCode = '1S2G7MIPZT';
    private _state: UserState;
    private readonly LOG_SOURCE = 'UserStateService';

    constructor(
        private logger: LoggingService,
        private session: SessionMementoService,
        private activityServiceAgent: UserActivityServiceAgent,
        private consentServiceAgent: ConsentServiceAgent) {
        this.refreshState();
    }

    public refreshState(): Observable<UserState> {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const getConsent = (c, p) => ({
            consent: c,
            prequalifier: p
        });

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const getConsentConfig =  (s: any, x: any) => {
            this.logger.logEvent(`${this.LOG_SOURCE} %o`, s);
            return {
                session: s != null,
                consent: x.consent,
                prequalifier: x.prequalifier
            };
        };

        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const getConsentAndPrequalifier = (session: Session) => {
            if (session != null) {
                return this.getConsentState().pipe(
                    mergeMap(() => this.getPrequalifierState().pipe(
                        map(getConsent)
                    ))
                );
            } else {
                return of(getConsent(null, null));
            }
        };

        return this.session.sessionObservable.pipe(
            mergeMap((s: Session) => getConsentAndPrequalifier(s).pipe(
                    map(getConsentConfig)
                )
            ),
            mergeMap((x: any) => {
                if (!x.session) {
                    this._state = UserState.Login;
                } else if (x.consent == null) {
                    if (x.prequalifier === 'CREATED') {
                        this._state = UserState.Prequalifier;
                    } else if (x.prequalifier === 'IN_PROGRESS') {
                        // not qualified
                        this._state = UserState.NotQualified;
                    } else if (x.prequalifier === 'COMPLETE') {
                        this._state = UserState.Consent;
                    }
                } else {
                    if (x.consent === 'COMPLETE') {
                        // see if user agreed a consent
                        return this.checkConsent();
                    } else {
                        this._state = UserState.Consent;
                    }
                }
                return of(this._state);
            })
        );
    }

    public getPrequalifierState(): Observable<string | null> {
        return this.getActivityState(this.studyGuid, 'PREQUALIFIER');
    }

    public getConsentState(): Observable<string | null> {
        return this.getActivityState(this.studyGuid, 'CONSENT');
    }

    private checkConsent(): Observable<UserState> {
        return this.consentServiceAgent.getSummary(this.studyGuid, this.consentCode).pipe(
            mergeMap(((x: any) => {
                if (x && x.consented) {
                    this._state = UserState.Dashboard;
                } else {
                    this._state = UserState.NotConsented;
                }
                return of(this._state);
            }))
        );
    }

    private getActivityState(studyGuid: string, subtype: string): Observable<string | null> {
        return this.activityServiceAgent.getActivities(of(studyGuid)).pipe(
            map((x: any) => x.find(y => y.activitySubtype === subtype)),
            map((x: any) => {
                if (x && x.statusCode) {
                    return x.statusCode;
                } else {
                    return null;
                }
            })
        );
    }
}
