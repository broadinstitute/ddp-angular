import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FollowUp } from '../follow-up/follow-up.model';
import { Lookup } from '../lookup/lookup.model';
import { ModalComponent } from '../modal/modal.component';
import { OncHistoryDetailComponent } from '../onc-history-detail/onc-history-detail.component';
import { Participant } from '../participant-list/participant-list.model';
import { PDFModel } from '../pdf-download/pdf-download.model';

import { Auth } from '../services/auth.service';
import { ComponentService } from '../services/component.service';
import { DSMService } from '../services/dsm.service';
import { RoleService } from '../services/role.service';
import { NameValue } from '../utils/name-value.model';
import { PatchUtil } from '../utils/patch.model';
import { Result } from '../utils/result.model';
import { Statics } from '../utils/statics';
import { Utils } from '../utils/utils';
import { MedicalRecord } from './medical-record.model';
import { MedicalRecordLog } from './model/medical-record-log.model';

const fileSaver = require('file-saver');

@Component({
  selector: 'app-medical-record',
  templateUrl: './medical-record.component.html',
  styleUrls: [ './medical-record.component.css' ]
})
export class MedicalRecordComponent implements OnInit {
  @ViewChild(OncHistoryDetailComponent)
  private oncHistoryDetailComponent: OncHistoryDetailComponent;

  @ViewChild(ModalComponent)
  public modal: ModalComponent;

  @Input() participant: Participant;
  @Input() medicalRecord: MedicalRecord;
  @Input() settings;
  @Input() mrCoverPdfSettings;
  @Output() leaveMedicalRecord = new EventEmitter();
  @Output() leaveParticipant = new EventEmitter();

  participantExited = true;

  logsHistory: Array<MedicalRecordLog> = [];
  currentLog: MedicalRecordLog;

  lookups: Array<Lookup> = [];

  errorMessage: string;
  additionalMessage: string;
  message: string = null;
  private isReviewDataChanged = false;

  downloading = false;

  private readonly = false;

  currentPatchField: string;
  patchFinished = true;

  startDate: string;
  endDate: string;
  pdfs: Array<PDFModel> = [];
  selectedPDF: string;
  source: string;

  constructor(private _changeDetectionRef: ChangeDetectorRef, private auth: Auth, private compService: ComponentService,
              private dsmService: DSMService, private router: Router,
               private role: RoleService, private util: Utils, private route: ActivatedRoute) {
    if (!auth.authenticated()) {
      auth.logout();
    }
    this.route.queryParams.subscribe(params => {
      const realm = params[ DSMService.REALM ] || null;
      if (realm != null) {
        //        this.compService.realmMenu = realm;
        this.leaveMedicalRecord.emit(true);
        this.leaveParticipant.emit(true);
      }
    });
  }

  ngOnInit(): void {
    if (this.medicalRecord != null && this.participant != null) {
      this.loadLogs();
      if (this.participant.data == null || this.participant.data.status.indexOf(Statics.EXITED) === -1) {
        this.participantExited = false;
      }
      this.pdfs = new Array<PDFModel>();
        this.pdfs.push(new PDFModel('cover', 'Cover PDF', 1));
      if (this.participant.data != null && this.participant.data.dsm != null && this.participant.data.dsm[ 'pdfs' ] != null) {
        const tmp = this.participant.data.dsm[ 'pdfs' ];
        if (tmp != null && tmp.length > 0) {
          tmp.forEach((pdf, index) => {
            pdf.order = index + 2; // +2 because 1 is cover pdf
            this.pdfs.push(pdf);
          });
        }
        this.pdfs.push(new PDFModel('irb', 'IRB Letter', tmp.length + 2));
      }
      this.startDate = this.participant.data.dsm[ 'diagnosisMonth' ] + '/' + this.participant.data.dsm[ 'diagnosisYear' ];
      this.endDate = Utils.getFormattedDate(new Date());
      this.message = null;
    } else {
      this.errorMessage = 'Error - Information is missing';
    }
    window.scrollTo(0, 0);
  }

  followUpValueChanged(value: string, parameterName: string, i?: number): void {
    let v = value;
    this.medicalRecord.followUps[ i ][ parameterName ] = v;
    const temp: FollowUp[] = [];

    for (const followUp of this.medicalRecord.followUps) {
      if (!followUp.isEmpty()) {
        temp.push(followUp);
      }
    }
    //    this.getMedicalRecord().followUps = temp;
    v = JSON.stringify(temp, this.replacer);
    this.currentPatchField = parameterName + i;
    this.valueChanged(v, 'followUps');
  }

  addNewEmptyFollowUp(): void {
    this.medicalRecord.followUps.push(new FollowUp(null, null, null, null));
  }

