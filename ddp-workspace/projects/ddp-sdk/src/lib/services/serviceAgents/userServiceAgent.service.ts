import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class UserServiceAgent<TEntity> extends SessionServiceAgent<TEntity> implements OnDestroy {
    private userGuid: string;
    private anchor: Subscription;

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
        this.anchor = session.sessionObservable.pipe(
            filter(x => x !== null),
            map(x => {
                if (x.participantGuid !== null) {
                    return x.participantGuid;
                }
                return x.userGuid;
            })
        ).subscribe(x => this.userGuid = x);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl + '/pepper/v1/user/' + this.userGuid;
    }
}
