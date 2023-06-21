import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError, Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Filter } from '../filter-column/filter-column.model';
import {Sort} from '../sort/sort.model';
import { ViewFilter } from '../filter-column/models/view-filter.model';
import { Abstraction } from '../medical-record-abstraction/model/medical-record-abstraction.model';
import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import { PDFModel } from '../pdf-download/pdf-download.model';
import { Statics } from '../utils/statics';
import { Value } from '../utils/value.model';
import { ComponentService } from './component.service';
import { RoleService } from './role.service';
import { SessionService } from './session.service';
import { BulkCohortTag } from '../tags/cohort-tag/bulk-cohort-tag-modal/bulk-cohort-tag-model';
import {LocalStorageService} from './local-storage.service';
import {IDateRange} from '../dashboard-statistics/interfaces/IDateRange';
import {StatisticsEnum} from '../dashboard-statistics/enums/statistics.enum';
import {SomaticResultSignedUrlRequest} from '../sharedLearningUpload/interfaces/somaticResultSignedUrlRequest';
import {SendToParticipantRequest} from "../sharedLearningUpload/interfaces/sendToParticipant";

declare var DDP_ENV: any;

@Injectable({providedIn: 'root'})
export class DSMService {
  public static UI = 'ui/';
  public static REALM = 'realm';
  public static TARGET = 'target';


  private baseUrl = DDP_ENV.baseUrl;

  constructor(private http: HttpClient,
               private sessionService: SessionService,
               private role: RoleService,
               private router: Router,
              private localStorageService: LocalStorageService) {
  }