  valueChanged(value: any, parameterName: string): void {
    let v;
    if (parameterName === 'additionalValues') {
      v = JSON.stringify(value);
    } else if (typeof value === 'string') {
      if (parameterName !== 'followUps') {
        this.medicalRecord[ parameterName ] = value;
      }
      v = value;
    } else {
      if (value.srcElement != null && typeof value.srcElement.value === 'string') {
        v = value.srcElement.value;
      } else if (value.value != null) {
        v = value.value;
      } else if (value.checked != null) {
        v = value.checked;
      }
    }
    if (v !== null) {
      const participantId: string = this.getParticipantId();
      const realm: string = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
      const patch1 = new PatchUtil(
        this.medicalRecord.medicalRecordId, this.role.userMail(),
        {name: parameterName, value: v}, null, null, participantId,
        Statics.MR_ALIAS, null, realm, this.participant.participant.ddpParticipantId
      );
      const patch = patch1.getPatch();
      this.patchFinished = false;
      if (parameterName !== 'followUps') {
        this.currentPatchField = parameterName;
      }
      this.dsmService.patchParticipantRecord(JSON.stringify(patch)).subscribe(// need to subscribe, otherwise it will not send!
        data => {
          const result = Result.parse(data);
          if (result.code === 200) {
            if (result.body != null) {
              const jsonData: any | any[] = JSON.parse(result.body);
              if (jsonData instanceof Array) {
                jsonData.forEach((val) => {
                  const nameValue = NameValue.parse(val);
                  this.medicalRecord[ nameValue.name ] = nameValue.value;
                });
              }
            }
          }
          this.patchFinished = true;
          this.currentPatchField = null;
        },
        err => {
          if (err._body === Auth.AUTHENTICATION_ERROR) {
            this.router.navigate([ Statics.HOME_URL ]);
          }
          this.additionalMessage = 'Error - Saving changes \n' + err;
        }
      );
    }
  }

  onReviewChange(): void {
    this.isReviewDataChanged = true;
  }

  private loadLogs(): void {
    let jsonData: any[];
    this.dsmService.getMedicalRecordLog(this.medicalRecord.medicalRecordId).subscribe(
      data => {
        jsonData = data;
        jsonData.forEach((val) => {
          const log = MedicalRecordLog.parse(val);
          if (log.type === MedicalRecordLog.DATA_REVIEW) {
            if (log.comments == null && log.date == null) {
              this.currentLog = log;
            } else {
              this.logsHistory.push(log);
            }
          }
        });
        // console.info(`${this.logsHistory.length} log data received: ${JSON.stringify(data, null, 2)}`);
      },
      err => {
        if (err._body === Auth.AUTHENTICATION_ERROR) {
          this.auth.logout();
        }
        this.errorMessage = 'Error - Loading mr log\nPlease contact your DSM developer';
      }
    );
  }

