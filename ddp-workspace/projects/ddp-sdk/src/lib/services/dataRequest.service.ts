import { Inject, Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../services/configuration.service';
import { LanguageService } from '../services/languageService.service';
import { LoggingService } from '../services/logging.service';
import { SessionMementoService } from '../services/sessionMemento.service';
import { ServiceAgent } from './serviceAgents/serviceAgent.service';
import { Observable, Subscription } from 'rxjs';
import { DataRequest } from '../models/dataRequest';

@Injectable()
export class DataRequestService extends ServiceAgent<any> implements OnDestroy {
  private userGuid: string;
  private anchor: Subscription = new Subscription();

  constructor(@Inject('ddp.config') configuration: ConfigurationService,
              private session: SessionMementoService,
              http: HttpClient,
              logger: LoggingService,
              language: LanguageService) {
    super(configuration, http, logger, language);

    const userGuid = this.session.sessionObservable.subscribe(x => {
      this.userGuid = x.userGuid;
      console.log(x);
    });
    this.anchor.add(userGuid);
  }

  ngOnDestroy(): void {
    this.anchor.unsubscribe();
  }

  public sendDataRequest(dataRequestOptions: DataRequest): Observable<any> {
    const dataRequest = JSON.stringify(dataRequestOptions);
    const formData = new FormData();
    formData.append('dataRequestOptions', dataRequest);
    formData.append('userGuid', this.userGuid);
    console.log(formData, this.userGuid);
    return this.postObservable(`/studies/${this.configuration.studyGuid}/data_request`, formData);
  }
}