  getDashboardData({startDate, endDate}: IDateRange, chartOrCount: StatisticsEnum): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'dashboard';
    const map: {}[] = [];
    map.push( {name: DSMService.REALM, value: this.localStorageService.selectedRealm} );
    map.push({name: 'part', value: chartOrCount});
    startDate && map.push({name: 'startDate', value: startDate});
    endDate && map.push({name: 'endDate', value: endDate});

    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  sendAnalyticsMetric( realm: string, passed: number ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'googleAnalytics';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: realm} );
    map.push( {name: 'timer', value: passed} );
    return this.http.patch(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public transferScan(scanTracking: boolean, json: string): Observable<any> {
    let url = this.baseUrl + DSMService.UI;
    if (scanTracking) {
      url += 'trackingScan';
    } else {
      url += 'finalScan';
    }
    return this.baseKitScan(url, json);
  }

  public finalScan(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'finalScan';
    return this.baseKitScan(url, json);
  }

  public rgpFinalScan(json: string): Observable<any> {
      const url = this.baseUrl + DSMService.UI + 'rgpFinalScan';
      return this.baseKitScan(url, json);
  }

  public initialScan(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'initialScan';
    return this.baseKitScan(url, json);
  }

  public trackingScan(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'trackingScan';
    return this.baseKitScan(url, json);
  }

  private baseKitScan(url: string, json: string): Observable<any> {
    const map: { name: string; value: any }[] = [];
    map.push({ name: DSMService.REALM, value: sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) });
    map.push({ name: 'userId', value: this.role.userID() });
    return this.http.post(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public setKitReceivedRequest(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'receivedKits';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM)} );
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public updateParticipant(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'editParticipant';
    return this.http.put(url, json, this.buildHeader()).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public checkUpdatingParticipantStatus(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'editParticipantMessageStatus';
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public setKitSentRequest(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'sentKits';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    map.push( {name: DSMService.REALM, value: sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM)} );
    return this.http.post(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public addFamilyMemberRequest(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'familyMember';
    return this.http.post(url, json, this.buildHeader()).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getKitRequests(realm: string, target: string, name: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitRequests';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: DSMService.TARGET, value: target});
    map.push({name: 'kitType', value: name});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getFiltersForUserForRealm(realm: string, parent: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'getFilters';
    const map: { name: string; value: any }[] = [];
    const userId = this.role.userID();
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: userId});
    if (parent) {map.push( {name: 'parent', value: parent} );}
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public setDefaultFilter(json: string, filterName: string, parent: string, realm): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'defaultFilter';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'filterName', value: filterName});
    map.push({name: 'parent', value: parent});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'userMail', value: this.role.userMail()});
    map.push({name: DSMService.REALM, value: realm});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public filterData(realm: string, json: string, parent: string, defaultFilter: boolean,
                    from: number = 0, to: number = this.role.getUserSetting().getRowsPerPage(), sortBy?: Sort
  ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'filterList';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'parent', value: parent});
    map.push({name: 'from', value: from});
    map.push({name: 'to', value: to});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'userMail', value: this.role.userMail()});
    if (sortBy) {
      map.push( {name: 'sortBy', value: JSON.stringify(sortBy)} );
    }
    map.push({name: 'defaultFilter', value: defaultFilter === true ? '1' : defaultFilter != null ? '0' : ''});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public saveCurrentFilter(json: string, realm: string, parent: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'saveFilter';
    const userId = this.role.userID();
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'parent', value: parent});
    map.push({name: 'userId', value: userId});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public applyFilter(json: ViewFilter = null, realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), parent: string,
                     filterQuery: string = null, from: number = 0, to: number = this.role.getUserSetting().getRowsPerPage(), sortBy?: Sort
  ): Observable<any> {
    // console.log(json, realm,parent, filterQuery, from, to, 'testing to see')
    const viewFilterCopy = this.getFilter(json);
    const url = this.baseUrl + DSMService.UI + 'applyFilter';
    const userId = this.role.userID();
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'from', value: from});
    map.push({name: 'to', value: to});
    map.push({name: 'userId', value: userId});
    map.push({name: 'parent', value: parent});
    if (sortBy) {
      map.push( {name: 'sortBy', value: JSON.stringify(sortBy)} );
    }

    if (filterQuery != null) {
      map.push({name: 'filterQuery', value: filterQuery});
    }
    if (json != null && json.filterName != null) {
      json && map.push({name: 'filterName', value: json.filterName});
    }
    if (viewFilterCopy != null) {
      map.push({name: 'filters', value: JSON.stringify(viewFilterCopy.filters)});
    }

    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getParticipantData(realm: string, ddpParticipantId: string, parent: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'getParticipant';
    const map: { name: string; value: any }[] = [];
    const userId = this.role.userID();
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'ddpParticipantId', value: ddpParticipantId});
    map.push({name: 'userId', value: userId});
    map.push({name: 'parent', value: parent});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public downloadParticipantData(realm: string, jsonPatch: string, parent: string, columns: {}, json: ViewFilter,
                                 filterQuery: string, sortBy?: Sort, fileFormat?: string, humanReadable?: boolean,
                                 onlyMostRecent?: boolean):
    Observable<any> {
    const viewFilterCopy = this.getFilter(json);
    const url = this.baseUrl + DSMService.UI + 'participantList';
    const map: { name: string; value: any }[] = [];
    const userId = this.role.userID();
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: userId});
    map.push({name: 'parent', value: parent});
    if (sortBy) {
      map.push({name: 'sortBy', value: JSON.stringify(sortBy)});
    }
    if (fileFormat) {
      map.push({name: 'fileFormat', value: fileFormat});
    }
    if (typeof humanReadable === 'boolean') {
      map.push({name: 'humanReadable', value: humanReadable});
    }
    if (typeof onlyMostRecent === 'boolean') {
      map.push({name: 'onlyMostRecent', value: onlyMostRecent});
    }
    if (filterQuery != null) {
      map.push({name: 'filterQuery', value: filterQuery});
    }
    if (json != null && json.filterName != null) {
      json && map.push({name: 'filterName', value: json.filterName});
    }
    if (viewFilterCopy != null) {
      map.push({name: 'filters', value: JSON.stringify(viewFilterCopy.filters)});
    }
    const filters = jsonPatch ? JSON.parse(jsonPatch) : undefined;
    const body = {columnNames: columns, ...filters};
    return this.http.post(url, JSON.stringify(body), this.buildQueryCsvBlobHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getParticipantDsmData(realm: string, ddpParticipantId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'getParticipantData';
    const map: { name: string; value: any }[] = [];
    const userId = this.role.userID();
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'ddpParticipantId', value: ddpParticipantId});
    map.push({name: 'userId', value: userId});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getSettings(realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), parent: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'displaySettings/' + realm;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'parent', value: parent});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getAssignees(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'assignees';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: realm} );
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  // returns drug list entries with all fields
  public getDrugs(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'drugList';
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public saveDrug(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'drugList';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public createCohortTag(body: string, realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'createCohortTag';
    const map = [
      { name: 'userId', value: this.role.userID() },
      { name: 'realm', value: realm }
    ];
    return this.http.post(url, body, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public bulkCreateCohortTags(bulkCohortTag: BulkCohortTag, realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'bulkCreateCohortTags';
    const map = [
      { name: 'userId', value: this.role.userID() },
      { name: 'realm', value: realm },
      { name: 'parent', value: 'participantList' },
    ];
    if (bulkCohortTag.savedFilter) {
      map.push({ name: 'filters', value: JSON.stringify(bulkCohortTag.savedFilter.filters)});
      map.push({ name: 'filterName', value: bulkCohortTag.savedFilter.filterName});
    }
    return this.http.post(url, JSON.stringify(bulkCohortTag), this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public deleteCohortTag(cohortTagId: number, realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'deleteCohortTag';
    const map = [
      { name: 'userId', value: this.role.userID() },
      { name: 'realm', value: realm },
      { name: 'cohortTagId', value: cohortTagId }
    ];
    return this.http.delete(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  public getMedicalRecordData(realm: string, ddpParticipantId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'institutions';
    const json = {
      ddpParticipantId,
      realm,
      userId: this.role.userID()
    };
    return this.http.post(url, JSON.stringify(json), this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public assignParticipant(realm: string, assignMR: boolean, assignTissue: boolean, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'assignParticipant';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    if (assignMR) {
      map.push({name: 'assignMR', value: assignMR});
    }
    if (assignTissue) {
      map.push({name: 'assignTissue', value: assignTissue});
    }
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public patchParticipantRecord(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'patch';
    return this.http.patch(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public downloadPDF(ddpParticipantId: string, medicalRecordId: string, startDate: string, endDate: string,
                     mrCoverPdfSettings: Value[], realm: string, configName: string, pdfs: PDFModel[],
                     requestOncHistoryList: Array<OncHistoryDetail>
  ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'downloadPDF/pdf';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    const json: { [ k: string ]: any } = {
      ddpParticipantId,
      userId: this.role.userID()
    };
    if (startDate != null) {
      json[ 'startDate' ] = startDate;
    }
    if (endDate != null) {
      json[ 'endDate' ] = endDate;
    }
    if (configName != null) {
      json[ 'configName' ] = configName;
    }
    if (medicalRecordId != null) {
      json[ 'medicalRecordId' ] = medicalRecordId;
    }
    if (requestOncHistoryList != null) {
      const listOfOncHistories = [];
      for (const onc of requestOncHistoryList) {
        listOfOncHistories.push(onc.oncHistoryDetailId);
      }
      json[ 'requestId' ] = listOfOncHistories;
    }
    if (pdfs != null) {
      json[ 'pdfs' ] = JSON.stringify(pdfs);
    }
    if (mrCoverPdfSettings != null) {
      for (const mrSetting of mrCoverPdfSettings) {
        json[ mrSetting.value ] = mrSetting.selected;
      }
    }
    return this.http.post(url, JSON.stringify(json), this.buildQueryBlobHeader(map)).pipe(
      catchError(err => this.handleError(err))
    );
  }

  public getParticipant(participantId: string, realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'participant/' + participantId;
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getMedicalRecord(participantId: string, institutionId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'participant/' + participantId + '/institution/' + institutionId;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getMedicalRecordLog(medicalRecordId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'medicalRecord/' + medicalRecordId + '/log';
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public saveMedicalRecordLog(medicalRecordId: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'medicalRecord/' + medicalRecordId + '/log';
    return this.http.patch(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getMedicalRecordDashboard(realm: string, startDate: string, endDate: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'ddpInformation/' + startDate + '/' + endDate;
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getShippingReportOverview(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'sampleReport';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getShippingReport(startDate: string, endDate: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'sampleReport/' + startDate + '/' + endDate;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getShippingOverview(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'ddpInformation';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getShippingDashboard(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'ddpInformation';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getKit(field: string, value: string, realms: string[]): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'searchKit';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'field', value: field});
    map.push({name: 'value', value});
    for (const i of realms) {
      map.push({name: 'realm', value: i});
    }
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public lookupValue(lookupType: string, lookupValue: string, realm: string): Observable<any> {
    if (lookupType === 'mrContact' || lookupType === 'tSite') {
      return this.lookup(lookupType, lookupValue, null, null);
    } else if (lookupType === 'tHistology' || lookupType === 'tFacility' || lookupType === 'tType') {
      return this.lookup(lookupType, lookupValue, realm, null);
    }
  }

  public lookupCollaboratorId(lookupType: string, participantId: string, shortId: string, realm: string): Observable<any> {
    return this.lookup(lookupType, participantId, realm, shortId);
  }

  public lookup(field: string, lookupValue: string, realm: string, shortId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'lookup';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'field', value: field});
    map.push({name: 'value', value: lookupValue});
    if (realm != null) {
      map.push({name: 'realm', value: realm});
    }
    if (shortId != null) {
      map.push({name: 'shortId', value: shortId});
    }
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getMailingList(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'mailingList/' + realm;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getRealmsAllowed(menu: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'realmsAllowed';
    const map: { name: string; value: any }[] = [];
    if (menu != null) {
      map.push({name: 'menu', value: menu});
    }
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getStudies(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'studies';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getKitTypes(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitTypes/' + realm;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getUploadReasons(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'uploadReasons/' + realm;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getShippingCarriers(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'carriers/' + realm;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public uploadTxtFile(realm: string, kitType: string, file: File, reason: string, carrier: string,
                       skipAddressValidation: boolean): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitType', value: kitType});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'reason', value: reason});
    map.push({name: 'carrier', value: carrier});
    map.push( {name: 'skipAddressValidation', value: skipAddressValidation} );
    return this.http.post(url, file, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getSomaticResultsFiles(realm: string, participantId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'somaticResults';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'ddpParticipantId', value: participantId});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getSomaticResultsFileUploadSignedUrl(
    realm: string,
    participantId: string,
    fileInformation: SomaticResultSignedUrlRequest): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'somaticResults';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'ddpParticipantId', value: participantId});
    return this.http.post(url, fileInformation, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public uploadSomaticResultsFile(signedUrl: string, file: File): Observable<any> {
    return this.http.put(signedUrl, file).pipe(
      catchError(this.handleError)
    );
  }

  public sendSomaticResultsToParticipant(realm: string, payload: SendToParticipantRequest): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'triggerSomaticResultsSurvey';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'surveyName', value: 'SOMATIC_RESULTS'});
    map.push({name: 'surveyType', value: 'REPEATING'});
    return this.http.post(url, payload, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public deleteSomaticResultsFile(realm: string, somaticDocumentId: number): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'somaticResults';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'somaticDocumentId', value: somaticDocumentId});
    return this.http.delete(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }


  public uploadStoolTxtFile(realm: string, kitType: string, file: File): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'stoolUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, file, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getSignedUrl( ddpParticipantId: string, {fileName, bucket, blobName, guid}, realm: string):
    Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'downloadFile';
    const map: { name: string; value: any }[] = [
      {name: DSMService.REALM, value: realm} ,
      {name: 'ddpParticipantId', value: ddpParticipantId} ,
      {name: 'fileName', value: fileName} ,
      {name: 'bucket', value: bucket},
      {name: 'blobName', value: blobName},
      {name: 'fileGuid', value: guid} ];
    return this.http.get( url, this.buildQueryHeader( map )).pipe( catchError( this.handleError ) );
  }

  public downloadFromSignedUrl( url: string ): Observable<any> {
    return this.http.get( url, this.buildQueryBlobHeaderForGCP() ).pipe(
      catchError(this.handleError)
    );
  }

  public uploadNdiFile(file: File): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'ndiRequest';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, file, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public uploadDuplicateParticipant(realm: string, kitType: string, jsonParticipants: string,
                                    reason: string, carrier: string, skipAddressValidation: boolean
  ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitType', value: kitType});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'uploadAnyway', value: true});
    map.push({name: 'Content-Type', value: 'application/json; charset=utf-8'});
    map.push({name: 'reason', value: reason});
    map.push({name: 'carrier', value: carrier});
    map.push( {name: 'skipAddressValidation', value: skipAddressValidation} );
    return this.http.post(url, jsonParticipants, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }


  public kitLabel(realm: string, kitType: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitLabel';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitType', value: kitType});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public singleKitLabel(kitJson: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitLabel';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM)} );
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, kitJson, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getLabelCreationStatus(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'kitLabel';
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public exitParticipant(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'exitParticipant';
    return this.http.post(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getPossibleSurveys(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'triggerSurvey/' + realm;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getSurveyStatus(realm: string, survey: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'triggerSurvey/' + realm;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'surveyName', value: survey});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public triggerSurvey(realm: string, surveyName: string, surveyType: string, comment: string,
                       isFileUpload: boolean, payload: any
  ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'triggerSurvey';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'surveyName', value: surveyName});
    map.push({name: 'surveyType', value: surveyType});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'comment', value: comment});
    map.push({name: 'isFileUpload', value: isFileUpload});
    return this.http.post(url, payload, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public triggerAgain(realm: string, surveyName: string, surveyType: string, comment: string, jsonParticipants: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'triggerSurvey';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'surveyName', value: surveyName});
    map.push({name: 'surveyType', value: surveyType});
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'comment', value: comment});
    map.push({name: 'triggerAgain', value: true});
    map.push({name: 'isFileUpload', value: false});
    return this.http.post(url, jsonParticipants, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getPossibleEventTypes(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'eventTypes/' + realm;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getPossiblePDFs(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'pdf';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getParticipantsPDFs(realm: string, ddpParticipantId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'pdf';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'ddpParticipantId', value: ddpParticipantId});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getSkippedParticipantEvents(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'participantEvents/' + realm;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public skipEvent(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'skipEvent';
    return this.http.post(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getExitedParticipants(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'exitParticipant/' + realm;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getKitExitedParticipants(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardSamples';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public setKitDiscardAction(realm: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardSamples';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public showUpload(realm: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'showUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.patch(url, json, this.buildQueryBlobHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public setKitDiscarded(realm: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardSamples';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public uploadFile(realm: string, kitDiscardId: string, pathName: string, payload: File): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitDiscardId', value: kitDiscardId});
    map.push({name: pathName, value: payload.name});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, payload, this.buildQueryUploadHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public deleteFile(realm: string, kitDiscardId: string, pathName: string, path: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitDiscardId', value: kitDiscardId});
    map.push({name: 'delete', value: true});
    map.push({name: pathName, value: path});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public saveNote(realm: string, kitDiscardId: string, note: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardUpload';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    map.push({name: 'kitDiscardId', value: kitDiscardId});
    map.push({name: 'note', value: note});
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.post(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public confirm(realm: string, payload: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'discardConfirm';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.post(url, payload, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public deactivateKitRequest(kitRequestId: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'deactivateKit/' + kitRequestId;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public expressLabel(kitRequestId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'expressKit/' + kitRequestId;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public rateOfExpressLabel(kitRequestId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'expressKit/' + kitRequestId;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public activateKitRequest(kitRequestId: string, activate: boolean): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'activateKit/' + kitRequestId;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    map.push({name: 'activate', value: activate});
    return this.http.patch(url, null, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public saveUserSettings(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'userSettings';
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getFieldSettings(source: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'fieldSettings/' + source;
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public saveFieldSettings(source: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'fieldSettings/' + source;
    const map: { name: string; value: any }[] = [];
    map.push({name: 'userId', value: this.role.userID()});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  getMercuryEligibleSamples( ddpParticipantId: string, realm: any ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'mercurySamples';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: realm} );
    map.push( {name: 'ddpParticipantId', value: ddpParticipantId} );
    return this.http.get( url, this.buildQueryHeader( map ) ).pipe(
      catchError( this.handleError.bind( this ) )
    );
  }


  getMercuryOrders( realm: string ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'getMercuryOrders';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: realm} );
    return this.http.get( url, this.buildQueryHeader( map ) ).pipe(
      catchError( this.handleError.bind( this ) )
    );
  }

  placeSeqOrder( orders: any[], realm: string, ddpParticipantId: string ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'submitMercuryOrder';
    const map: { name: string; value: any }[] = [];
    map.push( {name: DSMService.REALM, value: realm} );
    map.push( {name: 'ddpParticipantId', value: ddpParticipantId} );
    map.push( {name: 'userId', value: this.role.userID()} );
    return this.http.post( url, orders, this.buildQueryHeader( map ) ).pipe(
      catchError( this.handleError.bind( this ) )
    );
  }

  public applyDestructionPolicyToAll(source: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'institutions';
    return this.http.patch(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getMedicalRecordAbstractionFormControls(realm: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'abstractionformcontrols';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.get(url, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public saveMedicalRecordAbstractionFormControls(realm: string, json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'abstractionformcontrols';
    const map: { name: string; value: any }[] = [];
    map.push({name: DSMService.REALM, value: realm});
    return this.http.patch(url, json, this.buildQueryHeader(map)).pipe(
      catchError(this.handleError)
    );
  }

  public getAbstractionValues(realm: string, ddpParticipantId: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'abstraction';
    const json = {
      userId: this.role.userID(),
      ddpParticipantId,
      realm
    };
    return this.http.post(url, JSON.stringify(json), this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public changeMedicalRecordAbstractionStatus(realm: string, ddpParticipantId: string,
                                              status: string, abstraction: Abstraction
  ): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'abstraction';
    const json = {
      ddpParticipantId,
      realm,
      status,
      userId: this.role.userID(),
      abstraction
    };
    return this.http.post(url, JSON.stringify(json), this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public getLabelSettings(): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'labelSettings';
    return this.http.get(url, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  public saveLabelSettings(json: string): Observable<any> {
    const url = this.baseUrl + DSMService.UI + 'labelSettings';
    return this.http.patch(url, json, this.buildHeader()).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    return throwError(() => error);
  }

  private buildHeader(): any {
    return {
      headers: this.buildJsonAuthHeader(),
      withCredentials: true
    };
  }

  private buildQueryBlobHeader(map: any[]): any {
    let params: HttpParams = new HttpParams();
    for (const param of map) {
      params = params.append(param.name, param.value);
    }
    return {
      headers: this.buildJsonAuthHeader(),
      withCredentials: true,
      responseType: 'blob',
      params
    };
  }

  private buildQueryBlobHeaderForGCP(): any {
    return {
      headers: this.buildJsonHeader(),
      responseType: 'blob'
    };
  }
  private buildQueryCsvBlobHeader(map: any[]): any {
    let params: HttpParams = new HttpParams();
    for (const param of map) {
      params = params.append(param.name, param.value);
    }
    return {
      headers: this.buildJsonAuthHeader(),
      withCredentials: true,
      responseType: 'blob',
      observe: 'response',
      params
    };
  }
  private buildQueryHeader(map: any[]): any {
    let params: HttpParams = new HttpParams();
    for (const param of map) {
      params = params.append(param.name, param.value);
    }
    return {headers: this.buildJsonAuthHeader(), withCredentials: true, params};
  }

  private buildQueryUploadHeader(map: any[]): any {
    let params: HttpParams = new HttpParams();
    for (const param of map) {
      params = params.append(param.name, param.value);
    }
    return {headers: this.uploadHeader(), withCredentials: true, params};
  }

  private buildJsonAuthHeader(): HttpHeaders {
    if (this.checkCookieBeforeCall()) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: this.sessionService.getAuthBearerHeaderValue()
      });
    }
  }

  private buildJsonHeader(): HttpHeaders {
    if (this.checkCookieBeforeCall()) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      } );
    }
  }

  private uploadHeader(): HttpHeaders {
    if (this.checkCookieBeforeCall()) {
      return new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: this.sessionService.getAuthBearerHeaderValue()
      });
    }
  }

  private checkCookieBeforeCall(): boolean {
    if (this.sessionService.getDSMToken() == null) {
      this.localStorageService.clear();
      this.sessionService.logout();
      this.router.navigateByUrl('/');
      return false;
    } else {
      const jwtHelper = new JwtHelperService();
      const expirationDate: Date = jwtHelper.getTokenExpirationDate(this.sessionService.getDSMToken());
      const myDate = new Date();
      if (expirationDate <= myDate) {
        // Remove token from localStorage
        // console.log("log out user and remove all items from local storage");
        this.localStorageService.clear();
        this.sessionService.logout();
        this.router.navigate(['']);
        return false;
      }
      return true;
    }
  }
  private getFilter(json: ViewFilter): ViewFilter {
    let viewFilterCopy = null;
    if (json != null) {
      if (json.filters?.length) {
        viewFilterCopy = json.copy();
        for (const filter of json.filters) {
          if (filter.type === Filter.OPTION_TYPE && filter.participantColumn.tableAlias !== 'participantData') {
            filter.selectedOptions = filter.getSelectedOptionsName();
          }
        }
      }
      if (viewFilterCopy != null && viewFilterCopy.filters?.length) {
        for (const filter of viewFilterCopy.filters) {
          if (filter.type === Filter.OPTION_TYPE && filter.participantColumn.tableAlias !== 'participantData') {
            filter.selectedOptions = filter.getSelectedOptionsName();
            filter.options = null;
          }
        }
      }
    }
    return viewFilterCopy;
  }
}
