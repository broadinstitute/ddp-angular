// noinspection BadExpressionStatementJS

import { Component, OnInit, ViewChild } from '@angular/core';
import {ParticipantColumn} from "../filter-column/models/column.model";
import { Participant } from '../participant-list/participant-list.model';
import { RoleService } from '../services/role.service';
import { DSMService } from '../services/dsm.service';
import { ComponentService } from '../services/component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { Statics } from '../utils/statics';
import { Filter } from '../filter-column/filter-column.model';
import { NameValue } from '../utils/name-value.model';
import { OncHistoryDetail } from '../onc-history-detail/onc-history-detail.model';
import { ViewFilter } from '../filter-column/models/view-filter.model';
import { Result } from '../utils/result.model';
import { PatchUtil } from '../utils/patch.model';
import { ModalComponent } from '../modal/modal.component';
import { Utils } from '../utils/utils';
import { TissueListWrapper } from './tissue-list-wrapper.model';
import { FieldSettings } from '../field-settings/field-settings.model';
import { Assignee } from '../assignee/assignee.model';
import { AssigneeParticipant } from '../participant-list/models/assignee-participant.model';

@Component({
  selector: 'app-tissue-view-page',
  templateUrl: './tissue-list.component.html',
  styleUrls: [ './tissue-list.component.css' ],
})
export class TissueListComponent implements OnInit {
  @ViewChild(ModalComponent)
  public modal: ModalComponent;

  tissueListWrappers: TissueListWrapper[] = [];
  copyTissueListWrappers: TissueListWrapper[] = [];
  originalTissueListWrappers: TissueListWrapper[] = [];
  tissueListsMap = {};
  tissueListOncHistories: TissueListWrapper[] = [];
  selectedTab: string;
  showParticipantInformation = false;
  showTissue = false;
  loading = false;
  participant: Participant;
  oncHistoryDetail: OncHistoryDetail;
  errorMessage = '';
  additionalMessage = '';
  parent = 'tissueList';
  loadedTimeStamp: string;
  selectedTissueStatus: string;
  assignees: Array<Assignee> = [];
  assignee: Assignee;

  showFilters = false;
  showCustomizeViewTable = false;
  showSavedFilters = false;
  showQueues = false;
  showModal = false;
  dup = false;
  plus = false;
  edit = true;
  newFilterModal = false;
  openTissueModal = false;
  openAssigneeModal = false;
  assignTissue = false;
  isAssignButtonDisabled = true;

  sortField: string = null;
  sortDir: string = null;
  sortParent: string = null;
  sortColumn: Filter = null;
  currentFilter: Array<Filter>;
  currentView: string = null;
  currentQuickFilterName = null;
  oncHistoryId: string;
  tissueId: string;

  settings = {};

  defaultFilterName: string;
  defaultFilter: ViewFilter;
  isDefaultFilter = false;
  hasESData = true;
  realm: string;
  allColumns = {};
  allAdditionalColumns = {};
  selectedColumns = {};
  dataSources = [ Statics.ES_ALIAS, Statics.ONCDETAIL_ALIAS, Statics.TISSUE_ALIAS ];
  dataSourceNames = {
    data: 'Participant',
    oD: 'Onc History',
    t: 'Tissue',
    sm: 'sm id',
  };

  selectedFilterName = '';
  defaultOncHistoryColumns = [
    Filter.ACCESSION_NUMBER,
    Filter.DATE_PX,
    Filter.TYPE_PX,
    Filter.LOCATION_PX,
    Filter.HISTOLOGY,
    Filter.GENDER,
    Filter.FACILITY,
    Filter.DESTRUCTION_POLICY
  ];
  defaultTissueColumns = [ Filter.COLLABORATOR_SAMPLE_ID ];
  defaultESColumns = [ Filter.SHORT_ID, Filter.FIRST_NAME, Filter.LAST_NAME ];
  destructionPolicyColumns = {
    data: [ Filter.SHORT_ID, Filter.FIRST_NAME, Filter.LAST_NAME, Filter.FACILITY_PHONE, Filter.FACILITY_FAX ],
    oD: this.defaultOncHistoryColumns.concat([ Filter.FACILITY_PHONE, Filter.FACILITY_FAX ]),
    t: [],
  };
  savedFilters: ViewFilter[] = [];
  quickFilters: ViewFilter[] = [];
  drugs: string[] = [];
  newFilterName: string;
  filterQuery = ' ';
  textQuery: string;
  wrongQuery = false;
  allFieldNames = new Set();
  showHelp: boolean;

  constructor(public role: RoleService, private dsmService: DSMService, private compService: ComponentService,
               private router: Router, private auth: Auth, private route: ActivatedRoute) {
    if (!auth.authenticated()) {
      auth.logout();
    }

    this.route.queryParams.subscribe(params => {
      this.realm = params[ DSMService.REALM ] || null;
      if (this.realm != null) {
        this.checkRight(true);
      }
    });
  }

  private resetEverything(resetData?: boolean): void {
    if (resetData != null) {
      if (resetData) {
        this.tissueListWrappers = [];
        this.originalTissueListWrappers = [];
        this.copyTissueListWrappers = [];
      }
    }
    this.setSelectedFilterName('');
    for (const source of this.dataSources) {
      if (this.allColumns[ source ] != null) {
        for (let col of this.allColumns[ source ]) {
          col = col.clearFilter(col);
        }
      }
    }
    this.setAllColumns();
    this.setDefaultColumns(false);
    this.currentFilter = null;
    this.currentQuickFilterName = null;
    this.quickFilters = [];
    this.errorMessage = null;
    this.additionalMessage = null;
    this.sortDir = null;
    this.sortField = null;
    this.sortParent = null;
    this.sortColumn = null;
    this.currentQuickFilterName = null;
    this.showFilters = false;
    this.showCustomizeViewTable = false;
    this.showSavedFilters = false;
    this.showQueues = false;
    this.filterQuery = null;
    this.edit = true;
    this.wrongQuery = false;
    this.textQuery = '';
  }

  private setAllColumns(): void {
    for (const source of this.dataSources) {
      this.allColumns[ source ] = new Array<Filter>();
      this.selectedColumns[ source ] = new Array<Filter>();
    }
    this.getFieldSettings();
    for (const col of this.allColumns[ Statics.TISSUE_ALIAS ]) {
      this.allFieldNames.add(col.participantColumn.tableAlias + Statics.DELIMITER_ALIAS + col.participantColumn.name);
    }
    for (const col of this.allColumns[ Statics.ONCDETAIL_ALIAS ]) {
      this.allFieldNames.add(col.participantColumn.tableAlias + Statics.DELIMITER_ALIAS + col.participantColumn.name);
    }
  }

  assigneeSelected( evt: any ): void {
    this.assignee = evt;
  }