  saveLog(): void {
    if (this.currentLog.date != null && this.currentLog.comments != null && this.currentLog.comments !== '') {
      this.readonly = true;
      this.dsmService.saveMedicalRecordLog(this.currentLog.medicalRecordLogId, JSON.stringify(this.currentLog))
        .subscribe(// need to subscribe, otherwise it will not send!
          _ => {
            this.additionalMessage = 'Data saved';
            this.logsHistory.push(this.currentLog);
            this.currentLog = null;
            this.isReviewDataChanged = false;
          },
          err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.router.navigate([Statics.HOME_URL]);
            }
            this.additionalMessage = 'Error - Saving log data\nPlease contact your DSM developer';
          }
        );
    } else {
      this.additionalMessage = 'Both Date and Comment are required';
    }
    window.scrollTo(0, 0);
  }

  replacer(key, value): any {
    // Filtering out properties
    if (value === null) {
      return undefined;
    }
    return value;
  }

  downloadPDF(configName: string): void {
    if (configName === 'cover' && this.medicalRecord.name == null || this.medicalRecord.name === '') {
      this.additionalMessage = 'Please add a \'Confirmed Institution Name\'';
    } else {
      this.downloading = true;
      this.message = 'Downloading... This might take a while';
      this.dsmService.downloadPDF(this.participant.participant.ddpParticipantId, this.medicalRecord.medicalRecordId,
        this.startDate, this.endDate, this.mrCoverPdfSettings, localStorage.getItem(ComponentService.MENU_SELECTED_REALM),
        configName, this.pdfs, null
      )
        .subscribe(
          data => {
            let tmp = configName;
            if (tmp == null) {
              tmp = 'all';
            }
            this.downloadFile(data, '_' + tmp);
            this.downloading = false;
            this.message = 'Download finished.';
          },
          err => {
            if (err._body === Auth.AUTHENTICATION_ERROR) {
              this.router.navigate([Statics.HOME_URL]);
            }
            this.message = 'Failed to download pdf.';
            this.downloading = false;
          }
        );
    }
    this.modal.hide();
  }

  downloadFile(data: any, type: string): void {
    const blob = new Blob([ data ], {type: 'application/pdf'});
    fileSaver.saveAs(blob, this.participant.data.profile[ 'hruid' ] + type + Statics.PDF_FILE_EXTENSION);
  }

  mrProblem(): void {
    if (!this.medicalRecord.mrProblem) {
      this.medicalRecord.mrProblemText = null;
    }
  }

  logDateChanged(date: string): void {
    this.currentLog.date = date;
    this.isReviewDataChanged = true;
  }

  public leavePage(): boolean {
    this.leaveMedicalRecord.emit(true);
    return false;
  }

  public backToParticipants(): boolean {
    this.leaveParticipant.emit(true);
    return false;
  }

  public setContact(contact: any): void {
    if (contact != null) {
      if (event instanceof MouseEvent) {
        this.medicalRecord.name = contact.field1.value;
        this.valueChanged(contact.field1.value, 'name');
        if (contact.field2.value != null) {
          this.medicalRecord.contact = contact.field2.value;
          this.valueChanged(contact.field2.value, 'contact');
        }
        if (contact.field3.value != null) {
          this.medicalRecord.phone = contact.field3.value;
          this.valueChanged(contact.field3.value, 'phone');
        }
        if (contact.field4.value != null) {
          this.medicalRecord.fax = contact.field4.value;
          this.valueChanged(contact.field4.value, 'fax');
        }
        this.lookups = [];
      } else {
        this.medicalRecord.name = contact;
        this.valueChanged(contact, 'name');
      }
    }
  }

  getUtil(): Utils {
    return this.util;
  }

  getRole(): RoleService {
    return this.role;
  }

  getCompService(): ComponentService {
    return this.compService;
  }

  isPatchedCurrently(field: string): boolean {
    return this.currentPatchField === field;
  }

  isCheckboxPatchedCurrently(field: string): string {
    if (this.currentPatchField === field) {
      return 'warn';
    }
    return 'primary';
  }

  currentField(field: string): void {
    if (field != null || (field == null && this.patchFinished)) {
      this.currentPatchField = field;
    }
  }

  doNothing(source: string): boolean { // needed for the menu, otherwise page will refresh!
    this.source = source;
    this.modal.show();
    return false;
  }

  close(): boolean {
    this.modal.hide();
    return false;
  }

  startDateChanged(date: string): void {
    this.startDate = date;
  }

  endDateChanged(date: string): void {
    this.endDate = date;
  }

  deleteFollowUp(i: number): void {
    if (this.medicalRecord.followUps[ i ].isEmpty()) {
      this.medicalRecord.followUps.splice(i, 1);
    }
  }

  getParticipantEnteredAddress(ddpInstitutionId: string): string {
    if (this.participant != null && this.participant.data != null
      && this.participant.data.profile != null && this.participant.data.medicalProviders != null) {
      const medicalProvider = this.participant.data.medicalProviders.find(medProvider => {
        const tmpId = medProvider.legacyGuid != null && medProvider.legacyGuid !== 0 ?
          medProvider.legacyGuid : medProvider.guid;
        return tmpId === ddpInstitutionId;
      });

      if (medicalProvider != null) {
        let address = '';
        if (medicalProvider.physicianName) {
          address += medicalProvider.physicianName;
        }
        if (medicalProvider.institutionName) {
          address += this.addLineBreak(address);
          address += medicalProvider.institutionName;
        }
        if (medicalProvider.street) {
          address += this.addLineBreak(address);
          address += medicalProvider.street;
        }
        if (medicalProvider.city && medicalProvider.state) {
          // both are not empty, so add them both
          address += this.addLineBreak(address);
          address += medicalProvider.city + ' ' + medicalProvider.state;
        } else {
          // one is not empty, so add that one
          if (medicalProvider.city) {
            address += this.addLineBreak(address);
            address += medicalProvider.city;
          }
          if (medicalProvider.state) {
            address += this.addLineBreak(address);
            address += medicalProvider.state;
          }
        }
        return address;
      }
      return '';
    }
  }

  addLineBreak(address: string): string {
    if (address) {
      return '\n';
    }
    return '';
  }

  getMedicalRecord(): MedicalRecord {
    return this.medicalRecord;
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
      if (this.medicalRecord.additionalValues != null) {
        this.medicalRecord.additionalValues[ colName ] = v;
      } else {
        const addArray = {};
        addArray[ colName ] = v;
        this.medicalRecord.additionalValues = addArray;
      }
      this.valueChanged(this.medicalRecord.additionalValues, 'additionalValues');
    }
  }

  // display additional value
  getAdditionalValue(colName: string): string {
    if (this.medicalRecord.additionalValues != null) {
      if (this.medicalRecord.additionalValues[ colName ] != null) {
        return this.medicalRecord.additionalValues[ colName ];
      }
    }
    return null;
  }

  getParticipantId(): string {
    if (!this.participant.data) {
      return null;
    }
    let participantId = this.participant.data.profile[ 'guid' ];
    if (this.participant.data.profile[ 'legacyAltPid' ]) {
      participantId = this.participant.data.profile[ 'legacyAltPid' ];
    }
    return participantId;
  }
}
