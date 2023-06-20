import {AfterViewChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TabDirective} from 'ngx-bootstrap/tabs';
import {ActivatedRoute, Router} from '@angular/router';
import {mergeMap, Subject, Subscription} from 'rxjs';
import {ActivityDefinition} from '../activity-data/models/activity-definition.model';
import {FieldSettings} from '../field-settings/field-settings.model';
import {ESFile} from '../participant-list/models/file.model';
import {ParticipantData} from '../participant-list/models/participant-data.model';
import {PreferredLanguage} from '../participant-list/models/preferred-languages.model';
import {Participant} from '../participant-list/participant-list.model';
import {PDFModel} from '../pdf-download/pdf-download.model';
import {SequencingOrder} from '../sequencing-order/sequencing-order.model';
import {take} from 'rxjs/operators';

import {ComponentService} from '../services/component.service';
import {Auth} from '../services/auth.service';
import {DSMService} from '../services/dsm.service';
import {MedicalRecord} from '../medical-record/medical-record.model';
import {RoleService} from '../services/role.service';
import {Statics} from '../utils/statics';
import {Utils} from '../utils/utils';
import {OncHistoryDetail} from '../onc-history-detail/onc-history-detail.model';
import {ModalComponent} from '../modal/modal.component';
import {Tissue} from '../tissue/tissue.model';
import {Value} from '../utils/value.model';
import {Result} from '../utils/result.model';
import {NameValue} from '../utils/name-value.model';
import {Abstraction} from '../medical-record-abstraction/model/medical-record-abstraction.model';
import {AbstractionGroup, AbstractionWrapper} from '../abstraction-group/abstraction-group.model';
import {PatchUtil} from '../utils/patch.model';
import {ParticipantUpdateResultDialogComponent} from '../dialogs/participant-update-result-dialog.component';
import {AddFamilyMemberComponent} from '../popups/add-family-member/add-family-member.component';
import {Sample} from '../participant-list/models/sample.model';
import {ParticipantDSMInformation} from '../participant-list/models/participant.model';
import {ActivityData} from '../activity-data/activity-data.model';

const fileSaver = require('file-saver');

