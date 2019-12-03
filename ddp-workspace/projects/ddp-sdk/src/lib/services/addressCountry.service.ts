import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from './logging.service';
import { ConfigurationService } from './configuration.service';
import { SessionMementoService } from './sessionMemento.service';
import { SessionServiceAgent } from './serviceAgents/sessionServiceAgent.service';
import { CountryAddressInfoSummary } from '../models/countryAddressInfoSummary';
import { CountryAddressInfo } from '../models/countryAddressInfo';
import { Observable, ReplaySubject } from 'rxjs';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CountryService extends SessionServiceAgent<CountryAddressInfo | CountryAddressInfoSummary[]> implements OnDestroy {
    // used to cache countries. Should never change after initial load
    private allCountryInfoSummariesSubject$: ReplaySubject<CountryAddressInfoSummary[]> = new ReplaySubject();
    private anchor: Subscription;

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
        this.initializeAllCountryInfoSummaries();
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public findCountryInfoByCode(countryCode: string): Observable<CountryAddressInfo | null> {
        return this.getObservable(`/addresscountries/${countryCode}`).pipe(
            map((data: any) => {
                if (data) {
                    return data as CountryAddressInfo;
                } else {
                    return null;
                }
            })
        );
    }

    public findCountryInfoSummariesByCode(countryCodes: string[]): Observable<CountryAddressInfoSummary[]> {
        return this.findAllCountryInfoSummaries().pipe(
            map((countries) => countries
                .filter((country) => countryCodes.indexOf(country.code) > -1))
        );
    }

    public findAllCountryInfoSummaries(): Observable<CountryAddressInfoSummary[]> {
        return this.allCountryInfoSummariesSubject$.asObservable();
    }

    private initializeAllCountryInfoSummaries(): void {
        this.anchor = this.getObservable('/addresscountries').pipe(
            map((data: any) => {
                if (data) {
                    return data as CountryAddressInfoSummary[];
                } else {
                    return [];
                }
            })
        ).subscribe(this.allCountryInfoSummariesSubject$);
    }
}
