import { Component, OnInit } from '@angular/core';
import { ActivityDefinition } from '../activity-data/models/activity-definition.model';
import { Option } from '../activity-data/models/option.model';
import { ParticipantColumn } from '../filter-column/models/column.model';
import { Filter } from '../filter-column/filter-column.model';
import { Participant } from '../participant-list/participant-list.model';
import { DSMService } from '../services/dsm.service';
import { Auth } from '../services/auth.service';
import { NameValue } from '../utils/name-value.model';
import { DDPInformation } from './dashboard.model';
import { Utils } from '../utils/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Statics } from '../utils/statics';
import { Result } from '../utils/result.model';
import { ComponentService } from '../services/component.service';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  errorMessage: string;
  additionalMessage: string;

  Arr = Array;

  loadingDDPData = false;

  ddp: DDPInformation = null;

  MEDICALRECORDDASHBOARD: string = Statics.MEDICALRECORD_DASHBOARD;
  SHIPPINGDASHBOARD: string = Statics.SHIPPING_DASHBOARD;
  UNSENTOVERVIEW: string = Statics.UNSENT_OVERVIEW;

  dashboardVersion = '';

  startDate: string;
  endDate: string;

  allowedToSeeInformation = false;

  kitsNoLabel = false;
  allLabelTriggered = false;

  showMedicalRecordRequestDetails = false;
  showTissueRequestDetails = false;
  showTissueProblemDetails = false;
  showActivityDetails: boolean[] = [];

  activityKeys: string[] = [];

  isCreatingLabels = 0;

  dataSources = new Map([
    [ 'data', 'ES' ],
    [ 'p', 'Participant' ],
    [ 'm', 'Medical Record' ],
    [ 'oD', 'Onc History' ],
    [ 't', 'Tissue' ],
    [ 'k', 'Sample' ],
    [ 'a', 'Abstraction' ] ]);
  sourceColumns = {};
  hasESData = false;
  activityDefinitionList: ActivityDefinition[] = [];
  participantList: Participant[] = [];
  hideMRTissueWorkflowCounter = false;

  constructor(private dsmService: DSMService, private auth: Auth, private router: Router, private compService: ComponentService,
               private route: ActivatedRoute, private role: RoleService) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe(params => {
      const realm = params[ DSMService.REALM ] || null;
      if (realm != null && auth.authenticated()) {
        this.getDashboardInformation(this.router.url);
        this.participantList = [];
      }
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) == null
      || sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) === undefined
    ) {
      this.additionalMessage = 'Please select a study';
    } else {
      if (this.auth.authenticated()) {
        this.getDashboardInformation(this.router.url);
      }
    }
  }

  private loadDDPData(startDate: string, endDate: string, version: string): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.allowedToSeeInformation = false;
      this.loadingDDPData = true;
      if (version === Statics.MEDICALRECORD_DASHBOARD) {
        let jsonData: any[];
        this.dsmService.getRealmsAllowed(Statics.MEDICALRECORD).subscribe({
          next: data => {
            this.ddp = null;
            jsonData = data;
            jsonData.forEach((val) => {
              if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
                this.allowedToSeeInformation = true;
                this.dsmService.getMedicalRecordDashboard(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), startDate, endDate)
                  .subscribe({
                    next: dataInfo => {
                      const result = Result.parse(dataInfo);
                      if (result.code != null && result.code !== 200) {
                        this.errorMessage = 'Error - Getting all participant numbers\nPlease contact your DSM developer';
                        console.log('Error while looking up medical records dashboard: ' + dataInfo);
                      } else {
                        this.ddp = DDPInformation.parse(dataInfo);
                        this.activityKeys = this.getActivityKeys(this.ddp.dashboardValues);
                        this.activityKeys.forEach(value => this.showActivityDetails[value] = false);
                        this.getSourceColumnsFromFilterClass();
                        this.loadSettings();
                      }
                    },
                    error: err => {
                      if (err._body === Auth.AUTHENTICATION_ERROR) {
                        this.auth.logout();
                      }
                      this.loadingDDPData = false;
                      this.errorMessage = 'Error - Loading ddp information\nPlease contact your DSM developer';
                    }
                  });
              }
            });
            if (!this.allowedToSeeInformation) {
              this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
              this.loadingDDPData = false;
            } else {
              this.additionalMessage = null;
            }
          },
          error: () => null
        });
      } else if (version === Statics.SHIPPING_DASHBOARD) {
        let jsonData: any[];
        this.dsmService.getRealmsAllowed(Statics.SHIPPING).subscribe({
          next: data => {
            jsonData = data;
            jsonData.forEach((val) => {
              if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
                this.allowedToSeeInformation = true;
                this.dsmService.getShippingDashboard(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM))
                  .subscribe({
                    next: ddpData => {
                      this.ddp = DDPInformation.parse(ddpData);
                      this.loadingDDPData = false;
                    },
                    error: err => {
                      if (err._body === Auth.AUTHENTICATION_ERROR) {
                        this.auth.logout();
                      }
                      this.errorMessage = 'Error - Loading ddp information\nPlease contact your DSM developer';
                      this.loadingDDPData = false;
                    }
                  });
              }
            });
            if (!this.allowedToSeeInformation) {
              this.additionalMessage = 'You are not allowed to see information of the selected study at that category';
              this.loadingDDPData = false;
            } else {
              this.additionalMessage = null;
            }
            this.loadingDDPData = false;
          },
          error: () => null
        });
      } else {
        this.errorMessage = 'Error - Router has wrong url ';
      }
    } else {
      this.additionalMessage = 'Please select a study';
    }
  }

  getDashboardInformation(url: string): void {
    this.loadingDDPData = true;
    if (url.indexOf(Statics.MEDICALRECORD_DASHBOARD) > -1) {
      this.dashboardVersion = Statics.MEDICALRECORD_DASHBOARD;
      this.loadDDPSummary();
    } else if (url.indexOf(Statics.SHIPPING_DASHBOARD) > -1) {
      this.dashboardVersion = Statics.SHIPPING_DASHBOARD;
      this.loadDDPSummary();
    } else if (url.indexOf(Statics.UNSENT_OVERVIEW) > -1) {
      this.dashboardVersion = Statics.UNSENT_OVERVIEW;
      this.creatingLabelStatus();
      this.loadUnsentOverview();
    } else {
      this.errorMessage = 'Error - Router has wrong url\nPlease contact your DSM developer';
    }
  }

  creatingLabelStatus(): void {
    this.dsmService.getLabelCreationStatus().subscribe(
      data => {
        const result = Result.parse(data);
        if (result.code === 200 && result.body != null && result.body !== '0') {
          this.isCreatingLabels = Number(result.body);
        } else {
          this.isCreatingLabels = 0;
        }
      }
    );
  }

  loadDDPSummary(): void {
    if (sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      this.startDate = Utils.getFormattedDate(start);
      const end = new Date();
      this.endDate = Utils.getFormattedDate(end);
      this.loadDDPData(this.startDate, this.endDate, this.dashboardVersion);
      window.scrollTo(0, 0);
    } else {
      this.loadingDDPData = false;
      this.additionalMessage = 'Please select a study';
    }
  }

  loadUnsentOverview(): void {
    this.loadingDDPData = true;
    this.additionalMessage = '';
    this.allowedToSeeInformation = true;
    this.dsmService.getShippingOverview().subscribe({
      next: data => {
        this.kitsNoLabel = false;
        this.ddp = DDPInformation.parse(data);
        for (const kit of this.ddp.kits) {
          if (kit.kitsNoLabel !== '0') {
            this.kitsNoLabel = true;
            break;
          }
        }
        this.loadingDDPData = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loadingDDPData = false;
        this.errorMessage = 'Error - Loading ddp information ' + err;
      }
    });
  }

  public reload(): void {
    this.ddp = null;
    this.loadDDPData(this.startDate, this.endDate, this.dashboardVersion);
  }

  startChanged(date: string): void {
    this.startDate = date;
  }

  endChanged(date: string): void {
    this.endDate = date;
  }

  triggerLabelCreation(realm: string, kitType: string): void {
    this.loadingDDPData = true;
    this.allLabelTriggered = realm == null && kitType == null;
    this.dsmService.kitLabel(realm, kitType).subscribe({
      next: data => {
        const result = Result.parse(data);
        if (result.code === 200) {
          this.additionalMessage = 'Triggered label creation';
          this.errorMessage = null;
        }
        this.loadingDDPData = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.loadingDDPData = false;
        this.errorMessage = 'Error - Loading ddp information ' + err;
      }
    });
  }

  getRole(): RoleService {
    return this.role;
  }

  reloadUnsent(): void {
    this.loadUnsentOverview();
  }

  getActivityKeys(o: object): string[] {
    const keys = Object.keys(o)
      .filter(obj => obj.startsWith('activity') && !obj.endsWith('completed') && obj.indexOf('.') === obj.lastIndexOf('.'));

    keys.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return keys;
  }

  getActivityVersionKeys(o: object, activity: string): string[] {
    const keys = Object.keys(o)
      .filter(obj => obj.startsWith('activity') && !obj.endsWith('completed') && obj.indexOf('.') !== obj.lastIndexOf('.')
        && obj.indexOf(activity) > -1);

    keys.sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return keys;
  }

  getHighestFollowUp(): number {
    const allFollowUpSent = Object.keys(this.ddp.dashboardValues).filter(obj => obj.startsWith('followUpSent'));
    const allFollowUpIndexes = allFollowUpSent.map(obj => obj.split('.')[1]);
    const uniqueIndexes = Array.from(new Set(allFollowUpIndexes));
    return Math.max(...uniqueIndexes.map(o => Number(o)));
  }

  getActivityName(dashboardKey: string): string {
    if (dashboardKey !== '' && dashboardKey != null && dashboardKey.indexOf('.') > -1) {
      return dashboardKey.split('.')[ 1 ];
    }
  }

  getActivityVersion(dashboardKey: string): string {
    if (dashboardKey !== '' && dashboardKey != null && dashboardKey.indexOf('.') > -1) {
      return dashboardKey.split('.')[ 2 ];
    }
  }

  getUniqueKitTypes(): string[] {
    const allKits = Object.keys(this.ddp.dashboardValues).filter(obj => obj.startsWith('kit.'));
    const kitTypes = allKits.map(obj => obj.split('.') [ 1 ]);
    return Array.from(new Set(kitTypes));
  }

  getPercentage(of: object, from: object): number {
    return Math.round((Number(of) / Number(from)) * 100 * 100) / 100;
  }

  getSourceColumnsFromFilterClass(): void {
    this.dataSources.forEach((value: string, key: string) => {
      this.sourceColumns[ key ] = [];
    });
    for (const filter of Filter.ALL_COLUMNS) {
      if (filter.participantColumn.tableAlias === 'o' || filter.participantColumn.tableAlias === 'ex'
        || filter.participantColumn.tableAlias === 'r') {
        if (this.sourceColumns[ 'p' ] == null) {
          this.sourceColumns[ 'p' ] = [];
        }
        this.sourceColumns[ 'p' ].push(filter);
      }
      if (filter.participantColumn.tableAlias === 'inst') {
        if (this.sourceColumns[ 'm' ] == null) {
          this.sourceColumns[ 'm' ] = [];
        }
        this.sourceColumns[ 'p' ].push(filter);
      }
      if (this.sourceColumns[filter.participantColumn.tableAlias] != null) {
        this.sourceColumns[filter.participantColumn.tableAlias].push(filter);
      }
    }
  }

  loadSettings(): void {
    let jsonData: any;
    this.dsmService.getSettings(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), 'participantList').subscribe({
      next: data => {
        this.activityDefinitionList = [];
        jsonData = data;
        if (jsonData.fieldSettings != null) {
          Object.keys(jsonData.fieldSettings).forEach((key) => {
            jsonData.fieldSettings[ key ].forEach((fieldSetting) => {
              if (this.sourceColumns[ key ] == null) {
                this.sourceColumns[ key ] = [];
              }
              this.sourceColumns[key].push(
                new Filter(
                  new ParticipantColumn(fieldSetting.columnDisplay, fieldSetting.columnName, key),
                  Filter.ADDITIONAL_VALUE_TYPE, [], new NameValue(fieldSetting.columnName, null)
                )
              );
            });
          });
        }

        if (jsonData.activityDefinitions != null) {
          Object.keys(jsonData.activityDefinitions).forEach((key) => {
            const activityDefinition: ActivityDefinition = ActivityDefinition.parse(jsonData.activityDefinitions[ key ]);
            this.activityDefinitionList.push(activityDefinition);
            const possibleColumns: Array<Filter> = [];
            const filters = [
              new Filter(
                new ParticipantColumn('Survey Created', 'createdAt', activityDefinition.activityCode, null, true),
                Filter.DATE_TYPE
              ),
              new Filter(
                new ParticipantColumn('Survey Completed', 'completedAt', activityDefinition.activityCode, null, true),
                Filter.DATE_TYPE
              ),
              new Filter(
                new ParticipantColumn('Survey Last Updated', 'lastUpdatedAt', activityDefinition.activityCode, null, true),
                Filter.DATE_TYPE
              ),
              new Filter(
                new ParticipantColumn('Survey Status', 'status', activityDefinition.activityCode, null, true),
                Filter.OPTION_TYPE,
                [
                  new NameValue('COMPLETE', 'Done'),
                  new NameValue('CREATED', 'Not Started'),
                  new NameValue('IN_PROGRES', 'In Progress')
                ]
              )
            ];
            filters.forEach(filter => {
              possibleColumns.push(filter);
            });

            if (activityDefinition?.questions != null) {
              for (const question of activityDefinition.questions) {
                if (question.stableId != null) {
                  const questionDefinition = activityDefinition.getQuestionDefinition(question.stableId);
                  if (questionDefinition != null && questionDefinition.questionText != null && questionDefinition.questionText !== '') {
                    let options: Array<NameValue> = null;
                    let type: string = questionDefinition.questionType;
                    if (questionDefinition.questionType === 'PICKLIST') {
                      options = new Array<NameValue>();
                      type = Filter.OPTION_TYPE;
                      questionDefinition.options.forEach((value: Option) => {
                        options.push(new NameValue(value.optionStableId, value.optionText));
                      });
                    }
                    const filter = new Filter(
                      new ParticipantColumn(questionDefinition.questionText, question.stableId,
                        activityDefinition.activityCode, null, true
                      ),
                      type,
                      options
                    );
                    possibleColumns.push(filter);
                  }
                }
              }
              this.dataSources.set(activityDefinition.activityCode, activityDefinition.activityName);
              this.sourceColumns[ activityDefinition.activityCode ] = possibleColumns;
            }
          });
        }
        if (jsonData.hideMRTissueWorkflow != null) {
          this.hideMRTissueWorkflowCounter = true;
        }
        this.getParticipantData();
        this.loadingDDPData = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        // eslint-disable-next-line no-throw-literal
        throw 'Error - Loading display settings' + err;
      }
    });
  }

  getParticipantData(): void {
    this.dsmService.applyFilter(null, sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), 'participantList', null)
      .subscribe({
        next: data => {
          this.participantList = [];
          const jsonData = data.participants;
          jsonData.forEach((val) => {
            const participant = Participant.parse(val);
            this.participantList.push(participant);
          });
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.logout();
          }
          this.loadingDDPData = false;
          this.errorMessage = 'Error - Downloading Participant List, Please contact your DSM developer';
        }
      });
  }

}