@Component({
  selector: 'app-participant-page',
  templateUrl: './participant-page.component.html',
  styleUrls: ['./participant-page.component.css']
})
export class ParticipantPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(ModalComponent)
  public universalModal: ModalComponent;

  @Input() parentList: string;
  @Input() participant: Participant;
  @Input() drugs: string[];
  @Input() cancers: string[];
  @Input() preferredLanguage: Array<PreferredLanguage>;
  @Input() hideMRTissueWorkflow: boolean;
  @Input() activeTab: string;
  @Input() activityDefinitions: Array<ActivityDefinition>;
  @Input() settings: {};
  @Input() checkBoxGroups: {};
  @Input() mrCoverPdfSettings: Value[];
  @Input() oncHistoryId: string;
  @Input() mrId: string;
  @Input() isAddFamilyMember: boolean;
  @Input() showGroupFields: boolean;
  @Input() hideSamplesTab: boolean;
  @Input() showContactInformation: boolean;
  @Input() showComputedObject: boolean;
  @Input() selectedActivityCode: string;
  @Input() hasSequencingOrders: boolean;
  @Output() leaveParticipant = new EventEmitter();
  @Output('ngModelChange') update = new EventEmitter();

  public sharedLearningsTabSubject = new Subject<void>();
  participantExited = true;
  participantNotConsented = true;

  medicalRecord: MedicalRecord;
  oncHistoryDetail: OncHistoryDetail;

  errorMessage: string;
  additionalMessage: string;

  source = 'normal';

  openActivity: string;

  loadingParticipantPage = false;

  noteMedicalRecord: MedicalRecord;

  showParticipantRecord = false;
  showMedicalRecord = false;
  showTissue = false;
  isOncHistoryDetailChanged = false;
  disableTissueRequestButton = true;
  canBeSequencedBasedOnLocation = false;

  facilityName: string;

  warning: string;

  currentPatchField: string;
  patchFinished = true;

  fileListUsed: string[] = [];

  abstractionFields: Array<AbstractionGroup>;
  reviewFields: Array<AbstractionGroup>;
  qcFields: Array<AbstractionGroup>;
  finalFields: Array<AbstractionGroup>;

  gender: string;
  counterReceived = 0;
  pdfs: Array<PDFModel> = [];
  selectedPDF: string;
  disableDownload = false;

  updatedFirstName: string;
  updatedLastName: string;
  updatedEmail: string;
  updatedDNC = false;
  updatingParticipant = false;
  private taskType: string;
  private checkParticipantStatusInterval: any;
  isEmailValid: boolean;
  isOncHistoryVisible = false;

  accordionOpenedPanel = '';

  private payload = {};

  downloading = false;
  message: string = null;
  bundle = false;
  private scrolled: boolean;
  private canSequence: boolean;

  sequencingOrdersArray = [];

  private ENROLLED = 'ENROLLED';
  private PREQUAL = 'PREQUAL';
  private SELF_COUNTRY = 'SELF_COUNTRY';
  private SELF_STATE = 'SELF_STATE';
  private ADD_PARTICIPANT = 'ADD_PARTICIPANT';
  private CHILD_COUNTRY = 'CHILD_COUNTRY_COPY';
  private CHILD_STATE = 'CHILD_STATE_COPY';
  private SELF_COUNTRY_US = 'US';
  private SELF_COUNTRY_CA = 'CA';
  private SELF_STATE_NY = 'NY';
  private ABOUT_YOU = 'ABOUT_YOU';
  private ASSIGNED_SEX = 'ASSIGNED_SEX';
  private CONDITIONAL_DISPLAY = 'conditionalDisplay';

  CLEAN = 'CLEAN';
  private SUCCESSFUL_DOWNLOAD_MESSAGE = 'File download finished.';
  private NOT_SCANNED_FILE_MESSAGE = 'Error - file has not passed scanning';

  subscriptions: Subscription = new Subscription();

  constructor(private auth: Auth, private compService: ComponentService, private dsmService: DSMService, private router: Router,
              private role: RoleService, private util: Utils, private route: ActivatedRoute, public dialog: MatDialog) {
    if (!auth.authenticated()) {
      auth.sessionLogout();
    }
    this.route.queryParams.subscribe(params => {
      const realm = params[DSMService.REALM] || null;
      if (realm != null) {
        //        this.compService.realmMenu = realm;
        this.leaveParticipant.emit(null);
      }
    });
  }

  public sharedLearningsTabSelected(): void {
    this.sharedLearningsTabSubject.next();
  }


  ngOnInit(): void {
    this.setDefaultProfileValues();
    this.payload = {
      participantGuid: this.participant.data.profile['guid'],
      instanceName: this.compService.getRealm(),
      data: {}
    };
    this.handleParticipantProfileUpdate();
    this.loadInstitutions();
    this.scrolled = false;
    if (!this.selectedActivityCode) {
      window.scrollTo(0, 0);
      this.scrolled = true;
    }
    this.validateEmailInput(this.participant.data.profile['email'] || '');
    this.isOncHistoryVisible = ((this.participant.data.status === 'ENROLLED' || this.isLostToFollowUp())
      && this.participant.data.medicalProviders != null && this.participant.medicalRecords != null
      && this.participant.data.medicalProviders.length > 0 && this.participant.medicalRecords.length > 0);

    this.sortActivities();
    this.addMedicalProviderInformation();
    if((this.role.allowedToDoOrderSequencing() || this.role.canViewSeqOrderStatus()) && this.hasSequencingOrders) {
      this.getMercuryEligibleSamples();
      this.canSequence = this.canHaveSequencing(this.participant);
    }
  }

  private handleParticipantProfileUpdate(): void {
    let checkUpdateStatusCounter = 0;
    this.checkParticipantStatusInterval = setInterval(() => {
      if (this.updatingParticipant) {
        if (checkUpdateStatusCounter >= 5) {
          this.updatingParticipant = false;
          this.openResultDialog('Your update has been saved, but the system is unable to display it at the moment. \n' +
            'Please try refreshing this page or come back to it later to see the update. Sorry for any inconvenience.');
          checkUpdateStatusCounter = 0;
          return;
        }
        checkUpdateStatusCounter += 1;
        this.dsmService.checkUpdatingParticipantStatus().subscribe({
          next: data => {
            const parsedData = JSON.parse(data.body);
            if (parsedData['resultType'] === 'SUCCESS'
              && this.isReturnedUserAndParticipantTheSame(parsedData)) {
              this.updateParticipantObjectOnSuccess();
              this.openResultDialog('Participant successfully updated');
            } else if (parsedData['resultType'] === 'ERROR'
              && this.isReturnedUserAndParticipantTheSame(parsedData)) {
              this.openResultDialog(parsedData['errorMessage']);
            }
            checkUpdateStatusCounter = 0;
          },
          error: () => {
            this.openResultDialog('Error - Failed to update participant');
            checkUpdateStatusCounter = 0;
          }
        });
      }
    }, 5000);
  }

  addMedicalProviderInformation(): void {
    if (this.participant != null && this.participant.data != null
      && this.participant.data.profile != null && this.participant.data.medicalProviders != null
      && this.participant.medicalRecords != null && this.participant.medicalRecords.length > 0) {
      this.participant.medicalRecords.forEach(medicalRecord => {
        const medicalProvider = this.participant.data.medicalProviders.find(medProvider => {
          const tmpId = medProvider.legacyGuid != null && medProvider.legacyGuid !== 0 ?
            medProvider.legacyGuid : medProvider.guid;
          return tmpId === medicalRecord.ddpInstitutionId;
        });
        if (medicalProvider) {
          medicalRecord.type = medicalProvider.type;
          medicalRecord.nameDDP = medicalProvider.physicianName;
          medicalRecord.institutionDDP = medicalProvider.institutionName;
          medicalRecord.streetAddressDDP = medicalProvider.street;
          medicalRecord.cityDDP = medicalProvider.city;
          medicalRecord.stateDDP = medicalProvider.state;
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    if (!this.selectedActivityCode || this.scrolled || !document.getElementById(this.selectedActivityCode)) {
      return;
    }

    document.getElementById(this.selectedActivityCode).scrollIntoView();
    this.scrolled = true;
  }

  ngOnDestroy(): void {
    clearInterval(this.checkParticipantStatusInterval);
    this.subscriptions.unsubscribe();
  }

  sortActivities(): void {
    this.participant.data.activities.sort(
      ({activityCode: previousActivityCode}: ActivityData, {activityCode: currentActivityCode}: ActivityData) =>
      this.displayOrder(previousActivityCode) - this.displayOrder(currentActivityCode)
    );
  }

  private displayOrder(activityCode: string): number {
    return this.activityDefinitions.find((activityDefinition: ActivityDefinition) =>
      activityDefinition.activityCode === activityCode).displayOrder;
  }

  showFamilyMemberPopUpOnClick(): void {
    this.dialog.open(AddFamilyMemberComponent, {
      data: {participant: this.participant},
      disableClose: true,
    });
  }

  private setDefaultProfileValues(): void {
    this.updatedFirstName = this.participant.data.profile['firstName'];
    this.updatedLastName = this.participant.data.profile['lastName'];
    this.updatedEmail = this.participant.data.profile['email'];
    this.updatedDNC = this.participant.data.profile['doNotContact'];
  }

  private isReturnedUserAndParticipantTheSame(parsedData: any): boolean {
    return parsedData['participantGuid'] === this.participant.data.profile['guid']
      && parsedData['userId'] === this.role.userID();
  }

  private updateParticipantObjectOnSuccess(): void {
    switch (this.taskType) {
      case 'UPDATE_FIRSTNAME': {
        this.participant.data.profile['firstName'] = this.updatedFirstName;
        break;
      }
      case 'UPDATE_LASTNAME': {
        this.participant.data.profile['lastName'] = this.updatedLastName;
        break;
      }
      case 'UPDATE_EMAIL': {
        this.participant.data.profile['email'] = this.updatedEmail;
        break;
      }
      case 'UPDATE_DNC': {
        this.participant.data.profile['doNotContact'] = this.updatedDNC;
        break;
      }
      default: {
        break;
      }
    }
    this.taskType = '';
  }

  private openResultDialog(text: string): void {
    this.updatingParticipant = false;
    this.dialog.open(ParticipantUpdateResultDialogComponent, {
      data: {message: text},
    });
  }

  hasRole(): RoleService {
    return this.role;
  }

  getUtil(): Utils {
    return this.util;
  }

  updateFirstName(): void {
    this.updatingParticipant = true;
    this.taskType = 'UPDATE_FIRSTNAME';
    this.payload['data']['firstName'] = this.updatedFirstName;
    this.dsmService.updateParticipant(JSON.stringify(this.payload)).subscribe({
      error: () => {
        this.openResultDialog('Error - Failed to update participant');
      }
    });
    delete this.payload['data']['firstName'];
  }

  updateLastName(): void {
    this.updatingParticipant = true;
    this.taskType = 'UPDATE_LASTNAME';
    this.payload['data']['lastName'] = this.updatedLastName;
    this.dsmService.updateParticipant(JSON.stringify(this.payload)).subscribe({
      error: () => {
        this.openResultDialog('Error - Failed to update participant');
      }
    });
    delete this.payload['data']['lastName'];
  }

  updateEmail(): void {
    this.updatingParticipant = true;
    this.taskType = 'UPDATE_EMAIL';
    this.payload['data']['email'] = this.updatedEmail;
    this.dsmService.updateParticipant(JSON.stringify(this.payload)).subscribe({
      error: () => {
        this.openResultDialog('Error - Failed to update participant');
      }
    });
    delete this.payload['data']['email'];
  }

  validateEmailInput(changedValue): void {
    const regexToValidateEmail = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regexToValidateEmail.test(changedValue);
    if (isValid) {
      this.isEmailValid = true;
      this.updatedEmail = changedValue;
      this.update.emit(changedValue);
    } else {
      this.isEmailValid = false;
    }
  }

  updateDNC(): void {
    this.updatingParticipant = true;
    this.taskType = 'UPDATE_DNC';
    this.payload['data']['doNotContact'] = this.updatedDNC;
    this.dsmService.updateParticipant(JSON.stringify(this.payload)).subscribe({
      error: () => {
        this.openResultDialog('Error - Failed to update participant');
      }
    });
    delete this.payload['data']['doNotContact'];
  }

  getLanguageName(languageCode: string): string {
    if (this.preferredLanguage != null && this.preferredLanguage.length > 0) {
      const language = this.preferredLanguage.find(obj => obj.languageCode === languageCode);
      if (language != null) {
        return language.displayName;
      }
    }
    return '';
  }

  getGroupHref(group: string): string {
    return '#' + group;
  }

  onOpenChangeAccordionPanel(event: boolean): void {
    if (!event) {
      this.accordionOpenedPanel = '';
    }
  }

  openAccordionPanel(columnName: string): void {
    this.accordionOpenedPanel = columnName;
  }

  isAccordionPanelOpen(columnName: string): boolean {
    return this.showGroupFields || this.accordionOpenedPanel === columnName;
  }

  private loadInstitutions(): void {
    if (this.participant.data != null) {
      if (this.participant.data.status === undefined || this.participant.data.status.indexOf(Statics.EXITED) === -1) {
        this.participantExited = false;
      }
      if (this.participant.data.status === undefined || this.participant.data.status.indexOf(Statics.CONSENT_SUSPENDED) === -1) {
        this.participantNotConsented = false;
      }
      this.pdfs = new Array<PDFModel>();
      if (this.participant.data != null && this.participant.data.dsm != null && this.participant.data.dsm['pdfs'] != null
        && this.participant.data.dsm['pdfs'].length > 0
      ) {
        const tmp = this.participant.data.dsm['pdfs'];
        if (tmp != null && tmp.length > 0) {
          let pos = 1;
          if (this.participant.oncHistoryDetails != null && this.participant.oncHistoryDetails.length > 0) {
            this.pdfs.push(new PDFModel('request', 'Tissue Request PDF', pos));
            pos += 1;
          }
          tmp.forEach((pdf, index) => {
            pdf.order = index + pos; // +2 because 1 is cover pdf
            this.pdfs.push(pdf);
          });
          this.pdfs.push(new PDFModel('irb', 'IRB Letter', tmp.length + pos));
        }
      }
      this.counterReceived = 0;
      for (const mr of this.participant.medicalRecords) {
        if (mr.mrDocumentFileNames != null) {
          const files = mr.mrDocumentFileNames.split(/[\s,|;]+/);
          for (const file of files) {
            if (this.fileListUsed.indexOf(file) === -1) {
              this.fileListUsed.push(file);
            }
          }
        }
        if (mr.crRequired) {
          this.showParticipantRecord = true;
        }
        // add that here in case a mr was received but participant object does not know it
        if (mr.mrReceived) {
          this.counterReceived = this.counterReceived + 1;
        }
      }
      if (this.counterReceived > 0) {
        if (this.hasRole().isAbstracter() || this.hasRole().isQC()) {
          this.loadAbstractionValues();
        }
      }
      if (this.participant.participant != null) {
        this.addEmptyOncHistoryRow();
      }
    }
  }

  addEmptyOncHistoryRow(): void {
    if (this.participant.data.dsm['hasConsentedToTissueSample']) {
      let hasEmptyOncHis = false;
      for (const oncHis of this.participant.oncHistoryDetails) {
        if (oncHis.oncHistoryDetailId === null) {
          hasEmptyOncHis = true;
        } else {
          // get gender information
          if (this.gender == null) {
            this.gender = oncHis.gender;
          } else {
            if (this.gender !== oncHis.gender && oncHis.gender != null) {
              this.gender = 'Discrepancy in gender between the different oncHistories';
            }
          }
        }
        if (oncHis.tissues == null) {
          const tissues: Array<Tissue> = [];
          tissues.push(new Tissue(null, oncHis.oncHistoryDetailId, null, null, null, null,
            null, null, null, null, null, null, null, null
            , null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, false));
          oncHis.tissues = tissues;
        } else if (oncHis.tissues.length < 1) {
          oncHis.tissues.push(new Tissue(null, oncHis.oncHistoryDetailId, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null
            , null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, false));
        }
      }
      if (!hasEmptyOncHis) {
        const tissues: Array<Tissue> = [];
        tissues.push(new Tissue(null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, false));

        const oncHis = new OncHistoryDetail(this.participant.participant.participantId,
          null, null, null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, tissues, null, null, null,
          null, false);
        this.participant.oncHistoryDetails.push(oncHis);
      }
    }
  }

  openMedicalRecord(medicalRecord: MedicalRecord): void {
    if (medicalRecord != null) {
      this.medicalRecord = medicalRecord;
      this.showMedicalRecord = true;
    }
  }

  valueChanged(value: any, parameterName: string, tableAlias: string): void {
    let v;
    if (parameterName === 'additionalValuesJson') {
      v = JSON.stringify(value);
    } else if (typeof value === 'string') {
      this.participant.participant[parameterName] = value;
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.checked != null) {
        v = value.checked;
      }
    }
    if (v !== null) {
      const participantId = this.participant.participant.participantId;
      let ddpParticipantId = this.participant.data.profile['guid'];
      if (this.participant.data.profile['legacyAltPid'] != null && this.participant.data.profile['legacyAltPid'] !== '') {
        ddpParticipantId = this.participant.data.profile['legacyAltPid'];
      }
      const patch1 = new PatchUtil(
        participantId, this.role.userMail(),
        {name: parameterName, value: v}, null, 'ddpParticipantId',
        ddpParticipantId, tableAlias, null, sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
        ddpParticipantId
      );
      patch1.realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      const patch = patch1.getPatch();
      this.currentPatchField = parameterName;
      this.patchFinished = false;
      this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          if (data) {
            if (data instanceof Array) {
              data.forEach((val) => {
                const nameValue = NameValue.parse(val);
                this.participant.participant[nameValue.name] = nameValue.value;
              });
            } else {
              if (data['participantId']) {
                this.participant.participant.participantId = data['participantId'];
              }
            }
          }
          this.currentPatchField = null;
          this.patchFinished = true;
          this.additionalMessage = null;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
          this.additionalMessage = 'Error - Saving changed field \n' + err;
        }
      });
    }
  }

  kitValueChanged(value: any, parameterName: string, sample: Sample): void {
    let v;
    if (typeof value === 'string') {
      sample[parameterName] = value;
      v = value;
    } else if (value != null) {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      }
    }
    if (v != null) {
      const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      const patch1 = new PatchUtil(
        sample.dsmKitRequestId, this.role.userMail(),
        {
          name: parameterName,
          value: v
        }, null, 'dsmKitRequestId', sample.dsmKitRequestId,
        'kit', null, realm, this.participant.data.profile['guid']
      );
      const patch = patch1.getPatch();
      this.currentPatchField = parameterName;
      this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          this.currentPatchField = null;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
        }
      });
    }
  }

  oncHistoryValueChanged(value: any, parameterName: string, oncHis: OncHistoryDetail): void {
    let v;
    const realm: string = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    if (typeof value === 'string') {
      oncHis[parameterName] = value;
      v = value;
    } else if (value != null) {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      }
    }
    if (v !== null) {

      const patch1 = new PatchUtil(
        oncHis.oncHistoryDetailId, this.role.userMail(), {name: parameterName, value: v},
        null, 'participantId', oncHis.participantId, Statics.ONCDETAIL_ALIAS, null,
        realm, this.participant.data.profile['guid']
      );
      const patch = patch1.getPatch();
      this.patchFinished = false;
      this.currentPatchField = parameterName;
      this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          if (data) {
            if (data instanceof Array) {
              data.forEach((val) => {
                const nameValue = NameValue.parse(val);
                oncHis[nameValue.name.substring(3)] = nameValue.value;
              });
            }
          }
          this.patchFinished = true;
          this.currentPatchField = null;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
        }
      });
    }
  }

  public leavePage(): boolean {
    this.medicalRecord = null;
    this.compService.justReturning = true;
    this.leaveParticipant.emit(this.participant);
    this.participant = null;
    return false;
  }

  openTissue(object: any): void {
    if (object != null) {
      this.oncHistoryDetail = object;
      this.showTissue = true;
    }
  }

  onOncHistoryDetailChange(): void {
    this.isOncHistoryDetailChanged = true;
  }

  doRequest(bundle: boolean): void {
    const requestOncHistoryList: Array<OncHistoryDetail> = [];
    for (const oncHis of this.participant.oncHistoryDetails) {
      if (oncHis.selected) {
        requestOncHistoryList.push(oncHis);
      }
    }
    this.downloadRequestPDF(requestOncHistoryList, bundle);
    this.disableTissueRequestButton = true;
    this.source = 'normal';
    this.universalModal.hide();
  }

  requestTissue(bundle: boolean): void {
    this.bundle = bundle;
    this.warning = null;
    let doIt = true;
    let somethingSelected = false;
    let firstOncHis: OncHistoryDetail = null;
    for (const oncHis of this.participant.oncHistoryDetails) {
      if (oncHis.selected) {
        somethingSelected = true;
        if (firstOncHis == null) {
          firstOncHis = oncHis;
          this.facilityName = firstOncHis.facility;
        }
        if (typeof firstOncHis.facility === 'undefined' || firstOncHis.facility == null) {
          this.warning = 'Facility is empty';
          doIt = false;
        } else if (this.participant.kits != null) {
          // no samples for pt
          let kitReturned = false;
          for (const kit of this.participant.kits) {
            if (kit.receiveDate !== 0) {
              kitReturned = true;
              break;
            }
          }
          if (!kitReturned) {
            doIt = false;
            this.warning = 'No samples returned for participant yet';
          }
        } else {
          if (firstOncHis.facility !== oncHis.facility ||
            firstOncHis.phone !== oncHis.phone ||
            firstOncHis.fax !== oncHis.fax) {
            doIt = false;
            this.warning = 'Tissues are not from the same facility';
          }
        }
      }
    }
    if (doIt && this.facilityName != null) {
      this.doRequest(bundle);
    } else {
      this.source = 'warning';
      if (!somethingSelected) {
        this.warning = 'No tissue selected for requesting';
      }
      this.universalModal.show();
    }
  }

  onOncHistoryDetailSelectionChange(): void {
    let oneSelected = false;
    const oncHistories = this.participant.oncHistoryDetails;
    if (oncHistories != null) {
      for (const oncHis of oncHistories) {
        if (oncHis.selected) {
          oneSelected = true;
          break;
        }
      }
    }
    this.disableTissueRequestButton = !oneSelected;
  }

  openNoteModal(item: MedicalRecord): void {
    this.noteMedicalRecord = item;
  }

  saveNote(): void {
    const patch1 = new PatchUtil(
      this.noteMedicalRecord.medicalRecordId, this.role.userMail(),
      {name: 'notes', value: this.noteMedicalRecord.notes},
      null, null, null, Statics.MR_ALIAS, null,
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), this.participant.participant.ddpParticipantId
    );
    const patch = patch1.getPatch();

    this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
      next: () => {
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
        this.additionalMessage = 'Error - Saving paper C/R changes \n' + err;
      }
    });
    this.noteMedicalRecord = null;
    this.universalModal.hide();
  }

  downloadRequestPDF(requestOncHistoryList: Array<OncHistoryDetail>, bundle: boolean): void {
    this.downloading = true;
    this.message = 'Downloading... This might take a while';
    let configName = null;
    if (!bundle) {
      configName = 'tissue';
    }
    this.dsmService.downloadPDF(this.participant.data.profile['guid'],
      null, null, null, null,
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), configName, this.pdfs, requestOncHistoryList
    ).subscribe({
      next: data => {
        const date = new Date();
        this.downloadFile(data, '_TissueRequest_' + this.facilityName + '_' + Utils.getDateFormatted(date, Utils.DATE_STRING_CVS));

        const oncHistories = this.participant.oncHistoryDetails;
        if (oncHistories != null) {
          for (const oncHis of oncHistories) {
            if (oncHis.selected) {
              // TODO: check is it correct ? - shadowed variables `date`
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const date = new Date();
              const formattedDate = Utils.getFormattedDate(date);
              if (oncHis.faxSent == null) {
                oncHis.faxSent = formattedDate;
                oncHis.faxSentBy = this.role.userID();
                this.oncHistoryValueChanged(oncHis.faxSent, 'faxSent', oncHis);
              } else if (oncHis.faxSent2 == null) {
                //If current date is not already on FaxSent1
                if(oncHis.faxSent !== formattedDate) {
                  oncHis.faxSent2 = formattedDate;
                  oncHis.faxSent2By = this.role.userID();
                  this.oncHistoryValueChanged(oncHis.faxSent2, 'faxSent2', oncHis);
                }
              } else if (oncHis.faxSent3 == null) {
                //If current date is not already on either FaxSent1 or FaxSent2
                if(oncHis.faxSent !== formattedDate && oncHis.faxSent2 !== formattedDate) {
                  oncHis.faxSent3 = formattedDate;
                  oncHis.faxSent3By = this.role.userID();
                  this.oncHistoryValueChanged(oncHis.faxSent3, 'faxSent3', oncHis);
                }
              }
              oncHis.changedBy = this.role.userMail();
              oncHis.changed = true;
              oncHis.selected = false;
              this.isOncHistoryDetailChanged = true;
            }
          }
          this.facilityName = null;
        }
        this.downloading = false;
        this.message = 'Download finished.';
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
        this.disableTissueRequestButton = false;
        this.downloading = false;
        this.message = 'Failed to download pdf.';
      }
    });
    window.scrollTo(0, 0);
  }

  downloadFile(data: any, type: string): void {
    const blob = new Blob([data], {type: 'application/pdf'});
    const shortId = this.participant.data.profile['hruid'];
    fileSaver.saveAs(blob, shortId + type + Statics.PDF_FILE_EXTENSION);
  }

  getButtonColorStyle(notes: string): string {
    if (notes != null && notes !== '') {
      return 'primary';
    }
    return 'basic';
  }

  onSelect(data: TabDirective, tabName: string): void {
    if (data instanceof TabDirective) {
      // this.selectedTabTitle = data.heading;
      this.activeTab = tabName;
    }
    if (tabName === 'sequencing' && (this.role.allowedToDoOrderSequencing() || this.role.canViewSeqOrderStatus())
     && this.hasSequencingOrders) {
      this.getMercuryEligibleSamples();
    }
  }

  tabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  displayTab(fieldSetting: FieldSettings): boolean {
    if (fieldSetting != null && fieldSetting.possibleValues != null) {
      const value: Value[] = fieldSetting.possibleValues;
      if (value.length === 1 && value[0] != null && value[0].value != null) {
        if (this.participant != null && this.participant.data != null && this.participant.data.activities != null) {
          const activity = this.participant.data.activities.find(x => x.activityCode === value[0].value);
          return activity != null;
        }
      }
    }
    return true;
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  currentField(field: string): void {
    if (field != null || (field == null && this.patchFinished)) {
      this.currentPatchField = field;
    }
  }

  getInstitutionCount(): number {
    let counter = 0;
    for (const med of this.participant.medicalRecords) {
      if (med.showInstitution()) {
        counter = counter + 1;
      }
    }
    return counter;
  }

  getBloodConsent(): boolean {
    return this.participant.data.dsm['hasConsentedToBloodDraw'];
  }

  getTissueConsent(): boolean {
    return this.participant.data.dsm['hasConsentedToTissueSample'];
  }

  private loadAbstractionValues(): void {
    if (this.participant.participant != null && this.participant.participant.ddpParticipantId != null) {
      this.loadingParticipantPage = true;
      const ddpParticipantId = this.participant.participant.ddpParticipantId;
      this.dsmService.getAbstractionValues(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), ddpParticipantId).subscribe({
        next: data => {
          let jsonData: any | any[];
          if (data != null) {
            jsonData = AbstractionWrapper.parse(data);
            if (jsonData.finalFields != null) {
              this.finalFields = [];
              jsonData.finalFields.forEach((val) => {
                const abstractionFieldValue = AbstractionGroup.parse(val);
                this.finalFields.push(abstractionFieldValue);
              });
            } else {
              if (jsonData.abstraction != null) {
                this.abstractionFields = [];
                jsonData.abstraction.forEach((val) => {
                  const abstractionFieldValue = AbstractionGroup.parse(val);
                  this.abstractionFields.push(abstractionFieldValue);
                });
              }
              if (jsonData.review != null) {
                this.reviewFields = [];
                jsonData.review.forEach((val) => {
                  const abstractionFieldValue = AbstractionGroup.parse(val);
                  this.reviewFields.push(abstractionFieldValue);
                });
              }
              if (jsonData.qc != null) {
                this.qcFields = [];
                jsonData.qc.forEach((val) => {
                  const abstractionFieldValue = AbstractionGroup.parse(val);
                  this.qcFields.push(abstractionFieldValue);
                });
              }
              if (jsonData.abstractionActivities != null) {
                jsonData.abstractionActivities.forEach((val) => {
                  const a = Abstraction.parse(val);
                  if (a.activity === 'abstraction') {
                    this.participant.abstraction = a;
                  } else if (a.activity === 'review') {
                    this.participant.review = a;
                  } else if (a.activity === 'qc') {
                    this.participant.qc = a;
                  } else if (a.activity === 'final') {
                    this.participant.finalA = a;
                  }
                });
              }
            }
          }
          this.loadingParticipantPage = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
        }
      });
    }
  }

  lockParticipant(abstractionData: Abstraction): void {
    this.loadingParticipantPage = true;
    const ddpParticipantId = this.participant.participant.ddpParticipantId;
    this.dsmService.changeMedicalRecordAbstractionStatus(
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
      ddpParticipantId,
      'in_progress',
      abstractionData
    )
      .subscribe({ // need to subscribe, otherwise it will not send!
        next: data => {
          const result = Result.parse(data);
          if (result.code !== 200) {
            this.additionalMessage = 'Couldn\'t lock participant';
          } else {
            if (result.code === 200 && result.body != null) {
              const jsonData: any | any[] = JSON.parse(result.body);
              const abstraction: Abstraction = Abstraction.parse(jsonData);
              if (abstraction.lastChanged === null) {
                abstraction.lastChanged = 0;
              }
              this.participant[abstraction.activity] = abstraction;
              this.activeTab = abstraction.activity;
              if (this.participant.abstractionActivities != null) {
                const activity = this.participant.abstractionActivities
                  .find(abstractActivity => abstractActivity.activity === abstraction.activity);
                if (activity != null) {
                  const index = this.participant.abstractionActivities.indexOf(activity);
                  if (index !== -1) {
                    activity.aStatus = abstraction.aStatus;
                    this.participant.abstractionActivities[index] = activity;
                  }
                } else {
                  this.participant.abstractionActivities.push(abstraction);
                }
              } else {
                this.participant.abstractionActivities = [];
                this.participant.abstractionActivities.push(abstraction);
              }
              this.additionalMessage = null;
            } else {
              this.additionalMessage = 'Error';
            }
          }
          this.loadingParticipantPage = false;
        },
        error: err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.auth.doLogout();
          }
        }
      });
  }

  breakLockParticipant(abstractionData: Abstraction): void {
    const ddpParticipantId = this.participant.participant.ddpParticipantId;
    this.dsmService.changeMedicalRecordAbstractionStatus(
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
      ddpParticipantId,
      'clear',
      abstractionData
    ).subscribe({ // need to subscribe, otherwise it will not send!
      next: data => {
        const result = Result.parse(data);
        if (result.code !== 200) {
          this.additionalMessage = 'Couldn\'t break lock of participant';
        } else {
          if (result.code === 200 && result.body != null) {
            const jsonData: any | any[] = JSON.parse(result.body);
            const abstraction: Abstraction = Abstraction.parse(jsonData);
            this.participant[abstraction.activity] = abstraction;
            const activity = this.participant.abstractionActivities
              .find(abstractActivity => abstractActivity.activity === abstraction.activity);
            if (activity != null) {
              const index = this.participant.abstractionActivities.indexOf(activity);
              if (index !== -1) {
                activity.aStatus = abstraction.aStatus;
                this.participant.abstractionActivities[index] = activity;
              }
            }
            this.additionalMessage = null;
          } else {
            this.additionalMessage = 'Error';
          }
        }
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
      }
    });
  }

  submitParticipant(abstractionData: Abstraction): void {
    const ddpParticipantId = this.participant.participant.ddpParticipantId;
    this.dsmService.changeMedicalRecordAbstractionStatus(
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
      ddpParticipantId,
      'submit',
      abstractionData
    ).subscribe({ // need to subscribe, otherwise it will not send!
      next: data => {
        const result = Result.parse(data);
        if (result.code !== 200 && result.body != null) {
          this.additionalMessage = result.body;
          abstractionData.colorNotFinished = true;
        } else if (result.code === 200 && result.body != null) {
          const jsonData: any | any[] = JSON.parse(result.body);
          const abstraction: Abstraction = Abstraction.parse(jsonData);
          this.participant[abstraction.activity] = abstraction;
          const activity = this.participant.abstractionActivities
            .find(abstractActivity => abstractActivity.activity === abstraction.activity);
          if (activity != null) {
            const index = this.participant.abstractionActivities.indexOf(activity);
            if (index !== -1) {
              activity.aStatus = abstraction.aStatus;
              this.participant.abstractionActivities[index] = activity;
            }
          }
          this.additionalMessage = null;
          abstraction.colorNotFinished = false;
        } else {
          this.errorMessage = 'Something went wrong! Please contact your DSM developer';
        }

        window.scrollTo(0, 0);
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
      }
    });
  }

  abstractionFilesUsedChanged(abstractionData: Abstraction): void {
    this.currentPatchField = 'filesUsed';
    this.patchFinished = false;
    const ddpParticipantId = this.participant.participant.ddpParticipantId;
    this.dsmService.changeMedicalRecordAbstractionStatus(
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
      ddpParticipantId,
      null,
      abstractionData
    ).subscribe({ // need to subscribe, otherwise it will not send!
      next: data => {
        const result = Result.parse(data);
        if (result.code !== 200 && result.body != null) {
          this.additionalMessage = result.body;
        } else if (result.code === 200 && result.body != null) {
          const jsonData: any | any[] = JSON.parse(result.body);
          const abstraction: Abstraction = Abstraction.parse(jsonData);
          this.participant[abstraction.activity] = abstraction;
          this.getFileList(abstraction);
          this.additionalMessage = null;
          this.currentPatchField = null;
          this.patchFinished = true;
        } else {
          this.errorMessage = 'Something went wrong! Please contact your DSM developer';
        }
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
      }
    });
  }

  addFileToParticipant(fileName: string, abstraction: Abstraction): boolean {
    if (abstraction.filesUsed != null && abstraction.filesUsed !== '') {
      let found = false;
      const files = abstraction.filesUsed.split(/[\s,|;]+/);
      for (const file of files) {
        if (file === fileName) {
          found = true;
          break;
        }
      }
      if (!found) {
        abstraction.filesUsed = abstraction.filesUsed.concat(', ' + fileName);
        this.abstractionFilesUsedChanged(abstraction);
      }
    } else {
      abstraction.filesUsed = fileName;
      this.abstractionFilesUsedChanged(abstraction);
    }
    return false;
  }

  getFileList(abstraction: Abstraction): void {
    if (abstraction.filesUsed != null && abstraction.filesUsed !== '') {
      const files = abstraction.filesUsed.split(/[\s,|;]+/);
      for (const file of files) {
        if (this.fileListUsed.indexOf(file) === -1) {
          this.fileListUsed.push(file);
        }
      }
    }
    this.fileListUsed.sort((one, two) => (one > two ? 1 : -1));
  }

  getMedicalRecordName(name: string, ddpInstitutionId: string): string {
    if (this.participant.data != null && this.participant.data.profile != null && this.participant.data.medicalProviders != null) {
      const medicalProvider = this.participant.data.medicalProviders
        .find(medProvider => {
          const tmpId = medProvider.legacyGuid != null && medProvider.legacyGuid !== 0 ?
            medProvider.legacyGuid : medProvider.guid;
          return tmpId === ddpInstitutionId;
        });
      if (name != null && name !== '') {
        return name;
      } else {
        if (medicalProvider != null) {
          if ('PHYSICIAN' === medicalProvider.type) {
            return medicalProvider.physicianName;
          } else {
            return medicalProvider.institutionName;
          }
        }
      }
    }
  }

  getActivityDefinition(code: string, version: string): ActivityDefinition | null {
    if (this.activityDefinitions != null) {
      return this.activityDefinitions.find(x => x.activityCode === code && x.activityVersion === version);
    }
    return null;
  }

  onAdditionalValueChange(evt: any, colName: string): void {
    let v;
    if (typeof evt === 'string') {
      v = evt;
    } else {
      if (evt.srcElement != null && typeof evt.srcElement.value === 'string') {
        v = evt.srcElement.value;
      } else if (evt.value != null) {
        v = evt.value;
      } else if (evt.checked != null) {
        v = evt.checked;
      }
    }
    if (v !== null) {
      if (this.participant.participant != null && this.participant.participant.additionalValuesJson != null) {
        const camelCaseColumnName = Utils.convertUnderScoresToCamelCase(colName);
        this.participant.participant.additionalValuesJson[camelCaseColumnName] = v;
      } else {
        let participantId = this.participant.data.profile['guid'];
        if (this.participant.data.profile['legacyAltPid'] != null && this.participant.data.profile['legacyAltPid'] !== '') {
          participantId = this.participant.data.profile['legacyAltPid'];
        }
        this.participant.participant = new ParticipantDSMInformation(
          null, participantId, sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
          null, null, null, null, null, null, null,
          false, false, false, false, 0, null
        );
        const addArray = {};
        addArray[colName] = v;
        this.participant.participant.additionalValuesJson = addArray;
      }
      this.valueChanged(this.participant.participant.additionalValuesJson, 'additionalValuesJson', 'r');
    }
  }

  // display additional value
  getAdditionalValue(colName: string): string {
    if (this.participant.participant != null && this.participant.participant.additionalValuesJson != null) {
      const camelCaseColumnName = Utils.convertUnderScoresToCamelCase(colName);
      if (this.participant.participant.additionalValuesJson[camelCaseColumnName] != null) {
        return this.participant.participant.additionalValuesJson[camelCaseColumnName];
      }
    }
    return '';
  }

  downloadPDFs(configName: string): void {
    this.disableDownload = true;
    this.dsmService.downloadPDF(this.participant.data.profile['guid'], null, null, null, null,
      this.compService.getRealm(), configName, null, null
    ).subscribe({
      next: data => {
        this.downloadFile(data, '_' + configName);
        this.disableDownload = false;
      },
      error: err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.doLogout();
        }
        this.additionalMessage = 'Error - Downloading consent pdf file\nPlease contact your DSM developer';
        this.disableDownload = false;
      },
    });
  }

  getParticipantData(fieldSetting: FieldSettings, personsParticipantData: ParticipantData): string {
    if (this.participant && this.participant.participantData && personsParticipantData && fieldSetting.columnName) {
      if (personsParticipantData && personsParticipantData.data) {
        if (personsParticipantData.data[fieldSetting.columnName]) {
          return personsParticipantData.data[fieldSetting.columnName];
        } else if (fieldSetting.actions && fieldSetting.actions[0]) {
          if (
            fieldSetting.actions[0].type === 'CALC' && fieldSetting.actions[0].value
            && personsParticipantData.data[fieldSetting.actions[0].value]
          ) {
            return '' + this.countYears(personsParticipantData.data[fieldSetting.actions[0].value]);
          } else if (fieldSetting.actions[0].type === 'SAMPLE' && fieldSetting.actions[0].type2 === 'MAP_TO_KIT') {
            return this.getSampleFieldValue(fieldSetting, personsParticipantData);
          }
        }
      }
    }
    return '';
  }

  getConditionalData(fieldSetting: FieldSettings, personsParticipantData: ParticipantData): string {
    const conditionalFieldSetting: FieldSettings = this.getConditionalDisplayData(fieldSetting);
    if (conditionalFieldSetting) {
      return this.getParticipantData(conditionalFieldSetting, personsParticipantData);
    }
    return '';
  }

  getParticipantForDynamicField(fieldSetting: FieldSettings): string {
    if (this.participant && this.participant.participantData && fieldSetting.columnName) {
      const participantDataFound = this.participant.participantData
        .find(participantData => participantData.data && participantData.data[fieldSetting.columnName] != null);
      if (participantDataFound) {
        return participantDataFound.data[fieldSetting.columnName];
      }
    }
    return '';
  }

  getParticipantAnswersForConditionalDynamicField(fieldSettings: any[]): any[] {
    const answers = [];
    if (this.participant && this.participant.participantData) {
      fieldSettings?.forEach(data => {
        const conditionalFieldSetting = data['conditionalFieldSetting'];
        const participantDataFound = this.participant.participantData
          .find(participantData => participantData.data
            && participantData.data[conditionalFieldSetting.columnName] != null);
        if (participantDataFound) {
          const colName = conditionalFieldSetting.columnName;
          const tempObj = {};
          tempObj[colName] = participantDataFound.data[colName];
          answers.push(tempObj);
        }
      });
    }
    return answers;
  }

  getConditionalParticipantForDynamicField(fieldSetting: FieldSettings): any[] {
      const conditionalDisplayData: [] = this.getConditionalDisplayData(fieldSetting);
    if (conditionalDisplayData?.length > 0) {
        return this.getParticipantAnswersForConditionalDynamicField(conditionalDisplayData);
    }
    return [];
  }

  getConditionalDisplayData(fieldSetting: FieldSettings): any {
    if (fieldSetting.actions) {
      const actionWithConditionalDisplay = fieldSetting.actions.filter(action => action.type === this.CONDITIONAL_DISPLAY);
      if (actionWithConditionalDisplay) {
        return actionWithConditionalDisplay;
      }
    }

    return null;
  }

  getDisplayName(displayName: string, columnName: string): string {
    if (displayName.indexOf('#') > -1) {
      const replacements: string[] = displayName.split('#');
      if (replacements != null && replacements.length > 0 && this.participant != null && this.participant.participantData != null) {
        let tmp = displayName;
        const participantData = this.participant.participantData.find(pData => pData.fieldTypeId === columnName);
        if (participantData != null && participantData.data != null) {
          replacements.forEach(replace => {
            const value = participantData.data[replace.trim()];
            if (value != null) {
              tmp = tmp.replace('#' + replace.trim(), value);
            }
          });
        }
        return tmp;
      }
      return displayName;
    } else {
      return displayName;
    }
  }

  getActivityData(fieldSetting: FieldSettings): any {
    // type was activity or activity_staff and no saved staff answer. therefore lookup the activity answer
    return Utils.getActivityDataValues(fieldSetting, this.participant, this.activityDefinitions);
  }

  getActivityOptions(fieldSetting: FieldSettings): NameValue[] | string[] {
    if (fieldSetting.displayType === 'ACTIVITY' || fieldSetting.displayType === 'ACTIVITY_STAFF') {
      if (fieldSetting.possibleValues != null && fieldSetting.possibleValues[0] != null && fieldSetting.possibleValues[0].value != null
        && fieldSetting.possibleValues[0].type != null) {
        const tmp: string[] = fieldSetting.possibleValues[0].value.split('.');
        if (tmp != null && tmp.length > 1) {
          if (tmp.length === 2) {
            if (this.activityDefinitions != null) {
              const definition: ActivityDefinition = this.activityDefinitions.find(def => def.activityCode === tmp[0]);
              if (definition != null && definition.questions != null) {
                const question = definition.questions.find(q => q.stableId === tmp[1]);
                if (question != null) {// && question.options != null) {
                  if (question.questionType !== 'BOOLEAN' && question.options != null) {
                    const options: NameValue[] = [];
                    for (const option of question.options) {
                      options.push(new NameValue(option.optionText, option.optionStableId));
                    }
                    return options;
                  } else {
                    const options: string[] = [];
                    options.push('Yes');
                    options.push('No');
                    return options;
                  }
                }
              }
            }
          } else if (tmp.length === 3) {
            const options: string[] = [];
            options.push('Yes');
            options.push('No');
            return options;
          }
        }
      }
    }
    return [];
  }

  formConditionalPatch(value: any, fieldSetting: FieldSettings, groupSetting: FieldSettings, dataId?: string): void {
    if (fieldSetting?.actions) {

      let actionWithConditionalDisplay;

      if(value.checkbox) {
        actionWithConditionalDisplay = fieldSetting.actions.find(action => action.conditionalFieldSetting.columnName === value.key);
      } else {
        actionWithConditionalDisplay = fieldSetting.actions.find(action => action.condition === value.key);
      }

      if (actionWithConditionalDisplay){
        const newFieldSetting = actionWithConditionalDisplay.conditionalFieldSetting;
        this.formPatch(value.value, newFieldSetting, groupSetting, dataId);
      }
    }
  }

  private cleanupParticipantData({data: ptData}: ParticipantData): void {
    const SPECIFY = '_SPECIFY';
    const OTHER_SPECIFY = '_OTHER_SPECIFY';

    Object.keys(ptData).filter((key: string) => key.includes(SPECIFY)).forEach((key: string) => {
      if(key.includes('DIAGNOSIS')) {
        const keyForDiagnosis = key.slice(10,-SPECIFY.length);

        if(ptData['DIAGNOSIS'] !== keyForDiagnosis) {
          delete ptData[key];
        }
      } else if(key.includes('OTHER')) {
        const keyForOtherField = key.slice(0, -OTHER_SPECIFY.length);

        if(ptData[keyForOtherField] !== 'OTHER') {
          delete ptData[key];
        }

      } else {
        const keyForCheckboxSpecify = key.slice(0, -SPECIFY.length);

        if(!ptData[keyForCheckboxSpecify]) {
          delete ptData[key];
        }
      }
    });
  }

  formPatch(value: any, fieldSetting: FieldSettings, groupSetting: FieldSettings, dataId?: string): void {
    if (fieldSetting == null || fieldSetting.fieldType == null) {
      this.errorMessage = 'Didn\'t save change';
      return;
    }

    let fieldTypeId = fieldSetting.fieldType;
    if (groupSetting != null) {
      fieldTypeId = groupSetting.fieldType;
    }
    if (
      this.participant != null && this.participant.participantData != null
      && fieldTypeId != null && fieldSetting.columnName != null && dataId != null
    ) {
      let participantData: ParticipantData = this.participant.participantData.find(pData => pData.participantDataId === dataId);
      if (participantData == null) {
        const data: { [k: string]: any } = {};
        data[fieldSetting.columnName] = value;
        participantData = new ParticipantData(null, fieldTypeId, data);
        this.participant.participantData.push(participantData);
      }
      if (participantData != null && participantData.data != null) {
        participantData.data[fieldSetting.columnName] = value;

        this.cleanupParticipantData(participantData);

        const nameValue: { name: string; value: any }[] = [];
        nameValue.push({name: 'd.data', value: JSON.stringify(participantData.data)});
        let participantDataSec: ParticipantData = null;
        let actionPatch: Value[] = null;
        if (fieldSetting.actions != null) {
          fieldSetting.actions.forEach((action) => {
            if (action != null && action.name != null && action.type != null && action.type !== this.CONDITIONAL_DISPLAY) {
              participantDataSec = this.participant.participantData.find(pData => pData.fieldTypeId === action.type);
              if (participantDataSec == null) {
                if (action.type !== 'ELASTIC_EXPORT.workflows' && action.type !== 'PARTICIPANT_EVENT') {
                  const data: { [k: string]: any } = {};
                  data[action.name] = action.value;
                  participantDataSec = new ParticipantData(null, action.type, data);
                } else {
                  // all others studies we do the actions for everyone
                  if (actionPatch === null) {
                    actionPatch = [];
                  }
                  actionPatch.push(action);
                }
              }
              // if (participantDataSec != null && participantDataSec.data != null) {
              //   participantDataSec.data[ action.name ] = action.value;
              //   nameValue.unshift({name: 'd.data', value: JSON.stringify(participantDataSec.data)});
              // }
            }
          });
        }
        if (fieldSetting.fieldType === 'RADIO' && fieldSetting.possibleValues != null) {
          const possibleValue = fieldSetting.possibleValues.find(v => v.name === fieldSetting.columnName && v.values != null);
        }

        let participantId = this.participant.data.profile['guid'];
        if (this.participant.data.profile['legacyAltPid'] != null && this.participant.data.profile['legacyAltPid'] !== '') {
          participantId = this.participant.data.profile['legacyAltPid'];
        }
        const patch = {
          id: participantData.participantDataId,
          parent: 'participantDataId',
          parentId: participantId,
          user: this.role.userMail(),
          fieldId: fieldTypeId,
          realm: sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
          nameValues: nameValue,
          actions: actionPatch,
          tableAlias: 'd',
          ddpParticipantId: participantId
        };

        this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe({ // need to subscribe, otherwise it will not send!
          next: data => {
            if (data) {
              if (data['participantDataId']) {
                if (participantData != null) {
                  participantData.participantDataId = data['participantDataId'];
                }
              }
            }
            this.patchFinished = true;
          },
          error: err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.auth.doLogout();
            }
          }
        });
      }
    }
  }

  createRelativeTabHeading(data: any): string {
    if (data) {
      if (!data.FIRSTNAME) {
        data.FIRSTNAME = '';
      }
      if (!data.COLLABORATOR_PARTICIPANT_ID) {
        data.COLLABORATOR_PARTICIPANT_ID = '';
      }
      return data.FIRSTNAME + ' - ' + data.COLLABORATOR_PARTICIPANT_ID;
    }
    return '';
  }

  getSampleFieldValue(fieldSetting: FieldSettings, personsParticipantData: ParticipantData): string {
    const sample: Sample = this.participant.kits
      .find(kit => kit.bspCollaboratorSampleId === personsParticipantData.data['COLLABORATOR_PARTICIPANT_ID']);
    if (sample && fieldSetting.actions[0].value && sample[fieldSetting.actions[0].value] && fieldSetting.displayType) {
      if (fieldSetting.displayType === 'DATE') {
        return new Date(sample[fieldSetting.actions[0].value]).toISOString().split('T')[0];
      }
      return sample[fieldSetting.actions[0].value];
    }
    return '';
  }

  countYears(startDate: string): number {
    const diff = Date.now() - Date.parse(startDate);
    const diffDate = new Date(diff);
    return Math.abs(diffDate.getUTCFullYear() - 1970);
  }

  findDataId(fieldSetting: FieldSettings): string {
    if (this.participant && this.participant.participantData) {
      const participantDataOfFieldSetting = this.participant.participantData
        .find(participantData => participantData.fieldTypeId === fieldSetting.fieldType);
      if (participantDataOfFieldSetting) {
        return participantDataOfFieldSetting.participantDataId;
      }
    }
    return '';
  }

  doNothing(source: string): boolean { // needed for the menu, otherwise page will refresh!
    this.source = source;
    this.universalModal.show();
    return false;
  }

  public getMercuryEligibleSamples(): void {
    this.canBeSequencedBasedOnLocation = this.participantLocatedNotCAOrNY(this.participant);
    if (!this.canHaveSequencing(this.participant) && !this.canBeSequencedBasedOnLocation) {
      return;
    }
    const realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    const sub1 = this.dsmService.getMercuryEligibleSamples(this.participant.data.profile['guid'], realm).subscribe({
      next: data => {
        const jsonData = data;
        this.sequencingOrdersArray = [];
        if (jsonData) {
          jsonData.forEach((json) => {
              const order = SequencingOrder.parse(json);
              this.sequencingOrdersArray.push(order);
            }
          );
        }

      }
    });
    this.subscriptions.add(sub1);
  }

  participantLocatedNotCAOrNY(participant: Participant): boolean {
    let canBeSequencedBasedOnLocation = false;
    //adult pt
    const prequalActivity = participant.data.activities.find(activity => activity.activityCode === this.PREQUAL);
    if (prequalActivity != null) {
      const countryQuestion = prequalActivity?.questionsAnswers?.find(questionAnswer => questionAnswer.stableId === this.SELF_COUNTRY);
      if (countryQuestion != null && countryQuestion.answer) {
        if (countryQuestion.answer instanceof Array) {
          if (countryQuestion.answer.indexOf(this.SELF_COUNTRY_US) > -1) {
            const stateQuestion = prequalActivity?.questionsAnswers?.find(questionAnswer => questionAnswer.stableId === this.SELF_STATE);
            if (stateQuestion.answer instanceof Array) {
              if (stateQuestion.answer.indexOf(this.SELF_STATE_NY) === -1) {
                canBeSequencedBasedOnLocation = true;
              }
            }
          }
        }
      }
    }
    //pediatric pt
    if (!canBeSequencedBasedOnLocation) {
      const addParticipantActivity = participant.data.activities.find(activity => activity.activityCode === this.ADD_PARTICIPANT);
      if (addParticipantActivity != null) {
        const countryQuestion = addParticipantActivity?.questionsAnswers?.find(
          questionAnswer => questionAnswer.stableId === this.CHILD_COUNTRY);
        if (countryQuestion != null && countryQuestion.answer) {
          if (countryQuestion.answer instanceof Array) {
            if (countryQuestion.answer.indexOf(this.SELF_COUNTRY_US) > -1) {
              const stateQuestion = addParticipantActivity?.questionsAnswers?.find(
                questionAnswer => questionAnswer.stableId === this.CHILD_STATE);
              if (stateQuestion.answer instanceof Array) {
                if (stateQuestion.answer.indexOf(this.SELF_STATE_NY) === -1) {
                  canBeSequencedBasedOnLocation = true;
                }
              }
            }
          }
        }
      }
    }
    return canBeSequencedBasedOnLocation;
  }

  canHaveSequencing(participant: Participant): boolean {
    if (!(this.role.allowedToDoOrderSequencing() || this.role.canViewSeqOrderStatus()) || !this.hasSequencingOrders) {
      return false;
    }

    const enrolled: boolean = participant.data.status === this.ENROLLED;
    let hasGender = false;
    if (this.hasOncHistoryGender(participant)) {
      hasGender = true;
    } else {
      const aboutYouActivity = participant.data.activities.find(activity => activity.activityCode === this.ABOUT_YOU);
      if (aboutYouActivity) {
        const genderQuestion = aboutYouActivity.questionsAnswers.find(questionAnswer => questionAnswer.stableId === this.ASSIGNED_SEX);
        if (genderQuestion && genderQuestion.answer) {
          hasGender = true;
        }
      } else {
        hasGender = false;
      }
    }
    return hasGender && enrolled;
  }

  private hasOncHistoryGender(participant: Participant): boolean {
    return participant.oncHistoryDetails.find(onc => onc.gender !== '' && onc.gender !== undefined && onc.gender !== null) !== undefined;
  }

  downloadParticipantFile(file: ESFile): void {
    if (!this.isFileClean(file)) {
      this.setDownloadMessageAndStatus(this.NOT_SCANNED_FILE_MESSAGE, false);
      return;
    }
    this.setDownloadMessageAndStatus('Downloading... This might take a while', true);
    const realm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    this.dsmService.getSignedUrl(this.participant.data.profile['guid'], file, realm).pipe(
      mergeMap(data => this.dsmService.downloadFromSignedUrl(data['url'])), take(1)).subscribe({
      next: data => {
        const blob = new Blob([data], {type: file.mimeType});
        fileSaver.saveAs(blob, file.fileName);
        this.setDownloadMessageAndStatus(this.SUCCESSFUL_DOWNLOAD_MESSAGE, false);
      },
      error: err => {
        this.setDownloadMessageAndStatus(err, false);
      }
    });
    window.scrollTo(0, 0);
  }

  public isFileClean(file: ESFile): boolean {
    return file.scanResult === this.CLEAN;
  }

  private setDownloadMessageAndStatus(message: string, downloading: boolean): void {
    this.message = message;
    this.downloading = downloading;

  }

  public get hasMrViewPermission(): boolean {
    return this.role.allowedToViewMedicalRecords();
  }

  public get hasViewOnlyDSSDataPermission(): boolean {
    return this.role.viewOnlyDSSData;
  }

  public isLostToFollowUp(): boolean {
    return this.participant.data['status']=== 'CONSENT_SUSPENDED';
  }
}
