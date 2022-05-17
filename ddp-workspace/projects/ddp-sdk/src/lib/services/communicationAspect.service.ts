import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Metadata } from 'kaop-ts';
import { NetworkingMock } from '../models/networkingMock';

@Injectable()
export class CommunicationAspect {
    static feed: Subject<string> = new Subject<string>();
    static interceptedFeeds: Array<NetworkingMock> = [];
    static initialize(): void { }
    static intrcept(meta: Metadata): void {
        const callInfo = `${CommunicationAspect.getHttpVerb(meta.key)} ${meta.scope.getBackendUrl() + meta.args[0]}`;
        const feedMessage = `${CommunicationAspect.getHttpVerb(meta.key)} ${meta.scope.getBackendUrl() + meta.args[0]}`;
        if (CommunicationAspect.interceptedFeeds.findIndex(x => x.key === callInfo) < 0) {
            let codes = [200];
            if (Array.isArray(meta.args[meta.args.length - 1])) {
                codes = codes.concat(meta.args[meta.args.length - 1]);
            }
            CommunicationAspect.interceptedFeeds.push({
                key: callInfo,
                mock: null,
                mocked: false,
                supportedCodes: codes,
                mockedCode: 200,
                returnNull: false
            });
        } else {
            const feedInfo = CommunicationAspect.interceptedFeeds.find(x => x.key === callInfo);
            if (feedInfo && feedInfo.mocked && feedInfo.mock) {
                if (feedInfo.returnNull) {
                    meta.result = of(null);
                } else {
                    const responseData = JSON.parse(feedInfo.mock);
                    meta.result = (feedInfo.mockedCode !== 200) ? throwError(() => responseData) : of(responseData);
                }
                meta.prevent();
            }
        }
        CommunicationAspect.feed.next(feedMessage);
    }

    static getNetworkFeed(): Observable<string> {
        return CommunicationAspect.feed;
    }

    private static getHttpVerb(observableMethod: string): string {
        return observableMethod.substring(0, observableMethod.indexOf('Observable')).toUpperCase();
    }
}

CommunicationAspect.initialize();
