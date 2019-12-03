import { Injectable } from '@angular/core';
import { SessionMementoService, UserActivityServiceAgent, ConsentServiceAgent } from 'ddp-sdk';
import { UserState } from '../model/userState';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class UserStateService {
    public studyGuid: string = 'TESTSTUDY1';
    private consentCode: string = '1S2G7MIPZT';
    private _state: UserState;

    constructor(
        private session: SessionMementoService,
        private activityServiceAgent: UserActivityServiceAgent,
        private consentServiceAgent: ConsentServiceAgent) {
        this.refreshState();
    }

    public refreshState(): Observable<UserState> {
        return this.session.sessionObservable.pipe(
            mergeMap(
                s => {
                    if (s != null) {
                        return this.getConsentState().pipe(
                            mergeMap(
                                _ => this.getPrequalifierState(),
                                (c, p) => {
                                    return {
                                        consent: c,
                                        prequalifier: p
                                    }
                                })
                        );
                    } else {
                        return of({
                            consent: null,
                            prequalifier: null
                        });
                    }
                },
                (s: any, x: any) => {
                    console.log(s);
                    return {
                        session: s != null,
                        consent: x.consent,
                        prequalifier: x.prequalifier
                    };
                }),
            mergeMap((x: any) => {
                if (!x.session) {
                    this._state = UserState.Login;
                } else if (x.consent == null) {
                    if (x.prequalifier == 'CREATED') {
                        this._state = UserState.Prequalifier;
                    } else if (x.prequalifier == 'IN_PROGRESS') {
                        // not qualified
                        this._state = UserState.NotQualified;
                    } else if (x.prequalifier == 'COMPLETE') {
                        this._state = UserState.Consent;
                    }
                } else {
                    if (x.consent == 'COMPLETE') {
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

    public getPrequalifierState(): Observable<string | null> {
        return this.getActivityState(this.studyGuid, 'PREQUALIFIER');
    }

    public getConsentState(): Observable<string | null> {
        return this.getActivityState(this.studyGuid, 'CONSENT');
    }

    private getActivityState(studyGuid: string, subtype: string): Observable<string | null> {
        return this.activityServiceAgent.getActivities(of(studyGuid)).pipe(
            map((x: any) => x.find(y => y.activitySubtype == subtype)),
            map((x: any) => {
                if (x && x.statusCode) {
                    return x.statusCode;
                }
                else {
                    return null;
                }
            })
        );
    }
}
