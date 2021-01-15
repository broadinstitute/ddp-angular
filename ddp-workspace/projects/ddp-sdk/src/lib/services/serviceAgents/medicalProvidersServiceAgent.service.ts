import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstitution } from '../../models/activity/activityInstitution';
import { ActivityInstitutionForm } from '../../models/activity/activityInstitutionForm';
import { MedicalProviderResponse } from '../../models/medicalProviderResponse';
import { LanguageService } from '../internationalization/languageService.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MedicalProvidersServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public createMedicalProvider(studyGuid: string, institutionType: string, form: ActivityInstitutionForm): Observable<MedicalProviderResponse> {
        const baseUrl = this.getBaseUrl(studyGuid, institutionType);
        return this.postObservable(baseUrl, JSON.stringify(form)).pipe(
            map(data => data && data['body'])
        );
    }

    public updateMedicalProvider(studyGuid: string, institutionType: string, medicalProviderGuid: string, form: ActivityInstitutionForm): Observable<void> {
        const baseUrl = this.getBaseUrl(studyGuid, institutionType);
        return this.patchObservable(`${baseUrl}/${medicalProviderGuid}`, JSON.stringify(form));
    }

    public getMedicalProviders(studyGuid: string, institutionType: string): Observable<ActivityInstitution[]> {
        const baseUrl = this.getBaseUrl(studyGuid, institutionType);
        return this.getObservable(baseUrl);
    }

    public deleteMedicalProvider(studyGuid: string, institutionType: string, medicalProviderGuid: string): Observable<void> {
        const baseUrl = this.getBaseUrl(studyGuid, institutionType);
        return this.deleteObservable(`${baseUrl}/${medicalProviderGuid}`);
    }

    private getBaseUrl(studyGuid: string, institutionType: string): string {
        return `/studies/${studyGuid}/medical-providers/${institutionType}`;
    }
}
