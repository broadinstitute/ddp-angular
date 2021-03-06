import { AdminServiceAgent } from './adminServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Study } from '../../models/study';
import { FireCloudWorkspace } from '../../models/fireCloudWorkspace';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

@Injectable()
export class FireCloudServiceAgent extends AdminServiceAgent<any> {
    public currentListStudiesMessage: Observable<string>;
    public currentListWorkspacesMessage: Observable<string>;
    public currentListWorkspaceNamespacesMessage: Observable<string>;
    public currentExportSuccessStatus: Observable<string>;
    private listStudiesMessageSource = new BehaviorSubject<string>('default message');
    private listWorkspacesMessageSource = new BehaviorSubject<string>('default message');
    private listWorkspaceNamespaceMessageSource = new BehaviorSubject<string>('default message');
    private exportSuccessIndicatorSource = new BehaviorSubject<string>('Unsuccessful export!');

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
        this.currentListStudiesMessage = this.listStudiesMessageSource.asObservable();
        this.currentListWorkspacesMessage = this.listWorkspacesMessageSource.asObservable();
        this.currentListWorkspaceNamespacesMessage = this.listWorkspaceNamespaceMessageSource.asObservable();
        this.currentExportSuccessStatus = this.exportSuccessIndicatorSource.asObservable();
    }

    public changeListStudiesMessage(message: string): void {
        this.listStudiesMessageSource.next(message);
    }

    public changeListWorkspacesMessage(message: string): void {
        this.listWorkspacesMessageSource.next(message);
    }

    public changeListWorkspaceNamespacesMessage(message: string): void {
        this.listWorkspaceNamespaceMessageSource.next(message);
    }

    public changeExportSuccessStatus(goodExport: boolean): void {
        if (goodExport) {
            this.exportSuccessIndicatorSource.next('Successful export!');
        } else {
            this.exportSuccessIndicatorSource.next('Unsuccessful export!');
        }
    }

    public exportStudy(studyGuid: string, fcWorkspaceNameSpace: string, fcWorkspace: string): Observable<any> {
        const url = `/studies/${studyGuid}/export`;
        return this.postObservable(url,
            {
                workspaceNamespace: fcWorkspaceNameSpace,
                workspaceName: fcWorkspace,
                includeAfterDate: '2018-03-14T19:00:00.000-0500'
            },
            {},
            true).pipe(
                catchError(e => {
                    if (e.error) {
                        return e.status;
                    }
                })
            );
    }

    public getStudies(): Observable<Array<Study>> {
        return this.getObservable(`/studies`).pipe(
            filter(x => x != null),
            map(x => x as Array<Study>)
        );
    }

    public getWorkspaces(): Observable<Array<FireCloudWorkspace>> {
        return this.getObservable(`/workspaces`).pipe(
            filter(x => x != null),
            map(x => x as Array<FireCloudWorkspace>)
        );
    }
}
