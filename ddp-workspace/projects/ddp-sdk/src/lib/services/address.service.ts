import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './serviceAgents/userServiceAgent.service';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import { AddressVerificationStatus } from '../models/addressVerificationStatus';
import { Address } from '../models/address';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AddressService extends UserServiceAgent<Address> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public verifyAddress(address: Address): Observable<Address> {
        return this.postObservable('/profile/address/verify', address, null, true).pipe(
            map((data: any) => {
                return new Address(data.body);
            }),
            catchError((error) => {
                return throwError(error.error as AddressVerificationStatus);
            })
        );
    }

    public saveTempAddress(address: Address, activityInstanceGuid: string): Observable<any> {
        return this.putObservable('/profile/address/temp/' + activityInstanceGuid, address, {}, true).pipe(
            catchError((error) => {
                return throwError(error.error);
            })
        );
    }

    public getTempAddress(activityInstanceGuid: string): Observable<Address | null> {
        return this.getObservable('/profile/address/temp/' + activityInstanceGuid).pipe(
            map((data: any) => {
                if (data) {
                    return new Address(data);
                } else {
                    return null;
                }
            })
        );
    }

    public deleteTempAddress(activityInstanceGuid: string): Observable<any> {
        return this.deleteObservable('/profile/address/temp/' + activityInstanceGuid, null, true);
    }

    public saveAddress(address: Address, strict = true): Observable<Address | null> {
        if (!address.guid || address.guid.trim().length === 0) {
            const path = '/profile/address' + (strict ? '' : '?strict=false');
            return this.postObservable(path, address, null, true).pipe(
                map(
                    (data: any) => {
                        if (data && data.body) {
                            return new Address(data.body);
                        } else {
                            return null;
                        }
                    }),
                catchError((error) => {
                    return throwError(error.error);
                })
            );
        } else {
            const path = '/profile/address/' + address.guid + (strict ? '' : '?strict=false');
            return this.putObservable(path, address, {}, true).pipe(
                map(() => {
                    return null;
                }),
                catchError((error) => {
                    return throwError(error.error);
                })
            );
        }

    }

    public findDefaultAddress(): Observable<Address | null> {
        return this.getObservable('/profile/address/default').pipe(
            map((data: any) => {
                if (data) {
                    return new Address(data);
                } else {
                    return null;
                }
            })
        );
    }

    public deleteAddress(addressOrGuid: Address | string): Observable<any> {
        const guid = addressOrGuid instanceof Address ? addressOrGuid.guid : addressOrGuid as string;
        return this.deleteObservable('/profile/address/' + guid, null, true);
    }
}
