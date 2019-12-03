import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstitution } from '../../models/activity/activityInstitution';
import { ActivityInstitutionForm } from '../../models/activity/activityInstitutionForm';
import { MedicalProviderResponse } from '../../models/medicalProviderResponse';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MedicalProvidersServiceAgent extends UserServiceAgent<any>{
    constructor(
        session: SessionMementoService,
        @Inject("ddp.config") configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public createMedicalProvider(studyGuid: string, institutionType: string, form: ActivityInstitutionForm): Observable<MedicalProviderResponse> {
        return this.postObservable(`/studies/${studyGuid}/medical-providers/${institutionType}`, JSON.stringify(form)).pipe(
            map(data => data && data['body'])
        );
    }

    public updateMedicalProvider(studyGuid: string, institutionType: string, medicalProviderGuid: string, form: ActivityInstitutionForm): Observable<void> {
        return this.patchObservable(`/studies/${studyGuid}/medical-providers/${institutionType}/${medicalProviderGuid}`, JSON.stringify(form));
    }

    public getMedicalProviders(studyGuid: string, institutionType: string): Observable<ActivityInstitution[]> {
        return this.getObservable(`/studies/${studyGuid}/medical-providers/${institutionType}`);
    }

    public deleteMedicalProvider(studyGuid: string, institutionType: string, medicalProviderGuid: string): Observable<void> {
        return this.deleteObservable(`/studies/${studyGuid}/medical-providers/${institutionType}/${medicalProviderGuid}`);
    }
}