  private checkRight(defaultFilter: boolean): void {
    let allowedToSeeInformation = false;
    this.resetEverything(true);
    let jsonData: any[];
    this.isDefaultFilter = defaultFilter;
    this.dsmService.getRealmsAllowed(Statics.MEDICALRECORD).subscribe({
      next: data => {
        jsonData = data;
        jsonData.forEach((val) => {
          if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) === val) {
            allowedToSeeInformation = true;
            this.defaultFilterName = this.role.getUserSetting().defaultTissueFilter;
            this.clearFilters();
            this.setAllColumns();
            this.getDefaultFilterName();
            this.getAllFilters(true);
            this.getTissueListData(defaultFilter);
          }
        });
        if (!allowedToSeeInformation) {
          this.errorMessage = 'You are not allowed to see information of the selected study at that category';
        }
      },
      error: () => null
    });
  }

  ngOnInit(): void {
    this.loading = false;
    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) != null) {
      this.realm = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      //      this.compService.realmMenu = this.realm;
    } else {
      this.errorMessage = 'Please select a study';
    }
    window.scrollTo(0, 0);
    if (localStorage.getItem(ComponentService.MENU_SELECTED_REALM) == null) {
      this.errorMessage = 'Please select a study';
      return;
    } else {
      //      this.setAllColumns();
      for (const source of this.dataSources) {
        this.selectedColumns[ source ] = [];
      }

      this.checkRight(true);
    }
  }

  public onclickDropDown(e): void {
    e.stopPropagation();
  }

  private getFieldSettings(): void {
    this.dsmService.getFieldSettings(localStorage.getItem(ComponentService.MENU_SELECTED_REALM)).subscribe({
      next: data => {
        this.allAdditionalColumns = {};
        this.settings = {};
        for (const source of this.dataSources) {
          this.allColumns[ source ] = [];
        }
        Object.keys(this.dataSourceNames).forEach((key) => {
          if (data[ key ] != null) {
            for (const fieldSetting of data[ key ]) {
              if (this.settings[ key ] == null) {
                this.settings[ key ] = [];
              }
              this.settings[ key ].push(FieldSettings.parse(fieldSetting));
              if (this.allAdditionalColumns[ key ] == null) {
                this.allAdditionalColumns[ key ] = [];
                this.allColumns[ key ] = [];
              }
              const f = Filter.parseFieldSettingsToColumns(fieldSetting, key);
              this.allAdditionalColumns[ key ].push(f);
              this.allColumns[ key ].push(f);
            }
          }
          for (const filter of Filter.ALL_COLUMNS) {
            if (filter.participantColumn.tableAlias === key) {
              // TODO - can be changed to add all after all DDPs are migrated
              if (this.hasESData) {
                if (filter.participantColumn.tableAlias === 'sm') {
                  this.allColumns[ 't' ].push( filter );
                } else{
                  this.allColumns[ key ].push( filter );
                }
                if (filter.participantColumn.tableAlias !== 'data') {
                  const t = filter.participantColumn.object != null ? filter.participantColumn.object : filter.participantColumn.tableAlias;
                  this.allFieldNames.add(t + Statics.DELIMITER_ALIAS + filter.participantColumn.name);
                }
              } else {
                if (
                  filter.participantColumn.tableAlias === 'data'
                  && (filter.participantColumn.object === 'profile' || filter.participantColumn.object === 'address')
                ) {
                  if (
                    filter.participantColumn.name !== 'doNotContact' && filter.participantColumn.name !== 'email'
                    && filter.participantColumn.name !== 'legacyShortId'
                    && filter.participantColumn.name !== 'legacyAltPid' && filter.participantColumn.name !== 'createdAt'
                  ) {
                    this.allColumns[ key ].push(filter);
                    const t = filter.participantColumn.object != null ?
                      filter.participantColumn.object : filter.participantColumn.tableAlias;
                    this.allFieldNames.add(t + Statics.DELIMITER_ALIAS + filter.participantColumn.name);
                  }
                } else if (filter.participantColumn.tableAlias !== 'data') {
                  if (filter.participantColumn.tableAlias === 'sm') {
                    this.allColumns[ 't' ].push( filter );
                  }
                  else {
                    this.allColumns[ key ].push( filter );
                  }
                  const t = filter.participantColumn.object !== null &&
                    (filter.participantColumn.object !== undefined ? filter.participantColumn.object : filter.participantColumn.tableAlias);
                  this.allFieldNames.add( t + Statics.DELIMITER_ALIAS + filter.participantColumn.name );
                }
              }
            }
          }
        });
        // TODO: check is it correct ? - is the commented lines below needed ?
        // for ( let col of this.allColumns[Statics.TISSUE_ALIAS] ) {
        //   this.allFieldNames.add(col.participantColumn.tableAlias + Statics.DELIMITER_ALIAS + col.participantColumn.name);
        // }
        // for ( let col of this.allColumns[Statics.ONCDETAIL_ALIAS] ) {
        //   this.allFieldNames.add(col.participantColumn.tableAlias + Statics.DELIMITER_ALIAS + col.participantColumn.name);
        // }
        // for ( let col of this.allColumns["data"] ) {
        //   let t = col.participantColumn.object !== null && col.participantColumn.object !== undefined ? col.participantColumn.object :
        // col.participantColumn.tableAlias; this.allFieldNames.add(t + Statics.DELIMITER_ALIAS + col.participantColumn.name); }
        this.getAssignees(localStorage.getItem( ComponentService.MENU_SELECTED_REALM ));
      },
      error: err => {
        this.errorMessage = 'Could not getting the field settings for this study. Please contact your DSM developer\n ' + err;
      },
    });
  }

  // display additional value
  getOncHisAdditionalValue(index: number, colName: string): string {
    if (this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.additionalValues != null) {
      if (this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.additionalValues[ colName ] != null) {
        return this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.additionalValues[ colName ];
      }
    }
    return null;
  }

  getTissueAdditionalValue(tissueListIndex, colName: string): string {
    if (
      this.tissueListWrappers[ tissueListIndex ].tissueList.tissue != null
      && this.tissueListWrappers[ tissueListIndex ].tissueList.tissue.additionalValues != null
      && Object.keys(this.tissueListWrappers[ tissueListIndex ].tissueList.tissue.additionalValues).length > 0
    ) {
      return this.tissueListWrappers[ tissueListIndex ].tissueList.tissue.additionalValues[ colName ] === undefined ?
        null : this.tissueListWrappers[ tissueListIndex ].tissueList.tissue.additionalValues[ colName ];
    }
    return null;
  }

  public isASettingsFilter(tableAlias, columnName): boolean {
    if (this.allAdditionalColumns[ tableAlias ] == null) {
      return false;
    }
    for (const c of this.allAdditionalColumns[ tableAlias ]) {
      if (c.participantColumn.name === columnName) {
        return true;
      }
    }
    return false;
  }

  private setDefaultColumns(isDefaultFilter: boolean): void {
    if (!isDefaultFilter || this.defaultFilter == null) {
      this.selectedColumns[ Statics.TISSUE_ALIAS ] = [].concat(this.defaultTissueColumns);
      this.selectedColumns[ Statics.ONCDETAIL_ALIAS ] = [].concat(this.defaultOncHistoryColumns);
      this.selectedColumns[ Statics.ES_ALIAS ] = [].concat(this.defaultESColumns);
    } else {
      if (this.defaultFilter == null) {
        this.getAllFilters(isDefaultFilter);
      }
      this.selectedColumns = this.defaultFilter.columns;
    }
  }

  private getTissueListData(defaultFilter: boolean): void {
    this.loading = true;
    if (this.defaultFilter == null && this.defaultFilterName !== undefined && this.defaultFilterName !== '') {
      this.defaultFilter = this.savedFilters.find(filter => filter.filterName === this.defaultFilterName);
      if (this.defaultFilter === undefined) {
        this.defaultFilter = this.quickFilters.find(filter => filter.filterName === this.defaultFilterName);
      }
    }
    if (defaultFilter && this.defaultFilter != null) {
      this.dsmService.applyFilter(this.defaultFilter, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent, null)
        .subscribe({
          next: data => {
            if (this.defaultFilter != null && this.defaultFilter.filters != null) {
              this.adjustAllColumns(this.defaultFilter);
            } else {
              this.currentFilter = null;
              this.selectedFilterName = '';
              this.selectedColumns = this.createDefaultColumns();
            }
            const date = new Date();
            this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
            this.tissueListWrappers = [];
            this.originalTissueListWrappers = [];
            this.copyTissueListWrappers = [];
            this.tissueListsMap = {};
            this.tissueListOncHistories = [];
            const jsonData = data;
            this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
            this.originalTissueListWrappers = this.tissueListWrappers;

            if (this.defaultFilter != null && this.defaultFilter.filters != null) {
              this.currentFilter = this.defaultFilter.filters;
              this.selectedFilterName = this.defaultFilter.filterName;
              this.selectedColumns = this.defaultFilter.columns;
              for (const filter of this.defaultFilter.filters) {
                if (filter.type === Filter.OPTION_TYPE) {
                  filter.selectedOptions = filter.getSelectedOptionsBoolean();
                }
              }
            }
            for (const dataSource of this.dataSources) {
              if (this.selectedColumns[dataSource] == null) {
                this.selectedColumns[dataSource] = [];
              }
            }
            if (!this.hasESData) {
              this.filterProfileForNoESRelams(this.defaultFilter);
            }
            for (const tissueList of this.tissueListWrappers) {
              this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
            }
            for (const key of Object.keys(this.tissueListsMap)) {
              this.tissueListOncHistories.push(this.tissueListsMap[key]);
            }
            this.edit = true;
            this.filterQuery = this.defaultFilter.queryItems;
            this.textQuery = this.defaultFilter.queryItems;
            this.loading = false;
            if (this.defaultFilter.quickFilterName != null && this.defaultFilter.quickFilterName !== '') {
              this.additionalMessage = 'This filters is based on the quick filter ' + this.defaultFilter.quickFilterName;
            }
          },
          error: err => {
            this.errorMessage = 'Error getting tissue list. Please contact your DSM developer\n ' + err;
          },
        });
    } else {
      this.dsmService.filterData(localStorage.getItem(ComponentService.MENU_SELECTED_REALM), null, this.parent, defaultFilter)
        .subscribe({
          next: data => {
            const date = new Date();
            this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
            this.tissueListWrappers = [];
            this.originalTissueListWrappers = [];
            this.copyTissueListWrappers = [];
            this.tissueListsMap = {};
            this.tissueListOncHistories = [];
            const jsonData = data;
            this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
            this.originalTissueListWrappers = this.tissueListWrappers;
            for (const tissueList of this.tissueListWrappers) {
              this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
            }
            for (const key of Object.keys(this.tissueListsMap)) {
              this.tissueListOncHistories.push(this.tissueListsMap[key]);
            }

            if (!this.isDefaultFilter || this.defaultFilterName === undefined ||
              this.defaultFilterName === null || this.defaultFilterName === ''
            ) {
              this.setDefaultColumns(false);
            } else {
              if (this.defaultFilter == null) {
                this.getAllFilters(this.currentQuickFilterName === null && this.currentFilter === null);
              } else {
                this.selectedColumns = this.defaultFilter.columns;
                if (!this.hasESData) {
                  this.filterProfileForNoESRelams(this.defaultFilter);
                }
                for (const tissueList of this.tissueListWrappers) {
                  this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
                }
                for (const key of Object.keys(this.tissueListsMap)) {
                  this.tissueListOncHistories.push(this.tissueListsMap[key]);
                }
              }
            }
            this.loading = false;

          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.auth.logout();
            }
            this.errorMessage = 'Error - Loading Tissues for tissue view, Please contact your DSM developer\n ' + err;
          },
        });
    }
  }

  showCustomizeView(): void {
    this.showFilters = false;
    this.showSavedFilters = false;
    this.showQueues = false;
    this.showCustomizeViewTable = !this.showCustomizeViewTable;
  }

  showFiltersTable(): void {
    this.showCustomizeViewTable = false;
    this.showSavedFilters = false;
    this.showFilters = !this.showFilters;
    this.showQueues = false;
  }

  showSavedFiltersPanel(): void {
    this.showCustomizeViewTable = false;
    this.showSavedFilters = !this.showSavedFilters;
    this.showFilters = false;
    this.showQueues = false;
    this.getAllFilters(false);
  }

  addOrRemoveColumn(column: Filter, parent: string): void {
    if (this.selectedColumns[ parent ] == null) {
      this.selectedColumns[ parent ] = [];
    }
    if (this.hasThisColumnSelected(this.selectedColumns[ parent ], column)) {
      const f = this.selectedColumns[ parent ].find(item =>
        item.participantColumn.tableAlias === column.participantColumn.tableAlias &&
        item.participantColumn.name === column.participantColumn.name
      );
      const index = this.selectedColumns[ parent ].indexOf(f);
      this.selectedColumns[ parent ].splice(index, 1);
    } else {
      this.selectedColumns[ parent ].push(column);
    }
  }

  public reload(defaultFilter): void {
    this.resetEverything(true);
    this.checkRight(defaultFilter);
  }

  public clearFilters(): void {
    for (const source of this.dataSources) {
      for (let filter of this.selectedColumns[ source ]) {
        filter = filter.clearFilter();
      }
      for (let filter of this.allColumns[ source ]) {
        filter = filter.clearFilter();
      }
    }
    this.currentQuickFilterName = '';
  }

  hasRole(): RoleService {
    return this.role;
  }

  public doFilter(): void {
    this.isDefaultFilter = false;
    this.additionalMessage = '';
    const json = [];
    this.cleanSearchBoxAndSavedFilter();
    this.loading = true;
    json.concat(this.currentFilter);
    for (const array of this.dataSources) {
      if (this.selectedColumns[ array ] == null) {
        continue;
      }
      for (const filter of this.selectedColumns[ array ]) {
        const filterText = Filter.getFilterText(filter, array);
        if (filterText != null && array === Statics.ES_ALIAS&& filter.participantColumn.name != ParticipantColumn.ASSIGNEE_TISSUE.name) {
          filterText[ 'exactMatch' ] = true;
          filterText[ 'parentName' ] = filter.participantColumn.object;
        }
        if (filterText != null) {
          json.push(filterText);
        }
      }
    }

    const jsonPatch = JSON.stringify({
      filters: json,
      parent: this.parent,
      quickFilterName: this.currentQuickFilterName,
    });
    this.currentFilter = json;
    this.currentView = jsonPatch;
    this.dsmService.filterData(localStorage.getItem(ComponentService.MENU_SELECTED_REALM), jsonPatch, this.parent, null)
      .subscribe({
        next: data => {
          this.loading = false;
          window.scrollTo(0, 0);
          const date = new Date();
          this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
          this.tissueListWrappers = [];
          this.originalTissueListWrappers = [];
          this.copyTissueListWrappers = [];
          this.tissueListsMap = {};
          this.tissueListOncHistories = [];
          const jsonData = data;
          jsonData.forEach((val) => {
            const tissueList = TissueListWrapper.parse(val);
            this.tissueListWrappers.push(tissueList);
          });
          this.originalTissueListWrappers = this.tissueListWrappers;
          if (!this.hasESData) {
            // check if it was a tableAlias data filter -> filter client side
            this.filterProfileForNoESRelams(null);
          }
          for (const tissueList of this.tissueListWrappers) {
            this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
          }
          for (const key of Object.keys(this.tissueListsMap)) {
            this.tissueListOncHistories.push(this.tissueListsMap[key]);
          }
        },
        error: err => {
          this.loading = null;
          this.errorMessage = 'Error - Loading Tissue List, Please contact your DSM developer\n ' + err;
        },
      });

    if (!this.hasESData) {
      // check if it was a tableAlias data filter -> filter client side
      this.filterProfileForNoESRelams(null);
    }

  }

  private cleanSearchBoxAndSavedFilter(): void {
    this.filterQuery = '';
    this.textQuery = null;
    this.selectedFilterName = ' ';
  }

  openTissue(oncHis: OncHistoryDetail, participant: Participant, tissueId): void {
    if (participant == null) {
      this.loading = false;
      return;
    }
    this.oncHistoryDetail = oncHis;
    this.compService.editable = true;
    this.participant = participant;
    this.showTissue = true;
    this.tissueId = tissueId;
    const tissuesArray = [];
    for (const o of this.tissueListWrappers) {
      if (o.tissueList.oncHistoryDetails.oncHistoryDetailId === oncHis.oncHistoryDetailId) {
        tissuesArray.push(o.tissueList.tissue);
      }
    }
    this.oncHistoryDetail.tissues = tissuesArray;
    this.loading = false;
  }

  showSavedModal(): void {
    this.showModal = true;
    this.newFilterModal = true;
    this.openTissueModal = false;
    this.openAssigneeModal = false;
    this.modal.show();
  }

  showAssignModal(): void {
    this.showModal = true;
    this.newFilterModal = false;
    this.openTissueModal = false;
    this.openAssigneeModal = true;
    this.modal.show();
  }

  saveCurrentFilter(): void {
    this.dup = false;
    this.plus = false;
    if (this.newFilterName == null) {
      return;
    }
    if (this.newFilterName.includes('+')) {
      this.plus = true;
      return;
    }
    const cols = [];
    for (const source of this.dataSources) {
      for (const o of this.selectedColumns[ source ]) {
        cols.push(o.participantColumn.tableAlias + '.' + o.participantColumn.name);
      }
    }

    const jsonData = {
      columnsToSave: cols,
      filterName: this.newFilterName,
      shared: '0',
      fDeleted: '0',
      filters: this.currentFilter,
      parent: this.parent,
      quickFilterName: this.currentQuickFilterName,
      queryItems: this.filterQuery,
    };
    const jsonPatch = JSON.stringify(jsonData);
    this.currentView = jsonPatch;
    this.dsmService.saveCurrentFilter(jsonPatch, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent).subscribe({
      next: data => {
        const result = Result.parse(data);
        if (result.code === 500 && result.body != null) {
          this.newFilterModal = true;
          this.dup = true;
          return;
        } else if (result.code !== 500) {
          this.dup = false;
          this.plus = false;
          this.newFilterName = '';
          this.modal.hide();
          this.newFilterModal = false;
          this.openTissueModal = false;
        }
      },
      error: err => {
        if (err.status === 500) {
          this.newFilterModal = true;
          this.dup = true;
          return;
        }
        this.errorMessage = 'Error saving the filter. Please contact your DSM developer\n ' + err;
      }
    });
    this.showModal = false;
    this.newFilterModal = false;
    this.openTissueModal = false;
  }

  getAllFilters(applyDefault: boolean): void {
    this.dsmService.getFiltersForUserForRealm(localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent)
      .subscribe({
        next: jsonData => {
          this.savedFilters = [];
          this.quickFilters = [];
          jsonData.forEach((val) => {
            const view: ViewFilter = ViewFilter.parseFilter(val, this.allColumns);

            if (val.userId.includes('System')) {
              this.quickFilters.push(view);
            } else {
              this.savedFilters.push(view);
            }
          });
          this.savedFilters.sort((vf1, vf2) => vf1.filterName.localeCompare(vf2.filterName));
          if (this.isDefaultFilter && applyDefault) {
            this.selectedFilterName = this.defaultFilterName;
            this.defaultFilter = this.savedFilters.find(f => f.filterName === this.defaultFilterName);
            if (this.defaultFilter == null) {
              this.defaultFilter = this.quickFilters.find(f => f.filterName === this.defaultFilterName);
            }
            if (this.defaultFilter != null) {
              this.currentFilter = this.defaultFilter.filters;
              this.selectedColumns = this.defaultFilter.columns;
              for (const dataSource of this.dataSources) {
                if (this.selectedColumns[dataSource] == null) {
                  this.selectedColumns[dataSource] = [];
                }
              }
              this.edit = true;
              this.filterQuery = this.defaultFilter.queryItems;
              this.textQuery = this.defaultFilter.queryItems;
              this.loading = false;
              if (this.defaultFilter.quickFilterName != null && this.defaultFilter.quickFilterName !== '') {
                this.additionalMessage = 'This filters is based on the quick filter ' + this.defaultFilter.quickFilterName;
              }
            } else if (this.defaultFilterName !== '' && this.defaultFilterName !== null && this.defaultFilterName !== undefined) {
              this.setDefaultColumns(false);
              if (this.isDefaultFilter) {
                // eslint-disable-next-line max-len
                this.additionalMessage = 'The default filter seems to be deleted, however it is still the default filter as long as not changed in the user settings.';
              }
            }
          }

        },
        error: err => {
          this.errorMessage = 'Error getting all the filters. Please contact your DSM developer\n ' + err;
        }
      });
  }

  public shareFilter(savedFilter: ViewFilter, i): void {
    const value = savedFilter.shared ? '0' : '1';
    const patch1 = new PatchUtil(savedFilter.id, this.role.userMail(),
      { name: 'shared', value }, null, this.parent, null, null, null, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), null);
    const patch = patch1.getPatch();
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(data => {
      const result = Result.parse(data);
      if (result.code === 200) {
        this.savedFilters[ i ].shared = (value === '1');
      }
    });
  }

  public deleteView(savedFilter): void {
    const patch1 = new PatchUtil(
      savedFilter.id, this.role.userMail(),
      { name: 'fDeleted', value: '1' },
      null, this.parent, null, null, null,
      localStorage.getItem(ComponentService.MENU_SELECTED_REALM), null
    );
    const patch = patch1.getPatch();
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(data => {
      const result = Result.parse(data);
      if (result.code === 200) {
        this.getAllFilters(false);
      }
    });
  }

  public selectFilter(savedFilter): void {
    this.additionalMessage = '';
    this.loading = true;
    this.sortParent = null;
    this.sortColumn = null;
    this.sortField = null;
    this.sortDir = null;
    this.currentView = JSON.stringify(savedFilter);
    this.currentQuickFilterName = null;
    this.additionalMessage = '';
    for (const dataSource of this.dataSources) {
      if (this.allColumns[ dataSource ] != null) {
        for (let col of this.allColumns[ dataSource ]) {
          col = col.clearFilter(col);
        }
      }
    }

    this.dsmService.applyFilter(savedFilter, this.realm, this.parent, null).subscribe({
      next: data => {
        if (savedFilter != null && savedFilter.filters != null) {
          this.adjustAllColumns(savedFilter);
        }
        const date = new Date();
        this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
        this.tissueListWrappers = [];
        this.originalTissueListWrappers = [];
        this.copyTissueListWrappers = [];
        this.tissueListsMap = {};
        this.tissueListOncHistories = [];
        const jsonData = data;
        this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
        this.originalTissueListWrappers = this.tissueListWrappers;
        this.currentFilter = savedFilter.filters;
        this.selectedFilterName = savedFilter.filterName;
        this.selectedColumns = savedFilter.columns;
        if (savedFilter != null) {
          for (const filter of savedFilter.filters) {
            if (filter.type === Filter.OPTION_TYPE) {
              if (filter.participantColumn.name === ParticipantColumn.ASSIGNEE_TISSUE.name) {
                filter = this.adjustAssigneeSavedFilterColumn(filter);
              }else {
                filter.selectedOptions = filter.getSelectedOptionsBoolean();
              }
            }
          }
        }
        for (const dataSource of this.dataSources) {
          if (this.selectedColumns[ dataSource ] == null) {
            this.selectedColumns[ dataSource ] = [];
          }
        }
        if (!this.hasESData) {
          // check if it was a tableAlias data filter -> filter client side
          this.filterProfileForNoESRelams(savedFilter);
        }
        for (const tissueList of this.tissueListWrappers) {
          this.tissueListsMap[ tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId ] = tissueList;
        }
        for (const key of Object.keys(this.tissueListsMap)) {
          this.tissueListOncHistories.push(this.tissueListsMap[ key ]);
        }
        this.edit = true;
        this.filterQuery = savedFilter.queryItems;
        this.textQuery = savedFilter.queryItems;
        this.loading = false;
        if (savedFilter.quickFilterName !== undefined && savedFilter.quickFilterName !== null && savedFilter.quickFilterName !== '') {
          this.additionalMessage = 'This filters is based on the quick filter ' + savedFilter.quickFilterName;
        }
      },
      error: err => {
        this.errorMessage = 'Error applying the selected filter. Please contact your DSM developer\n ' + err;
      },
    });
  }

  public applyQuickFilter(quickFilter): void {
    this.additionalMessage = '';
    this.loading = true;
    this.currentQuickFilterName = quickFilter.name;
    this.currentView = JSON.stringify(quickFilter);
    this.dsmService.applyFilter(quickFilter, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent, null)
      .subscribe({
        next: data => {
          if (quickFilter != null && quickFilter.filters != null) {
            this.adjustAllColumns(quickFilter);
          }
          const date = new Date();
          this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
          this.currentQuickFilterName = quickFilter.filterName;
          this.tissueListWrappers = [];
          this.originalTissueListWrappers = [];
          this.copyTissueListWrappers = [];
          this.tissueListsMap = {};
          this.tissueListOncHistories = [];
          const jsonData = data;
          this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
          for (const tissueList of this.tissueListWrappers) {
            this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
          }
          this.originalTissueListWrappers = this.tissueListWrappers;
          for (const key of Object.keys(this.tissueListsMap)) {
            this.tissueListOncHistories.push(this.tissueListsMap[key]);
          }
          if (quickFilter != null && quickFilter.filters != null) {
            for (const filter of quickFilter.filters) {
              if (filter.type === Filter.OPTION_TYPE) {
                filter.selectedOptions = filter.getSelectedOptionsBoolean();
              }
            }
          }
          for (const s of this.dataSources) {
            if (quickFilter.columns[s] != null) {
              this.selectedColumns[s] = quickFilter.columns[s];
            } else {
              this.selectedColumns[s] = [];
            }
          }

          this.getFieldSettings();
          this.filterQuery = quickFilter.queryItems;
          this.textQuery = quickFilter.queryItems;
          this.edit = false;
          this.loading = false;
        },
        error: err => {
          this.errorMessage = 'Error applying the quick filter. Please contact your DSM developer\n ' + err;
        },
      });
  }

  public getDestroyingQueue(filterName: string): void {
    this.loading = true;
    this.currentQuickFilterName = filterName;
    this.textQuery = '';
    this.filterQuery = '';
    this.wrongQuery = false;
    const destroyingViewFilter = new ViewFilter(null, filterName, this.destructionPolicyColumns, false, '0',
      null, null, this.parent, null, null, null);
    this.dsmService.applyFilter(destroyingViewFilter, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent, null)
      .subscribe({
        next: data => {
          if (destroyingViewFilter.filters != null) {
            this.adjustAllColumns(destroyingViewFilter);
          }
          const date = new Date();
          this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
          this.tissueListWrappers = [];
          this.originalTissueListWrappers = [];
          this.copyTissueListWrappers = [];
          this.tissueListsMap = {};
          this.tissueListOncHistories = [];
          const jsonData = data;
          this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
          for (const tissueList of this.tissueListWrappers) {
            this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
          }
          this.originalTissueListWrappers = this.tissueListWrappers;
          for (const key of Object.keys(this.tissueListsMap)) {
            this.tissueListOncHistories.push(this.tissueListsMap[key]);
          }
          this.loading = false;
          //        this.setDefaultColumns();
          this.selectedColumns = this.destructionPolicyColumns;
          for (const dataSource of this.dataSources) {
            if (this.selectedColumns[dataSource] == null) {
              this.selectedColumns[dataSource] = [];
            }
          }
          this.getFieldSettings();
        },
        error: err => {
          this.errorMessage = 'Error applying the quick filter. Please contact your DSM developer\n ' + err;
        },
      });
  }

  public setSelectedFilterName(filterName): void {
    this.selectedFilterName = filterName;
  }

  onRequestChange(index: number): void {
    this.valueChanged(this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.request, 'request', index);
  }

  valueChanged(value: any, parameterName: string, index: number): void {
    let v;
    if (typeof value === 'string') {
      this.tissueListWrappers[ index ].tissueList.oncHistoryDetails[ parameterName ] = value;
      v = value;
    } else if (value != null) {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      } else if (typeof value === 'object') {
        v = JSON.stringify(value);
      }
    }
    if (v != null) {
      const patch1 = new PatchUtil(
        this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.oncHistoryDetailId, this.role.userMail(),
        {
          name: parameterName,
          value: v,
        }, null, 'participantId', this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.participantId,
        Statics.ONCDETAIL_ALIAS, null,
        localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.tissueListWrappers[ index ].tissueList.ddpParticipantId
      );
      const patch = patch1.getPatch();
      this.patch(patch, index);
    }
  }

  patch(patch: any, index: number): void {
    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({  // need to subscribe, otherwise it will not send!
      next: data => {
        const result = Result.parse(data);
        if (result.code === 200 && result.body != null && result.body !== '') {
          const jsonData: any | any[] = JSON.parse(result.body);
          if (jsonData instanceof Array) {
            jsonData.forEach((val) => {
              const nameValue = NameValue.parse(val);
              this.tissueListWrappers[ index ].tissueList.oncHistoryDetails[ nameValue.name ] = nameValue.value;
            });
          } else {
            this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.oncHistoryDetailId = jsonData.oncHistoryDetailId;
            // set oncHistoryDetailId to tissue as well
            for (const tissue of this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.tissues) {
              tissue.oncHistoryDetailId = this.tissueListWrappers[ index ].tissueList.oncHistoryDetails.oncHistoryDetailId;
            }
            // set other workflow values
            if (jsonData.NameValue != null) {
              const innerJson: any | any[] = JSON.parse(jsonData.NameValue);
              if (innerJson instanceof Array) {
                innerJson.forEach((val) => {
                  const nameValue = NameValue.parse(val);
                  if (nameValue.name === 'createdOncHistory') {
                    this.participant.participant[ nameValue.name ] = nameValue.value;
                  } else {
                    this.tissueListWrappers[ index ].tissueList.oncHistoryDetails[ nameValue.name ] = nameValue.value;
                  }
                });
              }
            }
          }
        }
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.router.navigate([ Statics.HOME_URL ]);
        }
      },
    });
  }

  openParticipant(participant: Participant, oncHistoryId): void {
    if (participant != null) {
      this.loading = true;
      this.participant = participant;
      this.selectedTab = 'Onc History';
      this.showParticipantInformation = true;
      this.oncHistoryId = oncHistoryId;
    }
    this.loading = false;
  }

  public getParticipant(tissueListWrapper: TissueListWrapper, name, tissueId?): void {
    this.loading = true;
    if (name === 't' && (tissueListWrapper.tissueList.oncHistoryDetails == null ||
      (tissueListWrapper.tissueList.oncHistoryDetails.request !== 'sent'
        && tissueListWrapper.tissueList.oncHistoryDetails.request !== 'received'
        && tissueListWrapper.tissueList.oncHistoryDetails.request !== 'returned'
      )
    )) {
      this.selectedTissueStatus = this.getRequestStatusDisplay(tissueListWrapper.tissueList.oncHistoryDetails.request);
      this.newFilterModal = false;
      this.openTissueModal = true;
      this.modal.show();
      this.loading = false;
    } else {
      this.dsmService.getParticipantData(
          localStorage.getItem(ComponentService.MENU_SELECTED_REALM),
          tissueListWrapper.tissueList.ddpParticipantId, this.parent
        )
        .subscribe({
          next: data => {
            const participant: Participant = Participant.parse(data[0]);
            if (participant == null) {
              this.errorMessage = 'Participant not found';
            }
            if (name === 't') {
              this.openTissue(tissueListWrapper.tissueList.oncHistoryDetails, participant, tissueId);
            } else if (name === 'oD') {
              this.openParticipant(participant, tissueListWrapper.tissueList.oncHistoryDetails.oncHistoryDetailId);
            }
          },
          error: err => {
            this.errorMessage = 'Could not get participant. Please contact your DSM developer\n ' + err;
          },
        });
    }
  }

  stopIfRequest(e, tissueList, name): void {
    if (name === 'request') {
      e.stopPropagation();
    } else {
      this.getParticipant(tissueList, 'oD');
    }
  }

  sortByColumnName(col: Filter, sortParent: string): void {
    this.sortDir = this.sortField === col.participantColumn.name ? (this.sortDir === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortField = col.participantColumn.name;
    this.sortParent = sortParent;
    this.sortColumn = col;
    this.doSort();
    if (this.sortColumn.type === 'ADDITIONALVALUE') {
      this.sortField = col.participantColumn.name;
    }
  }

  public isSortField(name: string): boolean {
    return name === this.sortField;
  }

  private checkAdditionalValues(savedFilter: ViewFilter): string {
    let message = '';
    if (savedFilter.filters != null) {
      for (const filter of savedFilter.filters) {
        if (filter.type === 'ADDITIONALVALUE' && filter.participantColumn.display == null) {
          message = message + filter.filter2.name + ', ';
        }
      }
    }
    if (message.length > 0) {
      message = 'The following columns do not apply in this study: ' + message;
    }
    return message;
  }

  downloadCurrentData(): void {
    const date = new Date();
    const fileName = 'Tissue_' + Utils.getDateFormatted(date, Utils.DATE_STRING_CVS) + Statics.CSV_FILE_EXTENSION;
    if (this.selectedColumns[ 't' ] != null && this.selectedColumns[ 't' ].length > 0) {
      Utils.downloadCurrentData(
        this.tissueListWrappers,
        [ [ 'data', Statics.ES_ALIAS ], [ 'tissueList', '', 'oncHistoryDetails', 'oD' ], [ 'tissueList', '', 'tissue', 't' ] ],
        this.selectedColumns, fileName
      );
    } else {
      Utils.downloadCurrentData(
        this.tissueListOncHistories,
        [ [ 'data', Statics.ES_ALIAS ], [ 'tissueList', '', 'oncHistoryDetails', 'oD' ], [ 'tissue', 't' ] ],
        this.selectedColumns,
        fileName
      );
    }
  }

  public doFilterByQuery(queryText: string): void {
    this.deactivateSavedFilterIfNotInUse(queryText);
    this.dsmService.applyFilter(null, localStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.parent, queryText)
      .subscribe({
        next: data => {
          const date = new Date();
          this.additionalMessage = null;
          this.loadedTimeStamp = Utils.getDateFormatted(date, Utils.DATE_STRING_IN_EVENT_CVS);
          this.tissueListWrappers = [];
          this.originalTissueListWrappers = [];
          this.copyTissueListWrappers = [];
          this.tissueListsMap = {};
          this.tissueListOncHistories = [];
          const jsonData = data;
          this.tissueListWrappers = this.parseTissueListWrapperData(jsonData);
          for (const tissueList of this.tissueListWrappers) {
            this.tissueListsMap[tissueList.tissueList.oncHistoryDetails.oncHistoryDetailId] = tissueList;
          }
          this.originalTissueListWrappers = this.tissueListWrappers;
          for (const key of Object.keys(this.tissueListsMap)) {
            this.tissueListOncHistories.push(this.tissueListsMap[key]);
          }
          this.textQuery = queryText;
          this.filterQuery = this.textQuery;
        },
        error: err => {
          this.errorMessage = 'Error searching. Please contact your DSM developer\n ' + err;
        }
      });
  }

  private deactivateSavedFilterIfNotInUse(queryText: string): void {
    if (this.filterQuery !== queryText) {
      this.selectedFilterName = '';
    }
  }

  getButtonColorStyle(isOpened: boolean): string {
    if (isOpened) {
      return Statics.COLOR_PRIMARY;
    }
    return Statics.COLOR_BASIC;
  }

  isCurrentFilter(filterName: string): string {
    return filterName === this.currentQuickFilterName ? Statics.COLOR_PRIMARY : Statics.COLOR_BASIC;
  }

  private doSort(): void {
    let fieldName = '';
    if (this.sortColumn.type === 'ADDITIONALVALUE') {
      fieldName = this.sortField;
    }
    const order = this.sortDir === 'asc' ? 1 : -1;
    if (this.sortParent === Statics.ES_ALIAS) {
      if (this.selectedColumns[ 't' ] != null && this.selectedColumns[ 't' ].length > 0) {
        this.tissueListWrappers.sort((a, b) => {
            if (
              a.data[ this.sortColumn.participantColumn.object ] == null
              || a.data[ this.sortColumn.participantColumn.object ][ this.sortField ] == null
            ) {
              return 1;
            }
            if (
              b.data[ this.sortColumn.participantColumn.object ] == null
              || b.data[ this.sortColumn.participantColumn.object ][ this.sortField ] == null
            ) {
              return -1;
            }

            if (
              this.sortColumn.type !== 'DATE' && this.sortColumn.type !== 'NUMBER'
              && !(this.sortColumn.type === 'ADDITIONALVALUE' && this.sortColumn.additionalType === 'NUMBER')
            ) {
              return (order * a.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
                .localeCompare(b.data[ this.sortColumn.participantColumn.object ][ this.sortField ]));
            } else {
              return (
                order * a.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
                - b.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
              );
            }
          },
        );
      } else {
        this.tissueListOncHistories.sort((a, b) => {
            if (a.data[ this.sortColumn.participantColumn.object ][ this.sortField ] == null) {
              return 1;
            }
            if (b.data[ this.sortColumn.participantColumn.object ][ this.sortField ] == null) {
              return -1;
            }

            if (typeof a.data[ this.sortColumn.participantColumn.object ][ this.sortField ] === 'string') {
              return (order * a.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
                .localeCompare(b.data[ this.sortColumn.participantColumn.object ][ this.sortField ]));
            } else {
              return (
                order * a.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
                - a.data[ this.sortColumn.participantColumn.object ][ this.sortField ]
              );
            }
          },
        );
      }
    } else if (this.sortParent === 'oD') {
      if (this.selectedColumns[ 't' ] != null && this.selectedColumns[ 't' ].length > 0) {
        this.tissueListWrappers.sort((a, b) => {
            if (this.sortColumn.type === 'ADDITIONALVALUE') {
              this.sortField = 'additionalValues';
              if (
                a.tissueList.oncHistoryDetails[ this.sortField ] == null
                || a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] == null
                || a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === ''
              ) {
                return 1;
              }
              if (
                b.tissueList.oncHistoryDetails[ this.sortField ] == null
                || b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] == null
                || b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === ''
              ) {
                return -1;
              }

              if (typeof a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === 'string') {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                  .localeCompare(b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]));
              } else {
                return (
                  order * a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                  - b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                );
              }

            } else {

              if (a.tissueList.oncHistoryDetails[ this.sortField ] == null) {
                return 1;
              }
              if (b.tissueList.oncHistoryDetails[ this.sortField ] == null) {
                return -1;
              }

              if (typeof a.tissueList.oncHistoryDetails[ this.sortField ] === 'string') {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ]
                  .localeCompare(b.tissueList.oncHistoryDetails[ this.sortField ]));
              } else {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ] - b.tissueList.oncHistoryDetails[ this.sortField ]);
              }
            }
          },
        );
      } else {
        this.tissueListOncHistories.sort((a, b) => {
            if (this.sortColumn.type === 'ADDITIONALVALUE') {
              this.sortField = 'additionalValues';
              if (
                a.tissueList.oncHistoryDetails[ this.sortField ] == null
                || a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] == null
                || a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === ''
              ) {
                return 1;
              }
              if (
                b.tissueList.oncHistoryDetails[ this.sortField ] == null
                || b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] == null
                || b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === ''
              ) {
                return -1;
              }

              if (typeof a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ] === 'string') {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                  .localeCompare(b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]));
              } else {
                return (
                  order * a.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                  - b.tissueList.oncHistoryDetails[ this.sortField ][ fieldName ]
                );
              }

            } else {
              if (a.tissueList.oncHistoryDetails[ this.sortField ] == null) {
                return 1;
              }
              if (b.tissueList.oncHistoryDetails[ this.sortField ] == null) {
                return -1;
              }

              if (typeof a.tissueList.oncHistoryDetails[ this.sortField ] === 'string') {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ]
                  .localeCompare(b.tissueList.oncHistoryDetails[ this.sortField ]));
              } else {
                return (order * a.tissueList.oncHistoryDetails[ this.sortField ] - b.tissueList.oncHistoryDetails[ this.sortField ]);
              }
            }
          },
        );
      }
    } else if (this.sortParent === 't') {
      this.tissueListWrappers.sort((a, b) => {
          if (this.sortColumn.type === 'ADDITIONALVALUE') {
            this.sortField = 'additionalValues';
            if (a.tissueList.tissue == null || a.tissueList.tissue[ this.sortField ] == null) {
              return 1;
            }
            if (b.tissueList.tissue == null || b.tissueList.tissue[ this.sortField ] == null) {
              return -1;
            }
            if (
              a.tissueList.tissue[ this.sortField ] == null
              || a.tissueList.tissue[ this.sortField ][ fieldName ] == null
              || a.tissueList.tissue[ this.sortField ][ fieldName ] === ''
            ) {
              return 1;
            }
            if (
              b.tissueList.tissue[ this.sortField ] == null
              || b.tissueList.tissue[ this.sortField ][ fieldName ] == null
              || b.tissueList.tissue[ this.sortField ][ fieldName ] === ''
            ) {
              return -1;
            }

            if (typeof a.tissueList.tissue[ this.sortField ][ fieldName ] === 'string') {
              return (order * a.tissueList.tissue[ this.sortField ][ fieldName ]
                .localeCompare(b.tissueList.tissue[ this.sortField ][ fieldName ]));
            } else {
              return (order * a.tissueList.tissue[ this.sortField ][ fieldName ] - b.tissueList.tissue[ this.sortField ][ fieldName ]);
            }

          } else {
            if (a.tissueList.tissue == null || a.tissueList.tissue[ this.sortField ] == null) {
              return 1;
            }
            if (b.tissueList.tissue == null || b.tissueList.tissue[ this.sortField ] == null) {
              return -1;
            }

            if (typeof a.tissueList.tissue[ this.sortField ] === 'string') {
              return (order * a.tissueList.tissue[ this.sortField ].localeCompare(b.tissueList.tissue[ this.sortField ]));
            } else {
              return (order * a.tissueList.tissue[ this.sortField ] - b.tissueList.tissue[ this.sortField ]);
            }
          }
        },
      );
    }
  }

  private sort(x, y, order): number {
    if (x == null || x[ this.sortField ] == null) {
      return 1;
    } else if (y == null || y[ this.sortField ] == null) {
      return -1;
    } else {
      if (x[ this.sortField ].toLowerCase() < y[ this.sortField ].toLowerCase()) {
        return -1 * order;
      } else if (x[ this.sortField ].toLowerCase() > y[ this.sortField ].toLowerCase()) {
        return 1 * order;
      } else {
        return 0;
      }
    }
  }

  public getDefaultFilterName(): void {
    this.defaultFilterName = this.role.getUserSetting().defaultTissueFilter;
  }

  private getRequestStatusDisplay(request: string): string {
    switch (request) {
      case 'no':
        return 'Don\'t Request';

      case 'hold':
        return 'On Hold';

      case 'review':
        return 'Needs Review';

      case 'unable To Obtain':
        return 'Unable To Obtain';

      case 'other':
        return 'Other';

      default:
        return request;

    }
  }

  public getDisplayValueForFilter(column: Filter, name: string): string {
    if (column.type !== Filter.OPTION_TYPE) {
      return name;
    }
    for (const nameValue of column.options) {
      if (nameValue.name === name) {
        return nameValue.value;
      }
    }
    return name;
  }

  private filterProfileForNoESRelams(viewFilter: ViewFilter): void {
    // check if it was a filter with tableAlias of data -> filter client side
    // todo the 3 lists copyTissueListWrappers, originalTissueListWrappers and tissueListWrappers should become one when this removed and
    // all studies migrated
    if (viewFilter != null && viewFilter.filters != null && viewFilter.filters.length !== 0) {
      this.copyTissueListWrappers = this.originalTissueListWrappers;
      this.filterParticipantForNoESRealms(viewFilter.filters);
      this.tissueListWrappers = this.copyTissueListWrappers;
    } else if (viewFilter == null) {
      if (this.selectedColumns[ 'data' ].length !== 0) {
        this.copyTissueListWrappers = this.originalTissueListWrappers;
        this.filterParticipantForNoESRealms(this.selectedColumns[ Statics.ES_ALIAS ]);
      }
    }
  }

  private filterParticipantForNoESRealms(filters: Filter[]): void {
    for (const filter of filters) {
      if (filter.participantColumn.tableAlias === 'data') {
        const tmp = filter.participantColumn.object != null ? filter.participantColumn.object : filter.participantColumn.tableAlias;
        const filterText = Filter.getFilterText(filter, tmp);
        if (filterText != null) {
          if (filter.type === 'TEXT') {
            let value = filterText[ 'filter1' ][ 'value' ];
            if (value !== null) {
              if (value.includes('\'')) {
                const first = value.indexOf('\'');
                const last = value.lastIndexOf('\'');
                value = value.substring(first + 1, last);
              } else if (value.includes('"')) {
                const first = value.indexOf('"');
                const last = value.lastIndexOf('"');
                value = value.substring(first + 1, last);
              }
              this.copyTissueListWrappers = this.copyTissueListWrappers.filter(tissueListWrapper =>
                tissueListWrapper.data[ filterText[ 'parentName' ] ][ filterText[ 'filter1' ][ 'name' ] ] === value,
              );

            } else {
              const empt = filterText[ 'empty' ];
              if (empt === 'true') {
                this.copyTissueListWrappers = this.copyTissueListWrappers.filter(tissueListWrapper =>
                  tissueListWrapper.data[ filterText[ 'parentName' ] ][ filterText[ 'filter1' ][ 'name' ] ] === null,
                );
              } else {
                const notempt = filterText[ 'notEmpty' ];
                if (notempt === 'true') {
                  this.copyTissueListWrappers = this.copyTissueListWrappers.filter(tissueListWrapper =>
                    tissueListWrapper.data[ filterText[ 'parentName' ] ][ filterText[ 'filter1' ][ 'name' ] ] !== null,
                  );
                }
              }
            }
          } else if (filterText[ 'type' ] === 'OPTIONS') {
            // console.log( this.copyTissueListWrappers );
            const results: TissueListWrapper[] = [];
            let temp: TissueListWrapper[] = [];
            for (const option of filterText[ 'selectedOptions' ]) {// status
              temp = this.copyTissueListWrappers.filter(tissueListWrapper =>
                tissueListWrapper.data[ filterText[ 'filter1' ][ 'name' ] ] === option,
              );
              for (const t of temp) {
                results.push(t);
              }
            }
            this.copyTissueListWrappers = results;
            this.tissueListWrappers = results;
          }
        }
      }

    }
    this.tissueListWrappers = this.copyTissueListWrappers;
  }

  private adjustAllColumns(viewFilter: ViewFilter): void {
    for (const filter of viewFilter.filters) {
      let t = filter.participantColumn.tableAlias;
      if (t === 'r' || t === 'o' || t === 'ex') {
        t = 'p';
      } else if (t === 'inst') {
        t = 'm';
      }
      else if (t === 'sm') {
        t = 't';
      }
      else if (t === "p") {
        t = "data";
      }
      for (const f of this.allColumns[ t ]) {
        if (f.participantColumn.name === filter.participantColumn.name) {
          const index = this.allColumns[ t ].indexOf(f);
          if (index !== -1) {
            this.allColumns[ t ].splice(index, 1);
            this.allColumns[ t ].push(filter.copy());
            break;
          }
        }
      }
    }
  }

  private parseTissueListWrapperData(jsonData): TissueListWrapper[] {
    this.hasESData = false;
    jsonData.forEach((val) => {
      const tissueListWrapper = TissueListWrapper.parse(val);
      if (tissueListWrapper.data.dsm !== undefined) {
        this.hasESData = true;
      }
      this.tissueListWrappers.push(tissueListWrapper);
    });
    return this.tissueListWrappers;
  }

  hasThisColumnSelected(selectedColumnArray: Array<Filter>, oncColumn: Filter): boolean {
    return !!selectedColumnArray.find(f =>
      f.participantColumn.tableAlias === oncColumn.participantColumn.tableAlias &&
      f.participantColumn.name === oncColumn.participantColumn.name
    );
  }

  createDefaultColumns(): any {
    this.selectedColumns['data'] = this.defaultESColumns;
    this.selectedColumns['oD'] = this.defaultOncHistoryColumns;
    this.selectedColumns['t'] = this.defaultTissueColumns;
    return this.selectedColumns;
  }

  assign(): void {
    this.additionalMessage = null;
    if (this.assignee != null && this.tissueListWrappers.length > 0) {
      const assignParticipants: Array<AssigneeParticipant> = [];
      for (const tissue of this.tissueListWrappers) {
        if (tissue.isSelected) {
          assignParticipants.push( new AssigneeParticipant( tissue.tissueList.participantId, this.assignee.assigneeId,
            this.assignee.email, tissue.data.profile[ 'shortId' ] ) );
        }
      }
      this.deselect();
      this.dsmService.assignParticipant(localStorage.getItem(ComponentService.MENU_SELECTED_REALM), false,
          this.assignTissue, JSON.stringify(assignParticipants)
        )
        .subscribe({ // need to subscribe, otherwise it will not send!
          next: data => {
            const result = Result.parse(data);
            if (result.code !== 200) {
              this.additionalMessage = result.body;
            }
            this.assignTissue = false;
          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.router.navigate([Statics.HOME_URL]);
            }
            this.additionalMessage = 'Error - Assigning Tissues, Please contact your DSM developer';
          }
        });
    }
    this.modal.hide();
    window.scrollTo( 0, 0 );
  }

  deselect(): void {
    for (const tissueListWrapper of this.tissueListWrappers) {
      if (tissueListWrapper.isSelected) {
        tissueListWrapper.isSelected = false;
      }
    }
  }

  checkboxChecked(): void {
    this.isAssignButtonDisabled = true;
    for (const tissueListWrapper of this.tissueListWrappers) {
      if (tissueListWrapper.isSelected) {
        this.isAssignButtonDisabled = false;
        break;
      }
    }
  }

  hasAssignees(): boolean {
    return Array.isArray(this.assignees) && this.assignees.length > 0;
  }

  private getAssignees( realm: string ): void {
    this.dsmService.getAssignees(realm).subscribe({
      next: data => {
        this.assignees = [];
        this.assignees.push( new Assignee( '-1', 'Remove Assignee', '' ) );
        data.forEach( ( val ) => {
          this.assignees.push( Assignee.parse( val ) );
        } );
        let assigneesMap = this.getAssigneeAsNameValue();
        if(!this.allColumns["data"].find( f => f.participantColumn.name === ParticipantColumn.ASSIGNEE_TISSUE.name))
          this.allColumns["data"].push(new Filter( ParticipantColumn.ASSIGNEE_TISSUE, Filter.OPTION_TYPE, assigneesMap ));
        for (let data of this.dataSources) {
          this.allColumns[ data ].sort( ( a, b ) => {
            return a.participantColumn.display.localeCompare( b.participantColumn.display );
          } );
        }
      },
      error: err => { console.log(err); }
    });
  }

  getAssigneeById( assigneeId: any ) {
    for (let assignee of this.assignees){
      if(assignee.assigneeId === assigneeId)
        return assignee.name;
    }
  }

  getAssigneeAsNameValue(){
    let assigneesMap = [];
    if (this.assignees) {
      this.assignees.forEach( assignee => {
        if (assignee.assigneeId !== "-1") {
          assigneesMap.push( new NameValue( assignee.assigneeId, assignee.name ) );
        }
      } );
    }
    return assigneesMap;
  }

  adjustAssigneeSavedFilterColumn(filter: Filter) {
    let assigneesMap = this.getAssigneeAsNameValue();
    let selectedOptions = filter.getSelectedOptionsBoolean( assigneesMap );
    filter.selectedOptions = selectedOptions;
    let f = this.selectedColumns[ 'data' ].find( filter => filter.participantColumn.name === ParticipantColumn.ASSIGNEE_TISSUE.name );
    if (f) {
      let index = this.selectedColumns[ 'data' ].indexOf( f );
      this.selectedColumns[ 'data' ].splice( index, 1 );
      f.selectedOptions = selectedOptions;
      this.selectedColumns[ 'data' ].push( f );
      for (let data of this.dataSources) {
        this.selectedColumns[ data ].sort( ( a, b ) => {
          return a.participantColumn.display.localeCompare( b.participantColumn.display );
        } );
      }
    }
    return filter;
  }
}
