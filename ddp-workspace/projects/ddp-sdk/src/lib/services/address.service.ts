import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { UserServiceAgent } from './serviceAgents/userServiceAgent.service';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import { LanguageService } from './internationalization/languageService.service';
import { AddressVerificationStatus } from '../models/addressVerificationStatus';
import { Address } from '../models/address';
import { AddressVerificationResponse } from '../models/addressVerificationResponse';
import { NGXTranslateService } from './internationalization/ngxTranslate.service';

const ERROR_MSG_TRANS_KEY_PREFIX = 'SDK.MailAddress.Error.';

@Injectable()
export class AddressService extends UserServiceAgent<Address> {
    private readonly BASE_URL = '/profile/address';

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        private translate: NGXTranslateService,
        private __language: LanguageService) { // eslint-disable-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
        super(session, configuration, http, logger, __language);
    }

    public verifyAddress(address: Address): Observable<AddressVerificationResponse> {
        return this.postObservable(`${this.BASE_URL}/verify`, {...address, studyGuid: this.configuration.studyGuid}, null, true).pipe(
            map((data: any) => new AddressVerificationResponse(data.body)),
            catchError((error) => {
                const verificationStatus = error.error as AddressVerificationStatus;
                return this.translate.getTranslation(verificationStatus.errors
                    .map(addressError => ERROR_MSG_TRANS_KEY_PREFIX + addressError.code))
                    .pipe(
                        take(1),
                        map(codeToMsg => {
                            verificationStatus.errors = verificationStatus.errors.map(
                                addressError => ({ ...addressError, message: codeToMsg[ERROR_MSG_TRANS_KEY_PREFIX + addressError.code] }));
                            throw verificationStatus;
                        }));
            }));
    }

    public saveTempAddress(address: Address, activityInstanceGuid: string): Observable<any> {
        return this.putObservable(`${this.BASE_URL}/temp/${activityInstanceGuid}`, address, {}, true).pipe(
            // eslint-disable-next-line arrow-body-style
            catchError((error) => {
                return throwError(error.error);
            })
        );
    }

    public getTempAddress(activityInstanceGuid: string): Observable<Address | null> {
        return this.getObservable(`${this.BASE_URL}/temp/${activityInstanceGuid}`, {}, [404]).pipe(
            map((data: any) => {
                if (data) {
                    return new Address(data);
                } else {
                    return null;
                }
            }),
            // eslint-disable-next-line arrow-body-style
            catchError((error) => {
                return throwError(error.error);
            })
        );
    }

    public deleteTempAddress(activityInstanceGuid: string): Observable<any> {
        return this.deleteObservable(`${this.BASE_URL}/temp/${activityInstanceGuid}`, null, true);
    }

    public saveAddress(address: Address, strict = true): Observable<Address | null> {
        if (!address.guid || address.guid.trim().length === 0) {
            const path = this.BASE_URL + (strict ? '' : '?strict=false');
            return this.postObservable(path, address, null, true).pipe(
                map(
                    (data: any) => {
                        if (data && data.body) {
                            return new Address(data.body);
                        } else {
                            return null;
                        }
                    }),
                // eslint-disable-next-line arrow-body-style
                catchError((error) => {
                    return throwError(error.error);
                })
            );
        } else {
            const path = `${this.BASE_URL}/${address.guid}` + (strict ? '' : '?strict=false');
            return this.putObservable(path, address, {}, true).pipe(
                map(() => address),
                // eslint-disable-next-line arrow-body-style
                catchError((error) => {
                    return throwError(error.error);
                })
            );
        }
    }

    public getAddress(addressGuid: string): Observable<Address | null> {
        return this.getObservable(`${this.BASE_URL}/${addressGuid}`, {}, [404]).pipe(
            map((data: any) => {
                if (data) {
                    return new Address(data);
                } else {
                    return null;
                }
            }),
            // eslint-disable-next-line arrow-body-style
            catchError((error) => {
                return throwError(error.error);
            })
        );
    }

    public findDefaultAddress(): Observable<Address | null> {
        return this.getObservable(`${this.BASE_URL}/default`, {}, [404]).pipe(
            map((data: any) => {
                if (data) {
                    return new Address(data);
                } else {
                    return null;
                }
            }),
            // eslint-disable-next-line arrow-body-style
            catchError((error) => {
                return throwError(error.error);
            })
        );
    }

    public deleteAddress(addressOrGuid: Address | string): Observable<any> {
        const guid = addressOrGuid instanceof Address ? addressOrGuid.guid : addressOrGuid as string;
        return this.deleteObservable(`${this.BASE_URL}/${guid}`, null, true);
    }
}
