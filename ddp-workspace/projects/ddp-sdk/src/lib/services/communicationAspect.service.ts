import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError } from 'rxjs';
import { Metadata } from 'kaop-ts';
import { NetworkingMock } from '../models/networkingMock';

@Injectable()
export class CommunicationAspect {
    static feed: Subject<string> = new Subject<string>();
    static interceptedFeeds: Array<NetworkingMock> = new Array<NetworkingMock>();
    static initialize(): void { }
    static intrcept(meta: Metadata): void {
        let callInfo = `${CommunicationAspect.getHttpVerb(meta.key)} ${meta.scope.getBackendUrl() + meta.args[0]}`;
        let feedMessage = `${CommunicationAspect.getHttpVerb(meta.key)} ${meta.scope.getBackendUrl() + meta.args[0]}`;
        if (CommunicationAspect.interceptedFeeds.findIndex(x => x.key == callInfo) < 0) {
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
        }
        else {
            let feedInfo = CommunicationAspect.interceptedFeeds.find(x => x.key == callInfo);
            if (feedInfo && feedInfo.mocked && feedInfo.mock) {
                if (feedInfo.returnNull) {
                    meta.result = of(null);
                } else {
                    let responseData = JSON.parse(feedInfo.mock);
                    if (feedInfo.mockedCode != 200) {
                        meta.result = throwError(responseData);
                    } else {
                        meta.result = of(JSON.parse(feedInfo.mock));
                    }
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
        return observableMethod.substr(0, observableMethod.indexOf('Observable')).toUpperCase();
    }
}

CommunicationAspect.initialize();